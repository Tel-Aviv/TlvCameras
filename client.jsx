import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { HashRouter as Router}  from 'react-router-dom';
import reducers from './src/reducers';

import Main from './src/Main'

let store = createStore(reducers,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());


ReactDOM.render(<Provider store={store}>
                  <Router>
                    <Main />
                  </Router>
                </Provider>,
document.getElementById('root'));
