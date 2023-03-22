import { bindActionCreators, createSlice, PayloadAction, SliceCaseReducers } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { RootState } from "../store";
import { WEB3_ACTIONS, WEB3_GETTERS } from "../types";

interface IWeb3State {
  isWalletConnected: boolean,
}

const initialState:IWeb3State = {
  isWalletConnected: false,
};

interface IWeb3Actions extends SliceCaseReducers<IWeb3State>{
  [WEB3_ACTIONS.SET_WALLET_IS_CONNECTED] : (state: IWeb3State, Action: PayloadAction<boolean>) => void,
}



export const web3 = createSlice<IWeb3State, IWeb3Actions, 'web3'>({
  initialState,
  name: "web3",
  reducers: {
    [WEB3_ACTIONS.SET_WALLET_IS_CONNECTED](state, { payload }) {
      state.isWalletConnected = payload;
    },
  }
});

export interface IWeb3Getters<S = RootState>  {
  [WEB3_GETTERS.GET_WALLET_IS_CONNECTED]: (state: S) => boolean,
}

export const web3Getters:IWeb3Getters = {
  [WEB3_GETTERS.GET_WALLET_IS_CONNECTED]: (state) => state.web3.isWalletConnected,
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
