import React from 'react';
import axios from 'axios';
import './Style.css';

class SignupPage extends React.Component {
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
        sessionStorage.setItem('username', response.data.email);
        sessionStorage.setItem('loggedIn', response.data.success);
        that.logSuccess();
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  render() {
    return (
      <div className="container">
        <div className="signup mt-5">
          <div className="model-content model-info">
            <div className="model-header">
              <h2>SignUp</h2>
              <div className="lo-im">
                <img src="/images/avatar_2x.png" className="user-image" title=" user " alt="user" />
              </div>
            </div>
            <div className="model-body model-spa">
              <div className="login-form">
                <form onSubmit={ this.userForm } id="signup">
                  <ol>
                    <li>
                      <input type="text" name="name" placeholder="Full name" required/>
                    </li>
                    <li>
                      <input type="email" id="email" name="email" placeholder="Mail@example.com" title="Please enter a valid email" required/>
                    </li>
                    <li>
                      <input type="password" className="lock" name="password1" title="Minimum 8 characters, one number, one uppercase and one lowercase letter"
                        pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*" placeholder="Password" id="password1" required/>
                    </li>
                    <li>
                      <input type="password" name="password2" className="lock" placeholder="Confirm Password" id="password2"/>
                    </li>
                  </ol>
                  <input type="submit" value="Sign Up"/>
                </form>
                <p><a href = "/login"> Login Account</a></p>
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
                      <a href="# " className="googleplus ">
                        <img src="/images/gp.png " title="googleplus " alt="googleplus " />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default SignupPage;

