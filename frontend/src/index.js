import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { configStore } from './store';
import App from './pages/App';
//import Main from './pages/App/components/Main';
import Login from './pages/Auth/Login';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import registerServiceWorker from './registerServiceWorker';

const store = configStore();
const loggedIn = sessionStorage.getItem('loggedIn');

ReactDOM.render(
	<Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" render={() =>(
          loggedIn ? (<Route component={App} />)
          : (<Route component={Login} />)
        )} />
        <Route path="/app" render={() =>(
          loggedIn ? (<Route component={App} />)
          : (<Route component={Login} />)
        )} />
        <Route path="/login" component={Login}/>
      </Switch>
    </Router>
	</Provider>,
	document.getElementById('root'));
registerServiceWorker();
