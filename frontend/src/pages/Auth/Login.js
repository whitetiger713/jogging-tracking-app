import React from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GLogin from './GLogin';
import './Style.css';

class Login extends React.Component {
  constructor(props){
    super(props);
    this.userForm = this.userForm.bind(this);
    this.logSuccess = this.logSuccess.bind(this);
    sessionStorage.clear();
  };
  logSuccess(){
    this.props.history.push("/app");
    window.location.reload();
  }
  userForm = (e) => {
    const that = this;
    e.preventDefault();
    axios.post('http://localhost:8080/user/login', {
      email: this.refs.email.value,
      password: this.refs.password.value
    })
    .then(function (response) {
      if(response.data.state === 1){
        var userdata = {'email' : response.data.email, 'loggedIn': response.data.state}
        sessionStorage.setItem('userdata', JSON.stringify(userdata));
        that.logSuccess();
      }
      if(response.data.state === 0){
        toast.error(response.data.message);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  render() {
    return (
      <div className="background">
        <div className="container">
          <div>
            <ToastContainer 
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnVisibilityChange
              draggable
              pauseOnHover
            />
          </div>
          <div className="login pt-5">
            <div className="model-content model-info">
              <div className="model-header">
                <h2>Login</h2>
                <div className="lo-im">
                  <img src="/images/avatar_2x.png" className="user-image" title=" user " alt="user" />
                </div>
              </div>
              <div className="model-body model-spa">
                <div className="login-form">
                  <form onSubmit={ this.userForm }>
                    <input type="email" ref="email" id="email"  placeholder="Email address" required autoFocus />
                    <input type="password"  ref="password" placeholder="Password" required />
                    <div className="signin-rit">
                      <span className="checkbox1">
                        <label className="checkbox">
                          <input type="checkbox" name="checkbox" className="mt-2"/>Remember me </label>
                      </span>
                      <a className="forgot" href="# ">Forgot Password?</a>
                    </div>
                    <input type="submit" value="Login"/>
                  </form>
                  <p><a href="/signup">Create a New Account</a></p>
                  <div className="social-icons agile">
                    <ul>
                      <li>
                        <a href="# " className="facebook ">
                          <img src="/images/fb.png " title="facebook " alt="facebook " />
                        </a>
                      </li>
                      <li>
                        <a href="# " className="twitter ">
                          <img src="/images/tw.png " title="twitter " alt="twitter " />
                        </a>
                      </li>
                      <li>
                        <GLogin state = { this.props }/>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Login;

