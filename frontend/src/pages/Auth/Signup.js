import React from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Style.css';

class SignupPage extends React.Component {
  constructor(props){
    super(props);
    this.userForm = this.userForm.bind(this);
    this.logSuccess = this.logSuccess.bind(this);
  };
  logSuccess(){
    this.props.history.push("/verify");
    window.location.reload();
  }
  userForm = (e) => {
    const that = this;
    e.preventDefault();
    if (this.refs.password1.value === this.refs.password2.value){
      axios.post('http://localhost:8080/user/register', {
        email: this.refs.email.value,
        password: this.refs.password1.value,
        name: this.refs.name.value
      })
      .then(function (response) {
        if(response.data.state === 1){
          toast.success(response.data.message);
          console.log(response.data.email);
          sessionStorage.setItem('verifyemail', response.data.email);
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
    else{
        toast.error("Password isn't March! Please input again.");
    }
  }
  render() {
    return (
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
                      <input type="text" ref="name"  placeholder="Full name" required/>
                    </li>
                    <li>
                      <input type="email" id="email" ref="email" placeholder="Mail@example.com" title="Please enter a valid email" required/>
                    </li>
                    <li>
                      <input type="password" className="lock" ref="password1" title="Minimum 8 characters, one number, one uppercase and one lowercase letter"
                        pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*" placeholder="Password" required/>
                    </li>
                    <li>
                      <input type="password" ref="password2" className="lock" placeholder="Confirm Password" required/>
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

