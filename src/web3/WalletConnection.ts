import Web3 from 'web3';
import { ETH_CHAINS_ID, IListener } from "../types/web3";

declare global {
    interface Window {
        ethereum?: any
    }
}

const chainName = process.env.REACT_APP_CHAIN_NAME as string;
const expectedChainId = Number(process.env.REACT_APP_CHAIN_ID as string);
const rpcUrl = process.env.REACT_APP_RPC_URL as string;

class WalletConnection {
    private static _instance: WalletConnection;
    provider: any;
    web3Wallet: Web3;
    walletAddress?: string;
    chainId?: number;
    isConnected = false;
    listeners: Array<IListener>;
    private constructor() {
        if (WalletConnection._instance) {
            throw new Error('Error - use WalletConnection.getInstance()');
        }
        this.provider = window.ethereum;
        if (this.provider) {
            this.web3Wallet = new Web3(this.provider);
            this.listeners = [];
        } else {
            throw new Error('Metamask wallet is not installed');
        }
    }

    public static getInstance(): WalletConnection {
        if (!WalletConnection._instance) {
            WalletConnection._instance = new WalletConnection();
        }
        return WalletConnection._instance;
    }

    public async connect():Promise<void> {
        if (this.isConnected) {
            throw new Error('Metamask wallet is already connected');
        }
        this.walletAddress = await this.web3Wallet.eth.getCoinbase();
        if (!this.walletAddress) {
            await this.provider.request({ method: 'eth_requestAccounts' });
            this.walletAddress = await this.web3Wallet.eth.getCoinbase();
        }
        this.chainId = await this.web3Wallet.eth.getChainId();
        await this.changeNetwork();
        this.isConnected = true;
    }

    public disconnect():void {

        this.isConnected = false;
        this.listeners.forEach((listener) => {
            this.removeProviderListener(listener);
        });
        this.walletAddress = undefined;
        this.chainId = undefined;
    }


    private async changeNetwork():Promise<void> {
        const isDefaultEthChain = Object.values(ETH_CHAINS_ID).includes(expectedChainId);
        if (!isDefaultEthChain) {
            await this.provider.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: Web3.utils.toHex(expectedChainId),
                    rpcUrls: [rpcUrl],
                    chainName,
                }],
            });
        }
        if (this.chainId !== expectedChainId) {
            await this.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: Web3.utils.toHex(expectedChainId) }],
            });
        }
    }

    public addProviderListener({ name, callback }: IListener):void {
        this.provider.on(name, callback);
        this.listeners.push({ name, callback });
    }

    private removeProviderListener(listener: IListener):void {
        this.provider.removeListener(listener.name, listener.callback);
        this.listeners.filter((item) => item !== listener );
    }

    public fetchContractData(method: string, abi: Array<any>, address: string, params: Array<any>): Promise<any>  {
        const contract = new this.web3Wallet.eth.Contract(abi, address);
        return contract.methods[method](...params).call();
    }

    public async sendContractData(method: string, abi: Array<any>, address: string, params: Array<any>): Promise<any>  {
        const contract = new this.web3Wallet.eth.Contract(abi, address);
        const [
            gasPrice,
            gas
        ] = await Promise.all([
            this.web3Wallet.eth.getGasPrice(),
            contract.methods[method](...params).estimateGas({ from: this.walletAddress })
        ]);
        return contract.methods[method](...params).send({
            from: this.walletAddress,
            gasPrice,
            gas
        });
    }

    public async fetchTransactionHistory(event: string, abi: Array<any>, address: string, filters?: any) {
        const StakingContract = new this.web3Wallet.eth.Contract(abi, address);
        return StakingContract.getPastEvents(event, {
            filter: filters,
            fromBlock: 0,
            toBlock: 'latest'
        });
    }

}

export default WalletConnection;
