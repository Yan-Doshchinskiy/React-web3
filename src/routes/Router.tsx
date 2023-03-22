import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import HomePage from 'pages/Home/Home';
import { Pages } from "../types/main";


const Router = () => (
  <Switch>
    <Route exact path={Pages.HOME} component={HomePage} />
    <Redirect from="*" to={Pages.HOME} />
  </Switch>
);

export default Router;
