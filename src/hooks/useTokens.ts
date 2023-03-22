import { useEffect } from 'react';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import NodeConnection from "../web3/NodeConnection";
import WalletConnection from "../web3/WalletConnection";
import { IExtendedToken, IToken } from "../types/web3";
import ERC20 from "../utils/abis/ERC20";
import { Web3ActionCreators, web3Getters } from "../redux/slices/web3";
import { WEB3_ACTIONS, WEB3_GETTERS } from "../redux/types";
import { shiftedBy } from "../utils/helpers";
import generateError from "../utils/errors";


export interface ITokensAPI {
  stakingToken: IToken,
  rewardToken: IToken,
  extendStakingToken: () => Promise<void>,
  extendRewardToken: () => Promise<void>,
  extendTokensData: () => Promise<void>,
  mintStakingToken: (amount: string) => Promise<void>,
  approve: (amount: string) => Promise<void>,
}

enum Erc20Methods {
  NAME = 'name',
  SYMBOL = 'symbol',
  DECIMALS = 'decimals',
  BALANCE_OF = 'balanceOf',
  ALLOWANCE = 'allowance',
}

const stakingTokenAddress = process.env.REACT_APP_STAKING_TOKEN_ADDRESS as string;
const stakingContract = process.env.REACT_APP_STAKING_CONTRACT as string;

const useTokens = (): ITokensAPI => {
  const isWalletConnected = useSelector(web3Getters[WEB3_GETTERS.GET_WALLET_IS_CONNECTED]);
  const stakingToken = useSelector(web3Getters[WEB3_GETTERS.GET_STAKING_TOKEN]);
  const rewardToken = useSelector(web3Getters[WEB3_GETTERS.GET_REWARD_TOKEN]);

  const {
    [WEB3_ACTIONS.SET_STAKING_TOKEN_DATA]: setStakingToken,
    [WEB3_ACTIONS.SET_REWARD_TOKEN_DATA]: setRewardToken,
  } = Web3ActionCreators();

  const web3Wallet = WalletConnection.getInstance();
  const web3Node = NodeConnection;

  const payloads = {
    [Erc20Methods.NAME]: [],
    [Erc20Methods.SYMBOL]: [],
    [Erc20Methods.DECIMALS]: [],
    [Erc20Methods.BALANCE_OF]: [web3Wallet.walletAddress],
    [Erc20Methods.ALLOWANCE]: [web3Wallet.walletAddress, stakingContract],
  };
  const fetchTokenByNode = async (token: IToken): Promise<IToken> => {
    const methods = [Erc20Methods.NAME, Erc20Methods.SYMBOL, Erc20Methods.DECIMALS];
    const [name, symbol, decimals] = await Promise.all(methods.map((method) => {
      return web3Node.fetchContractData(method, ERC20, token.address, payloads[method]);
    }));
    return { address: token.address, name, symbol, decimals };
  };

  const fetchTokenByWallet = async (token: IToken): Promise<IExtendedToken> => {
    const methods = [Erc20Methods.BALANCE_OF, Erc20Methods.ALLOWANCE];
    const [balance, allowance] = await Promise.all(methods.map((method) => {
      return web3Wallet.fetchContractData(method, ERC20, token.address, payloads[method]);
    }));
    return { balance, allowance };
  };

  const initStakingToken = async () => {
    const stakingResult = await fetchTokenByNode(stakingToken);
    setStakingToken(stakingResult);
  };

  const initRewardToken = async () => {
    const rewardResult = await fetchTokenByNode(rewardToken);
    setRewardToken(rewardResult);
  };

  const initTokensData = async () => {
    await initStakingToken();
    await initRewardToken();
  };

  const extendStakingToken = async () => {
    const stakingTokenExtendData = await fetchTokenByWallet(stakingToken);
    setStakingToken({
      balance: stakingTokenExtendData.balance,
      allowance: stakingTokenExtendData.allowance,
    });
  };

  const extendRewardToken = async () => {
    const rewardTokenExtendData = await fetchTokenByWallet(rewardToken);
    setRewardToken({
      balance: rewardTokenExtendData.balance,
      allowance: rewardTokenExtendData.allowance,
    });
  };

  const extendTokensData = async () => {
    await extendStakingToken();
    await extendRewardToken();
  };

  const mintStakingToken = async (amount: string) => {
    try {
      const bigAmount = shiftedBy(amount, stakingToken.decimals);
      await web3Wallet.sendContractData('mint', ERC20, stakingTokenAddress, [web3Wallet.walletAddress, bigAmount]);
      await extendStakingToken();
    } catch (e) {
      toast.error(generateError(e as Error));
    }
  };

  const approve = async (amount: string) => {
    try {
      const bigAmount = shiftedBy(amount, stakingToken.decimals);
      await web3Wallet.sendContractData('approve', ERC20, stakingTokenAddress, [stakingContract, bigAmount]);
      await extendStakingToken();
    } catch (e) {
      toast.error(generateError(e as Error));
    }
  };

  useEffect(() => {
    try {
      initTokensData();
    } catch (e) {
      toast.error(generateError(e as Error));
    }
  }, []);
  useEffect(() => {
    if (isWalletConnected) {
      try {
        extendTokensData();
      } catch (e) {
        toast.error(generateError(e as Error));
      }
    }
  }, [isWalletConnected]);

  return {
    stakingToken,
    rewardToken,
    extendStakingToken,
    extendRewardToken,
    extendTokensData,
    mintStakingToken,
    approve,
  };
};

export default useTokens;
