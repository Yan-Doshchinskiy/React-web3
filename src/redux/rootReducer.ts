import { combineReducers } from "redux";
import { web3 } from "redux/slices/web3";


const rootReducer = combineReducers({
  web3: web3.reducer
});

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;
