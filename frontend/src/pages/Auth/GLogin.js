import React from 'react';
import axios from 'axios';
import { GoogleLogin } from 'react-google-login-component';
class GLogin extends React.Component{

  googlesucess = () => {
    console.log(this.props.props);
    this.props.state.history.push('/app');
    window.location.reload();
  }
  responseGoogle = (googleUser) => {

    var id_token = googleUser.getAuthResponse().id_token;
    var googleId = googleUser.getId();
    var signedIn = googleUser.isSignedIn();
    const that = this;
    
    if(signedIn && id_token !== '' && googleId!==''){

      axios.post('http://localhost:8080/user/google', {
        googleId: googleId,
        id_token: id_token
      })
      .then(function (response) {
        if(response.data.state === 1){
          sessionStorage.setItem('loggedIn', response.data.state);
          console.log(response)
          that.googlesucess();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }
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