import React from 'react';
import { Switch, Route } from 'react-router-dom';

import App from './App';

const Main = () => {

    return(<Switch>
              <Route path='/:cameraId' component={App} />
           </Switch>);

};

export default Main;
