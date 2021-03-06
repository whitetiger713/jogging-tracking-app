import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { configStore } from './store';
import App from './pages/App';
//import Main from './pages/App/components/Main';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Verify from './pages/Auth/Verify';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css'; 
import registerServiceWorker from './registerServiceWorker';

const store = configStore();
const loggedIn = JSON.parse(sessionStorage.getItem('userdata'));

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
        <Route path="/signup" component={Signup}/>
        <Route path="/verify" component={Verify}/>
      </Switch>
    </Router>
	</Provider>,
	document.getElementById('root'));
registerServiceWorker();
