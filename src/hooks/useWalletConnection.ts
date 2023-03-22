import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Web3ActionCreators, web3Getters } from "../redux/slices/web3";
import { WEB3_ACTIONS, WEB3_GETTERS } from "../redux/types";
import { IListener, WEB3_LISTENERS } from "../types/web3";
import WalletConnection from "../web3/WalletConnection";
import generateError from "../utils/errors";

interface IWalletAPI {
    isWalletConnected: boolean,
    connectWallet: () => Promise<void>,
    disconnectWallet: () => void
}

const chainId = Number(process.env.REACT_APP_CHAIN_ID as string);

const useWalletConnection = ():IWalletAPI => {
    const isWalletConnected = useSelector(web3Getters[WEB3_GETTERS.GET_WALLET_IS_CONNECTED]);

    const {
        [WEB3_ACTIONS.SET_WALLET_IS_CONNECTED]: setWalletIsConnected,
    } = Web3ActionCreators();

    const web3Wallet = WalletConnection.getInstance();

    // listeners
    const changeChainListener = (payload: string): void => {
        const newChain = parseInt(payload, 16);
        if (newChain !== chainId) {
            web3Wallet.disconnect();
            setWalletIsConnected(false);
        }
    };
    const changeAccountListener = (): void => {
        web3Wallet.disconnect();
        setWalletIsConnected(false);
    };
    const listeners:Array<IListener> = [
        { name: WEB3_LISTENERS.ACCOUNT_CHANGED, callback: changeAccountListener },
        { name: WEB3_LISTENERS.CHAIN_CHANGED, callback: changeChainListener },
    ];
    // wallet connect function
    const connectWallet = async ():Promise<void> => {
        try {
            if (!web3Wallet.isConnected) {
                await web3Wallet.connect();
                listeners.forEach(listener => {
                    web3Wallet.addProviderListener(listener);
                });
                setWalletIsConnected(true);
            }
        } catch (e) {
            toast.error(generateError(e as Error));
            setWalletIsConnected(false);
        }
    };
    const disconnectWallet =  ():void => {
        try {
            if (web3Wallet.isConnected) {
                web3Wallet.disconnect();
                setWalletIsConnected(false);
            }
        } catch (e) {
            toast.error(generateError(e as Error));
        }
    };
    return {
        isWalletConnected,
        connectWallet,
        disconnectWallet
    };
};

export default useWalletConnection;
