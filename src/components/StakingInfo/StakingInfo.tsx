import React from "react";
import './StakingInfo.scss';
import { useSelector } from "react-redux";
import { IStaking } from "../../types/web3";
import useStaking from "../../hooks/useStaking";
import { shiftedBy } from "../../utils/helpers";
import useTokens from "../../hooks/useTokens";
import BaseButton from "../ui/BaseButton/BaseButton";
import { web3Getters } from "../../redux/slices/web3";
import { WEB3_GETTERS } from "../../redux/types";

const labels = ['Address', 'Total Staked', 'User Staked', 'Claimablel'];
const values: Array<keyof IStaking> = ['address','totalStaked', 'userStaked', 'claimable'];

export const StakingInfo = () => {
  const isWalletConnected = useSelector(web3Getters[WEB3_GETTERS.GET_WALLET_IS_CONNECTED]);
  const { stakingToken, rewardToken } = useTokens();
  const { fetchStakingByWallet, staking, claim } = useStaking();
  const displayStaking:IStaking = {
    address: staking.address,
    totalStaked: staking.totalStaked ? shiftedBy(staking.totalStaked, stakingToken.decimals, 1) : '-',
    userStaked: staking.userStaked ? shiftedBy(staking.userStaked, stakingToken.decimals, 1) : '-',
    claimable: staking.claimable ? shiftedBy(staking.claimable, rewardToken.decimals, 1) : '-',
  };
  return (
    <section className="staking">
      <div className="staking__anchor" id="staking"/>
      <div className="staking__wrapper">
        <div className="staking__column">
          <h2 className="staking__subtitle">Staking info</h2>
          <div className="staking__list">
            <ul className="staking__labels">
              {labels.map((label) => (
                <span key={label}>{label}:</span>
              ))}
            </ul>
            <ul className="staking__labels">
              {values.map((key) => (
                <span key={key}>{displayStaking[key]}</span>
              ))}
            </ul>

          </div>
        </div>
        <div className="staking__column staking__column_buttons">
          <BaseButton disabled={!isWalletConnected} className="staking__button" mode='yellow' onClick={fetchStakingByWallet}>refresh</BaseButton>
          <BaseButton disabled={!isWalletConnected} className="staking__button" mode="blue" onClick={claim}>claim</BaseButton>
        </div>
      </div>
    </section>
  );
};

export default StakingInfo;
