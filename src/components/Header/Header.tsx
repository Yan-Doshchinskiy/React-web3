import React from "react";
import './Header.scss';
import { ReactComponent as Logo } from 'assets/img/logo.svg';
import BaseButton from "components/ui/BaseButton/BaseButton";
import Pages from "../../types/main";
import useWalletConnection from "../../hooks/useWalletConnection";

type HeaderTab = {
  id: number,
  title: string,
  key: string,
}

const tabs: Array<HeaderTab> = [
  {
    id: 0,
    title: "Tokens",
    key: "info",
  },
  {
    id: 1,
    title: "Staking",
    key: "staking",
  },
  {
    id: 2,
    title: "Panel",
    key: "panel",
  },
  {
    id: 3,
    title: "Transactions",
    key: "transactions",
  },
];

export const Header = () => {
  const { isWalletConnected, connectWallet, disconnectWallet } = useWalletConnection();

  const handleConnect = async () => {
    if (!isWalletConnected) {
      await connectWallet();
    } else {
      await disconnectWallet();
    }
  };
  const buttonText = !isWalletConnected ? 'Connect' : 'Disconnect';
  return (
    <div className="header">
      <Logo className="header__logo"/>
      <div className="header__links">
        {tabs.map((tab) => (
          <a
            className="header__tab"
            key={tab.id}
            href={`${Pages.HOME}#${tab.key}`}
          >
            {tab.title}
          </a>
        ))}
      </div>
      <BaseButton
        className="header__button"
        onClick={handleConnect}
      >
        {buttonText}
      </BaseButton>
    </div>
  );
};

export default Header;



