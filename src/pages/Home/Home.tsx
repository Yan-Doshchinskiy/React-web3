import React from 'react';
import './Home.scss';
import TokenInfo from 'components/TokenInfo/TokenInfo';
import StakingInfo from "../../components/StakingInfo/StakingInfo";
import StakingPanel from "../../components/StakingPanel/StakingPanel";
import TransationTable from "../../components/TransationTable/TransationTable";


export const Home = () => {
    return (
      <div className="home">
        <TokenInfo  />
        <StakingInfo />
        <StakingPanel />
        <TransationTable />
      </div>
    );
};

export default Home;
