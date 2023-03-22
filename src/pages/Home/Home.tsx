import React from 'react';
import './Home.scss';
import TokenInfo from 'components/TokenInfo/TokenInfo';
import StakingInfo from "../../components/StakingInfo/StakingInfo";
import StakingPanel from "../../components/StakingPanel/StakingPanel";
import TransationTable from "../../components/TransationTable/TransationTable";
import useTokens from "../../hooks/useTokens";
import useStaking from "../../hooks/useStaking";


export const Home = () => {
  const tokensAPI = useTokens();
  const stakingAPI = useStaking({ tokensAPI });
    return (
      <div className="home">
        <TokenInfo tokensAPI={tokensAPI}  />
        <StakingInfo tokensAPI={tokensAPI} stakingAPI={stakingAPI} />
        <StakingPanel tokensAPI={tokensAPI} stakingAPI={stakingAPI} />
        <TransationTable stakingAPI={stakingAPI} />
      </div>
    );
};

export default Home;
