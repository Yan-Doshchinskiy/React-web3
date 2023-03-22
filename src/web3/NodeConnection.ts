import Web3 from 'web3';

const REACT_APP_NODE_URL = process.env.REACT_APP_NODE_URL as string;

export class NodeConnection {
    web3Node: Web3;

    constructor(nodeUrl = REACT_APP_NODE_URL) {
        this.web3Node = new Web3(nodeUrl);
    }

    public fetchContractData(method: string, abi: Array<any>, address: string, params: Array<any>): Promise<any>  {
        const contract = new this.web3Node.eth.Contract(abi, address);
        return contract.methods[method](...params).call();
    }
}

export default new NodeConnection();
