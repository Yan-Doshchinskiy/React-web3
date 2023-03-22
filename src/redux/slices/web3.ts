import { bindActionCreators, createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { RootState } from "../store";
import { WEB3_ACTIONS, WEB3_GETTERS } from "../types";
import { IStaking, IToken, ITransactionRow } from "../../types/web3";



interface IWeb3State {
  isWalletConnected: boolean,
  stakingToken: IToken,
  rewardToken: IToken,
  staking: IStaking
  transactions: Array<ITransactionRow>
}

const stakingTokenAddress = process.env.REACT_APP_STAKING_TOKEN_ADDRESS as string;
const rewardTokenAddress = process.env.REACT_APP_REWARD_TOKEN_ADDRESS as string;
const stakingContract = process.env.REACT_APP_STAKING_CONTRACT as string;

const initialTokenState = {
  address: '',
  name: '',
  symbol: '',
  decimals: '0',
  balance: '0'
};

const initialStakingState: IStaking = {
  address: '',
  totalStaked: '0',
  userStaked: '0',
  claimable: '0',
};

const initialState:IWeb3State = {
  isWalletConnected: false,
  stakingToken: {
    ...initialTokenState,
    address: stakingTokenAddress,
  },
  rewardToken: {
    ...initialTokenState,
    address: rewardTokenAddress,
  },
  staking: {
    ...initialStakingState,
    address: stakingContract
  },
  transactions: [],
};

interface IWeb3Actions extends SliceCaseReducers<IWeb3State>{
  [WEB3_ACTIONS.SET_WALLET_IS_CONNECTED] : (state: IWeb3State, Action: PayloadAction<boolean>) => void,
  [WEB3_ACTIONS.SET_STAKING_TOKEN_DATA] : (state: IWeb3State, Action: PayloadAction<Partial<IToken>>) => void,
  [WEB3_ACTIONS.SET_REWARD_TOKEN_DATA] : (state: IWeb3State, Action: PayloadAction<Partial<IToken>>) => void,
  [WEB3_ACTIONS.SET_STAKING_CONTRACT_DATA] : (state: IWeb3State, Action: PayloadAction<Partial<IStaking>>) => void,
  [WEB3_ACTIONS.SET_TRANSACTIONS] : (state: IWeb3State, Action: PayloadAction<Array<ITransactionRow>>) => void,
}

export const web3 = createSlice<IWeb3State, IWeb3Actions, 'web3'>({
  initialState,
  name: "web3",
  reducers: {
    [WEB3_ACTIONS.SET_WALLET_IS_CONNECTED](state, { payload }) {
      state.isWalletConnected = payload;
    },
    [WEB3_ACTIONS.SET_STAKING_TOKEN_DATA](state, { payload }) {
      state.stakingToken = { ...state.stakingToken, ...payload };
    },
    [WEB3_ACTIONS.SET_REWARD_TOKEN_DATA](state, { payload }) {
      state.rewardToken = { ...state.rewardToken, ...payload };
    },
    [WEB3_ACTIONS.SET_STAKING_CONTRACT_DATA](state, { payload }) {
      state.staking = { ...state.staking, ...payload };
    },
    [WEB3_ACTIONS.SET_TRANSACTIONS](state, { payload }) {
      state.transactions = payload;
    },
  }
});

export interface IWeb3Getters<S = RootState>  {
  [WEB3_GETTERS.GET_WALLET_IS_CONNECTED]: (state: S) => boolean,
  [WEB3_GETTERS.GET_STAKING_TOKEN]: (state: S) => IToken,
  [WEB3_GETTERS.GET_REWARD_TOKEN]: (state: S) => IToken,
  [WEB3_GETTERS.GET_STAKING_CONTRACT_DATA]: (state: S) => IStaking,
  [WEB3_GETTERS.GET_TRANSACTIONS]: (state: S) => Array<ITransactionRow>,
}

export const web3Getters:IWeb3Getters = {
  [WEB3_GETTERS.GET_WALLET_IS_CONNECTED]: (state) => state.web3.isWalletConnected,
  [WEB3_GETTERS.GET_STAKING_TOKEN]: (state) => state.web3.stakingToken,
  [WEB3_GETTERS.GET_REWARD_TOKEN]: (state) => state.web3.rewardToken,
  [WEB3_GETTERS.GET_STAKING_CONTRACT_DATA]: (state) => state.web3.staking,
  [WEB3_GETTERS.GET_TRANSACTIONS]: (state) => state.web3.transactions,
};

export const Web3ActionCreators = () => {
  const dispatch = useDispatch();
  return bindActionCreators(
    {
      ...web3.actions
    },
    dispatch
  );
};
