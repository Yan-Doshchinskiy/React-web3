import React, { FunctionComponent } from 'react';
import './Layout.scss';
import Header from 'components/Header/Header';

export const Layout:FunctionComponent = ({ children }) => {
    return (
      <div className="layout">
        <Header />
        {children}
      </div>
    );
};

export default Layout;
