import React, { Component } from 'react';
import { Container, Input, Row, Table, Col, Card, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import DateTimePicker from 'react-datetime-picker';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'
import './App.css';
const userInfo = JSON.parse(sessionStorage.getItem('userdata'));
class App extends Component {
  constructor(props) {
    super(props);
    this.usersearch = this.usersearch.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      imgUpload: false,
      joggadd: false,
      imageURL: '',
      startdate: new Date(),
      enddate:new Date(),
      distance: '',
      commit: '',
      jogging_view: false,
      jogging_view_id: '',
      jogging_update: false,
      jogging_update_id: '',
    };

    this.toggle = this.toggle.bind(this);
    this.toggle_joggadd = this.toggle_joggadd.bind(this);
    this.handlejoggingSubmit = this.handlejoggingSubmit.bind(this);
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.jogging_view = this.jogging_view.bind(this);
    this.jogging_update = this.jogging_update.bind(this);
    this.changeDistanceHandler = this.changeDistanceHandler.bind(this);
    this.changeCommitHandler = this.changeCommitHandler.bind(this);
    this.jogging_filter = this.jogging_filter.bind(this);
    
  }
  onChangeDate1 = startdate => this.setState({ startdate })
 
  onChangeDate2 = enddate => this.setState({ enddate })
  
  toggle() {
    this.setState({
      imgUpload: !this.state.imgUpload
    });
  }
  toggle_joggadd() {
    this.setState({
      joggadd: !this.state.joggadd
    });
  }
  componentWillMount(){
    if(!userInfo){
      this.logout();
    }
    else{
      var email = {email: userInfo.email, from: "", to: ""}
      this.props.usersearch(email);
    }
  }
  logout(){
    sessionStorage.clear();
    this.props.history.push("/login");
  }
  usersearch(email) {
    this.props.usersearch(email);
  }
  success_update(){
    window.location.reload();
  }
  
  handleUploadImage(ev) {
    ev.preventDefault();
    var that = this;
    const data = new FormData();
    if(this.uploadInput.files[0]){
      data.append('file', this.uploadInput.files[0]);
      data.append('email', userInfo.email);
      axios.post('http://localhost:8080/user/fileupload', data, {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      }).then((response) => {
        this.setState({ imageURL: `http://localhost:8080/${response.data.file}` });
        that.success_update();
      });
    }
  }
  changeDistanceHandler(e) {
    var value = e.target.value;
    this.setState({ distance: value });
    
  }
  changeCommitHandler(e) {
    var value = e.target.value;
    this.setState({ commit: value });
    
  }
  convertDate = (date) => {
    var datetime = new Date(date);
    var newdate = datetime.getFullYear().toString() + "/" + (datetime.getMonth() + 1).toString() +
          "/" + datetime.getDate() + " ";
    var hours = datetime.getHours() < 10 ? "0"+datetime.getHours().toString() : datetime.getHours().toString();
    var minutes = datetime.getMinutes() < 10 ? "0"+datetime.getMinutes().toString() : datetime.getMinutes().toString();
    newdate = newdate + hours + ":"+ minutes;
    return newdate;
  }
  handlejoggingSubmit = (ev) =>  {  
    ev.preventDefault();
    var start = this.state.startdate;
    var end = this.state.enddate;
    if(start >= end){
      toast.error("Please check startDate and endDate!!");
      return;
    }
    if( this.state.distance === ""){
      toast.error("Please input Distance!!");
      return;
    }
    else{
      var that = this;
      var diff_time =  Math.floor(end.getTime()-start.getTime())/1000/60/60;
      var joggingdata = {
        "distance": this.state.distance,
        "startdate": this.state.startdate,
        "enddate": this.state.enddate,
        "commit" : this.state.commit,
        "email_id": this.props.userdata._id,
        "diff_time" : diff_time
      }
      axios.post('http://localhost:8080/jogging/add', {
        joggingdata
      })
      .then(function (response) {
        if(response.data.state === 1){
          toast.success(response.data.message);
          that.toggle_joggadd();
          setTimeout(function () {
            that.success_update();
          }, 1000);
        }
        if(response.data.state === 0){
          toast.error(response.data.message);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }    
  }
  jogging_view(){
    this.setState({
      jogging_view: !this.state.jogging_view,
    });
  }
  jogging_view_set(id){
    this.setState({
      jogging_view: !this.state.jogging_view,
      jogging_view_id: id
    });
  }
  jogging_update(){
    this.setState({
      jogging_update: !this.state.jogging_update,
    });
  }
  jogging_update_set(id,data){
    this.setState({
      jogging_update: !this.state.jogging_update,
      jogging_update_id: id,
      distance: data.distance,
      startdate: new Date(data.startdate),
      enddate: new Date(data.enddate),
      commit: data.commit
    });
  }
  handlejoggingUpdate = (ev) =>  {  
    ev.preventDefault();
    var start = this.state.startdate;
    var end = this.state.enddate;
    if(start >= end){
      toast.error("Please check startDate and endDate!!");
      return;
    }
    if( this.state.distance === ""){
      toast.error("Please input Distance!!");
      return;
    }
    else{
      var that = this;
      var diff_time =  Math.floor(end.getTime()-start.getTime())/1000/60/60;
      var joggingdata = {
        "id": this.state.jogging_update_id,
        "distance": this.state.distance,
        "startdate": this.state.startdate,
        "enddate": this.state.enddate,
        "commit" : this.state.commit,
        "email_id": this.props.userdata._id,
        "diff_time" : diff_time
      }
      axios.post('http://localhost:8080/jogging/update', {
        joggingdata
      })
      .then(function (response) {
        if(response.data.state === 1){
          toast.success(response.data.message);
          that.jogging_update();
          setTimeout(function () {
            that.success_update();
          }, 1000);
        }
        if(response.data.state === 0){
          toast.error(response.data.message);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }    
  }
  jogging_delete_set(id){
    var that = this;
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui shadow-box p-4 mt-5'>
            <h5>Confirm Alert</h5>
            <h2 >You want to delete this data?</h2>
            <div className="mt-4 text-right">
              <Button size="sm" onClick={onClose} className="mr-2">No</Button>
              <Button color="primary" size="sm" onClick={() => {
                axios.post('http://localhost:8080/jogging/delete', {
                  id
                })
                .then(function (response) {
                  if(response.data.state === 1){
                    toast.success(response.data.message);
                    that.jogging_update();
                    setTimeout(function () {
                      that.success_update();
                    }, 1000);
                  }
                  if(response.data.state === 0){
                    toast.error(response.data.message);
                  }
                })
                .catch(function (error) {
                  console.log(error);
                });
                onClose()
              }}>Yes</Button>
            </div>
          </div>
        )
      }
    })
  }
  jogging_filter(){
    var startdate = this.state.startdate;
    var enddate = this.state.enddate;
    if(startdate && enddate && startdate >= enddate){
      toast.error("Please check startDate and endDate!!");
      return;
    }
    else{
      var email = {email: userInfo.email, from: startdate, to: enddate}
      this.usersearch(email);
    }
  }
  render(){
    const { userdata, jogging, users} = this.props;
    return (
      <div className="App">
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
        <Container className="text-center pt-2">
          <div className="shadow-box">
            <Row>
              <Col sm="12">
                <Button color="warning" className="pull-right mr-5" size="sm" onClick={this.logout}>Logout</Button>
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                <h1 >Jogging APP</h1>
              </Col>
            </Row>
              { userdata &&
                <Row className="pt-5">
                <Col sm="6" lg="3" md={{ size: 4, offset: 2 }}>
                  <Card className="profile-pic p-2" >
                    <img src={ userdata.picture } className="avatar-image" alt="avatar"/>
                    <span className="edit btn-circle">
                      <i className="fa fa-pencil fa-lg" onClick={this.toggle} title="Edit"></i>
                    </span>
                  </Card>
                </Col>
                <Col sm="6" lg="3" md={{ size: 4, offset: 1 }}>
                  <Label className="font-25">{ userdata.name }</Label>
                </Col>
                <Modal isOpen={this.state.imgUpload} toggle={this.toggle} className={this.props.className}>
                  <ModalHeader toggle={this.toggle}>Image Update</ModalHeader>
                    <ModalBody>
                      <Row>
                        <Col sm="6">
                          <Card className="profile-pic p-2">
                            <img src={ this.state.imageURL ? this.state.imageURL : userdata.picture } className="avatar-image" alt="avatar"/>
                          </Card>
                        </Col>
                        <Col sm="5" className="text-center">
                          <form onSubmit={this.handleUploadImage}>
                            <div className="mt-4">
                              <label id="#bb" className="btn btn btn-outline-success"> Different Image
                                <input ref={(ref) => { this.uploadInput = ref; }}  type="file" />
                              </label>
                              <Button color="danger" className="mt-5">Upload</Button>
                            </div>
                          </form>
                        </Col>
                      </Row>
                    </ModalBody>
                  </Modal>
                </Row>
              }
              { userdata && userdata.role === "admin" && 
                <Row>
                  <Col sm="12">
                    <Label className="font-40 font-bule">User and Jogging Data</Label>
                  </Col>
                </Row>
              }
              { userdata && userdata.role === "manager" && 
                <div>
                  <Row>
                    <Col sm="12">
                      <Label className="font-40 font-bule">User Data</Label>
                    </Col>
                  </Row>
                  <Row className="mr-1 ml-1">
                    <Col sm="12">
                      <Button color="primary" size="sm" className="pull-right mb-3" onClick={this.toggle_joggadd}>
                        <i className="fa fa-plus" title="Add"></i>
                      </Button>
                    </Col>
                    <Col sm="12">
                      <Table bordered >
                        <thead>
                          <tr>
                            <th width="5%">No</th>
                            <th width="25%">Picture</th>
                            <th width="20%">Name</th>
                            <th width="20%">Email Address</th>
                            <th width="8%">Activity</th>
                            <th width="10%">Provider</th>
                            <th width="6%">Edit</th>
                            <th width="6%">Del</th>
                          </tr>
                        </thead>
                        <tbody>
                        { users && users.map((url, index) => {
                            return(
                              <tr key={index} >
                                <th className="table-vartical">{index+1}</th>
                                <td width="22%">
                                  <Card className="p-2 card-image" >
                                    <img src={url.picture} className="usertable-image user-image"/>
                                  </Card>
                                </td>
                                <td className="table-vartical">{url.name}</td>
                                <td className="table-vartical">{url.email}</td>
                                <td className="table-vartical">{url.activity ===1 ? <input type="checkbox" checked/>:<input type="checkbox"/>}</td>
                                <td className="table-vartical">{url.provider}</td>
                                <td className="table-vartical"><i className="fa fa-pencil-square-o fa-lg i" onClick={() => {this.user_update_set(url._id, url)}}></i></td>
                                <td className="table-vartical"><i className="fa fa-trash fa-lg i" onClick={() => {this.user_delete_set(url._id)}}></i></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </div>
              }
              { users && users.role === "user" && 
                <div> 
                  <Row>
                    <Col sm="12">
                      <Label className="font-40 font-bule">Jogging Data</Label>
                    </Col>
                  </Row>
                  <Row className="mr-1 ml-1">
                    <Col sm="12">
                      <Label className="font-20">From</Label>
                      <DateTimePicker onChange={this.onChangeDate1} value={this.state.startdate} name="enddate"/>
                      <Label className="font-20">To</Label>
                      <DateTimePicker onChange={this.onChangeDate2} value={this.state.enddate} name="enddate"/>
                      <Button color="success" className="ml-3" onClick={this.jogging_filter}>Filter</Button>
                      <Button color="primary" size="sm" className="pull-right mb-3" onClick={this.toggle_joggadd}>
                        <i className="fa fa-plus" title="Add"></i>
                      </Button>
                    </Col>
                    <Col sm="12">
                      <Table bordered>
                        <thead>
                          <tr >
                            <th width="5%">No</th>
                            <th width="15%">Distance(km)</th>
                            <th width="22%">StartDate</th>
                            <th width="22%">EndDate</th>
                            <th width="15%">Avg Speed(km/h)</th>
                            <th width="7%">View</th>
                            <th width="7%">Edit</th>
                            <th width="7%">Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                        { jogging && jogging.map((url, index) => {
                            return(
                              <tr key={index}>
                                <th>{index+1}</th>
                                <td>{url.distance}</td>
                                <td>{this.convertDate(url.startdate)}</td>
                                <td>{this.convertDate(url.enddate)}</td>
                                <td>{Math.round(url.distance/url.diff_time)}</td>
                                <td><i className="fa fa-eye fa-lg i" onClick={() => {this.jogging_view_set(url._id)}}></i></td>
                                <td><i className="fa fa-pencil-square-o fa-lg i" onClick={() => {this.jogging_update_set(url._id, url)}}></i></td>
                                <td><i className="fa fa-trash fa-lg i" onClick={() => {this.jogging_delete_set(url._id)}}></i></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                      { jogging && jogging.map((url, index) => { 
                        if(url._id === this.state.jogging_view_id && this.state.jogging_view ){
                          return(
                            <Modal isOpen={this.state.jogging_view} toggle={this.jogging_view} className="modal-dialog1"  key={index}> 
                              <ModalHeader toggle={this.jogging_view} >Jogging Data View</ModalHeader>
                                <ModalBody>
                                  <Row> 
                                    <Col sm="12" className="mb-2">
                                      <Label className="font-20">Distance(km)</Label>
                                      <Input type="number" name="distance" value = {url.distance} readOnly/>
                                    </Col>
                                  </Row>
                                  <Row className="mb-2">
                                    <Col sm="6">
                                      <Label className="font-20">StartDate</Label>
                                      <Input value={this.convertDate(url.startdate)} name="startdate" readOnly/>
                                    </Col>
                                    <Col sm="6">
                                      <Label className="font-20">EndDate</Label>
                                      <Input  value={this.convertDate(url.enddate)} name="enddate" readOnly/>
                                    </Col>
                                  </Row>
                                  <Row> 
                                    <Col sm="12" className="mb-2">
                                      <Label className="font-20">Avg Speed(km/h)</Label>
                                      <Input type="number" name="distance" value = {Math.round(url.distance/url.diff_time)} readOnly/>
                                    </Col>
                                  </Row>
                                  <Row className="mt-3">
                                    <Col sm="12">
                                      <Label className="font-20">Commit</Label>
                                      <Input type="textarea" value={url.commit} name="commit" readOnly/>
                                    </Col>
                                  </Row>
                                </ModalBody>
                                <ModalFooter>
                                  <Button color="primary" onClick={this.jogging_view}>OK</Button>
                                </ModalFooter>
                            </Modal>
                          );
                        }
                        if(url._id === this.state.jogging_update_id && this.state.jogging_update ){
                          return(
                            <Modal isOpen={this.state.jogging_update} toggle={this.jogging_update} className="modal-dialog1"  key={index}> 
                              <ModalHeader toggle={this.jogging_update} >Jogging Data View</ModalHeader>
                                <form onSubmit={e => { e.preventDefault();}}>
                                  <ModalBody>
                                    <Row> 
                                      <Col sm="12" className="mb-2">
                                        <Input type="number" step="any" name="distance" value = {this.state.distance} onChange={this.changeDistanceHandler} placeholder="Distance(km)" required/>
                                      </Col>
                                    </Row>
                                    <Row className="mb-2">
                                      <Col sm="6">
                                        <Label className="font-20">StartDate</Label>
                                        <DateTimePicker onChange={this.onChangeDate1} value={this.state.startdate} name="startdate"/>
                                      </Col>
                                      <Col sm="6">
                                      <Label className="font-20">EndDate</Label>
                                        <DateTimePicker onChange={this.onChangeDate2} value={this.state.enddate} name="enddate"/>
                                      </Col>
                                    </Row> 
                                    <Row className="mt-3">
                                      <Col sm="12" className="text-center">
                                        <Input type="textarea" value={this.state.commit} onChange={this.changeCommitHandler} name="commit" placeholder="Commit"/>
                                      </Col>
                                    </Row> 
                                  </ModalBody>
                                  <ModalFooter>
                                    <Button color="primary" onClick={this.handlejoggingUpdate}>Save</Button>
                                    <Button color="secondary" onClick={this.jogging_update}>Cancel</Button>
                                  </ModalFooter>  
                                </form>
                            </Modal>
                          );
                        }
                      })}
                      <Modal isOpen={this.state.joggadd} toggle={this.toggle_joggadd} className="modal-dialog1">
                      <ModalHeader toggle={this.toggle_joggadd}>Jogging Data Add</ModalHeader>
                        <form onSubmit={e => { e.preventDefault();}}>
                          <ModalBody>
                            <Row> 
                              <Col sm="12" className="mb-2">
                                <Input type="number" step="any" name="distance" value = {this.state.distance} onChange={this.changeDistanceHandler} placeholder="Distance(km)" required/>
                              </Col>
                            </Row>
                            <Row className="mb-2">
                              <Col sm="6">
                                <Label className="font-20">StartDate</Label>
                                <DateTimePicker onChange={this.onChangeDate1} value={this.state.startdate} name="startdate"/>
                              </Col>
                              <Col sm="6">
                              <Label className="font-20">EndDate</Label>
                                <DateTimePicker onChange={this.onChangeDate2} value={this.state.enddate} name="enddate"/>
                              </Col>
                            </Row> 
                            <Row className="mt-3">
                              <Col sm="12" className="text-center">
                                <Input type="textarea" value={this.state.commit} onChange={this.changeCommitHandler} name="commit" placeholder="Commit"/>
                              </Col>
                            </Row> 
                          
                          </ModalBody>
                          <ModalFooter>
                            <Button color="primary" onClick={this.handlejoggingSubmit}>Save</Button>
                            <Button color="secondary" onClick={this.toggle_joggadd}>Cancel</Button>
                          </ModalFooter>
                        </form>
                      </Modal>
                    </Col>
                  </Row>
                </div>
              }
          </div>
        </Container>
      </div>
    );
  }
}

export default App;