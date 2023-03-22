import { useEffect } from 'react';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { format } from 'date-fns';
import NodeConnection from "../web3/NodeConnection";
import WalletConnection from "../web3/WalletConnection";
import { IStaking } from "../types/web3";
import { Web3ActionCreators, web3Getters } from "../redux/slices/web3";
import { WEB3_ACTIONS, WEB3_GETTERS } from "../redux/types";
import { shiftedBy } from "../utils/helpers";
import useTokens from "./useTokens";
import generateError from "../utils/errors";
import StakingABI from "../utils/abis/StakingContract";

export interface IStakingAPI {
  staking: IStaking,
  fetchStakingByNode: () => Promise<void>,
  fetchStakingByWallet: () => Promise<void>,
  claim: () => Promise<void>,
  stake: (amount: string) => Promise<void>,
  unstake: (amount: string) => Promise<void>,
  fetchTransactions: () => Promise<void>,
  transactions: Array<any>
}

enum StakingMethods {
  TOTAL_STAKER = 'totalStaked',
  GET_STAKER_DATA = 'getStakerData',
  GET_CLAIMABLE_AMOUNT = 'getClaimableAmount'
}

enum StakingEvents {
  STAKED = 'Staked',
  CLAIMED = 'Claimed',
  UNSTAKED = 'Unstaked'
}

const stakingContract = process.env.REACT_APP_STAKING_CONTRACT as string;

const useStaking = (): IStakingAPI => {
  const { stakingToken, extendStakingToken, extendRewardToken, extendTokensData } = useTokens();

  const staking = useSelector(web3Getters[WEB3_GETTERS.GET_STAKING_CONTRACT_DATA]);
  const transactions = useSelector(web3Getters[WEB3_GETTERS.GET_TRANSACTIONS]);

  const {
    [WEB3_ACTIONS.SET_STAKING_CONTRACT_DATA]: setStaking,
    [WEB3_ACTIONS.SET_TRANSACTIONS]: setTransactions,
  } = Web3ActionCreators();
  const isWalletConnected = useSelector(web3Getters[WEB3_GETTERS.GET_WALLET_IS_CONNECTED]);

  const web3Wallet = WalletConnection.getInstance();
  const web3Node = NodeConnection;

  const payloads = {
    [StakingMethods.TOTAL_STAKER]: [],
    [StakingMethods.GET_STAKER_DATA]: [web3Wallet.walletAddress],
    [StakingMethods.GET_CLAIMABLE_AMOUNT]: [web3Wallet.walletAddress],
  };
  const fetchStakingByNode = async (): Promise<void> => {
    const methods = [StakingMethods.TOTAL_STAKER];
    const [totalStaked] = await Promise.all(methods.map((method) => {
      return web3Node.fetchContractData(method, StakingABI, staking.address, payloads[method]);
    }));
    setStaking({
      totalStaked
    });
  };
  const fetchStakingByWallet = async (): Promise<void> => {
    const methods = [StakingMethods.GET_STAKER_DATA, StakingMethods.GET_CLAIMABLE_AMOUNT];
    const [stakerData, claimable] = await Promise.all(methods.map((method) => {
      return web3Wallet.fetchContractData(method, StakingABI, staking.address, payloads[method]);
    }));
    setStaking({
      claimable,
      userStaked: stakerData.totalAmount
    });
  };
  const fetchFullStakingInfo = async (): Promise<void> => {
    await fetchStakingByNode();
    await fetchStakingByWallet();
  };

  const fetchTransactions = async () => {
    const events = [StakingEvents.STAKED, StakingEvents.UNSTAKED, StakingEvents.CLAIMED];
    const eventsArray = await Promise.all(events.map((event) => {
      return web3Wallet.fetchTransactionHistory(event, StakingABI, staking.address, { sender: web3Wallet.walletAddress });
    }));
    const sortedEvents = eventsArray
      .reduce((acc, rec) => acc.concat(rec), [])
      .sort((a, b) => a.returnValues.time - b.returnValues.time)
      .map((event, index) => ({
        id: index + 1,
        event: event.event,
        blockHash: event.blockHash,
        time: format(Number(event.returnValues.time * 1000), 'dd-MM-yyyy hh:mm:ss'),
        amount: shiftedBy(event.returnValues.amount, stakingToken.decimals, 1),
        asset: stakingToken.symbol,
      }));
    setTransactions(sortedEvents);
  };

  const claim = async () => {
    try {
      await web3Wallet.sendContractData('claim', StakingABI, stakingContract, []);
      await fetchStakingByWallet();
      await extendRewardToken();
      await fetchTransactions();
    } catch (e) {
      toast.error(generateError(e as Error));
    }
  };

  const stake = async (amount: string) => {
    try {
      const bigAmount = shiftedBy(amount, stakingToken.decimals);
      await web3Wallet.sendContractData('stake', StakingABI, stakingContract, [bigAmount]);
      await fetchFullStakingInfo();
      await extendStakingToken();
      await fetchTransactions();
    } catch (e) {
      toast.error(generateError(e as Error));
    }
  };

  const unstake = async (amount: string) => {
    try {
      const bigAmount = shiftedBy(amount, stakingToken.decimals);
      await web3Wallet.sendContractData('unstake', StakingABI, stakingContract, [bigAmount]);
      await fetchFullStakingInfo();
      await extendTokensData();
      await fetchTransactions();
    } catch (e) {
      toast.error(generateError(e as Error));
    }
  };




  useEffect(() => {
    try {
      fetchStakingByNode();
    } catch (e) {
      toast.error(generateError(e as Error));
    }
  }, []);

  useEffect(() => {
    try {
      if (isWalletConnected) {
        fetchStakingByWallet();
        fetchTransactions();
      }
    } catch (e) {
      toast.error(generateError(e as Error));
    }
  }, [isWalletConnected]);

  return {
    staking,
    fetchStakingByNode,
    fetchStakingByWallet,
    claim,
    stake,
    unstake,
    fetchTransactions,
    transactions
  };
};

export default useStaking;
