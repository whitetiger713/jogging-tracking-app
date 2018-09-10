import React from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Style.css';

var email = sessionStorage.getItem('verifyemail');

class VerifyPage extends React.Component {
  constructor(props){
    super(props);
    this.userForm = this.userForm.bind(this);
    this.logSuccess = this.logSuccess.bind(this);
  };
  logSuccess(){
    this.props.history.push("/app");
    window.location.reload();
  }
  userForm = (e) => {
    const that = this;
    e.preventDefault();
   
    var key = this.refs.key.value;
    axios.get(`http://localhost:8080/user/verify?id=${key}&email=${email}`)
    .then(function (response) {
      if(response.data.state === 1){
        toast.success(response.data.message);
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
        <div className="login mt-5">
          <div className="model-content model-info">
            <div className="model-header">
              <h2>Email Verify</h2>
              <div className="lo-im">
                <img src="/images/avatar_2x.png" className="user-image" title=" user " alt="user" />
              </div>
            </div>
            <div className="model-body model-spa">
              <div className="login-form">
                <form onSubmit={ this.userForm }>
                  <input type="text" ref="key"  placeholder="TokenKey" required autoFocus />
                  <input type="submit" value="Send Email"/>
                </form>
                <p><a href="/login">Login</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default VerifyPage;

