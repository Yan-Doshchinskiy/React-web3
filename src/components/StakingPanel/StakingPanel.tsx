import React, { useState } from "react";
import './StakingPanel.scss';
import { useSelector } from "react-redux";
import * as yup from "yup";
import BigNumber from "bignumber.js";
import useStaking from "../../hooks/useStaking";
import { shiftedBy } from "../../utils/helpers";
import useTokens from "../../hooks/useTokens";
import SingleInput from "../ui/SingleInput/SingleInput";
import { web3Getters } from "../../redux/slices/web3";
import { WEB3_GETTERS } from "../../redux/types";

export const StakingPanel = () => {
  const [isApprove, setIsApprove] = useState(false);
  const isWalletConnected = useSelector(web3Getters[WEB3_GETTERS.GET_WALLET_IS_CONNECTED]);
  const { stakingToken, mintStakingToken, approve } = useTokens();
  const { staking, stake, unstake } = useStaking();
  const checkEnoughAllowance = (amount:string) => {
    const bigAmount = shiftedBy(amount, stakingToken.decimals);
    const condition =  new BigNumber(bigAmount).isGreaterThan(stakingToken?.allowance || 0);
    setIsApprove(condition);
  };
  const handleStake = async (amount: string) => {
    if (isApprove) {
      await approve(amount);
    } else {
      await stake(amount);
    }
  };
  const stakingTokenDisplayBalance = Number(shiftedBy(stakingToken.balance || '0', stakingToken.decimals, 1));
  const stakingDisplayStaked = Number(shiftedBy(staking.userStaked || '0', stakingToken.decimals, 1));
  return (
    <section className="panel">
      <div className="panel__anchor" id="panel"/>
      <h2 className="panel__subtitle">Staking Panel</h2>
      <div className="panel__wrapper">
        <SingleInput
          buttonText="Mint"
          label="Mint Staking Tokens"
          rules={yup.number().required()}
          onSubmit={mintStakingToken}
          disabled={!isWalletConnected}
        />
        <SingleInput
          rules={yup.number().lessThan(stakingTokenDisplayBalance).required()}
          buttonText={isApprove ? 'Approve' : 'Stake'}
          label="Stake"
          onSubmit={handleStake}
          onChange={checkEnoughAllowance}
          disabled={!isWalletConnected}
        />
        <SingleInput
          rules={yup.number().lessThan(stakingDisplayStaked).required()}
          buttonText="unstake"
          label="Unstake"
          onSubmit={unstake}
          disabled={!isWalletConnected}
        />
      </div>
    </section>
  );
};

export default StakingPanel;
