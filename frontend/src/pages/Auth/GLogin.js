import React from 'react';
import axios from 'axios';
import { GoogleLogin } from 'react-google-login-component';
class GLogin extends React.Component{

  googlesucess = () => {
    this.props.state.history.push('/app');
    window.location.reload();
  }
  responseGoogle = (response) => {
    const tokenBlob = new Blob([JSON.stringify({access_token: response.getAuthResponse().access_token}, null, 2)], {type : 'application/json'});
    const options = {
        method: 'POST',
        body: tokenBlob,
        mode: 'cors',
        cache: 'default'
    };
    const that = this;
    fetch('http://localhost:8080/user/google', options).then(r => {
        const token = r.headers.get('x-auth-token');
        console.log(token)
        r.json().then(user => {
            if (token) {
              sessionStorage.setItem('loggedIn', token);
              that.googlesucess();
            }
        });
    })
  }
  render () {
    return (
      <div>
        <GoogleLogin socialId="777279299686-k2ntn2dumtp6vcfirg0chp8j1pig2umd.apps.googleusercontent.com"
                     className="google-login"
                     scope="profile"
                     fetchBasicProfile={false}
                     responseHandler={this.responseGoogle}
        >
          <a className="googleplus ">
            <img src="/images/gp.png " title="googleplus " alt="googleplus "/>
          </a>
        </GoogleLogin>
      </div>
    );
  }
 
 }
 export default GLogin;