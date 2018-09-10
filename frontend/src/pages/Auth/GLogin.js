import React from 'react';
import { GoogleLogin } from 'react-google-login-component';
class GLogin extends React.Component{

  constructor (props, context) {
    super(props, context);
  }
 
  responseGoogle = (googleUser) => {

    var id_token = googleUser.getAuthResponse().id_token;
    var googleId = googleUser.getId();
    console.log(googleUser);
    console.log({ googleId });
    console.log({accessToken: id_token});
    //anything else you want to do(save to localStorage)...
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