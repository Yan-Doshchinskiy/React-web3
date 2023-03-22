import React from "react";
import './TokenInfo.scss';
import { IToken } from "../../types/web3";
import { shiftedBy } from "../../utils/helpers";
import { ITokensAPI } from "../../hooks/useTokens";

interface IProps {
  tokensAPI: ITokensAPI,
}

const labels = ['Address', 'Name', 'Symbol', 'Decimals', 'Balance', 'Allowance'];
const values: Array<keyof IToken> = ['address', 'name', 'symbol', 'decimals', 'balance', 'allowance'];

export const TokenInfo = ({ tokensAPI }: IProps) => {
  const { stakingToken, rewardToken } = tokensAPI;
  const displayStakingToken:IToken = {
    address: stakingToken.address,
    name: stakingToken.name,
    symbol: stakingToken.symbol,
    decimals: stakingToken.decimals,
    balance: stakingToken.balance ? shiftedBy(stakingToken.balance, stakingToken.decimals, 1) : '-',
    allowance: stakingToken.allowance ? shiftedBy(stakingToken.allowance, stakingToken.decimals, 1) : '-',
  };
  const displayRewardToken:IToken = {
    address: rewardToken.address,
    name: rewardToken.name,
    symbol: rewardToken.symbol,
    decimals: rewardToken.decimals,
    balance: rewardToken.balance ? shiftedBy(rewardToken.balance, rewardToken.decimals, 1) : '-',
    allowance: rewardToken.allowance ? shiftedBy(rewardToken.allowance, rewardToken.decimals, 1) : '-',
  };
  return (
    <section className="info">
      <div className="info__anchor" id="info"/>
      <div className="info__wrapper">
        <div className="info__column">
          <h2 className="info__subtitle">Staking Token:</h2>
          {stakingToken.address &&
          <div className="info__list">
            <ul className="info__labels">
              {labels.map((label) => (
                <span key={`stake-${label}`}>{label}:</span>
              ))}
            </ul>
            <ul className="info__labels">
              {values.map((key) => (
                <span key={`stake-${key}`}>{displayStakingToken[key]}</span>
              ))}
            </ul>
          </div>}
        </div>
        <div className="info__column">
          <h2 className="info__subtitle">Reward Token:</h2>
          {rewardToken.address &&
          <div className="info__list">
            <ul className="info__labels">
              {labels.map((label) => (
                <span key={`reward-${label}`}>{label}:</span>
              ))}
            </ul>
            <ul className="info__labels">
              {values.map((key) => (
                <span key={`reward-${key}`}>{displayRewardToken[key]}</span>
              ))}
            </ul>
          </div>}
        </div>
      </div>
    </section>
  );
};

export default TokenInfo;
