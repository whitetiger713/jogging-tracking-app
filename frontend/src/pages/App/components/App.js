import React, { Component } from 'react';
import { Container,Button, Row, Col, Card, CardImg, Label, UncontrolledAlert} from 'reactstrap';
import SearchForm from './SearchForm';
import './App.css';
const username = sessionStorage.getItem("username");
class App extends Component {
  constructor(props) {
    super(props);
    this.usersearch = this.usersearch.bind(this);
    this.logout = this.logout.bind(this);
  }
  componentWillMount(){
    this.props.usersearch(username);
  }
  logout(){
    sessionStorage.clear();
    this.props.history.push("/login");
  }
  usersearch({ keyword }) {
    this.props.usersearch(keyword);
  }
  render(){
    const { loading, userdata, errors} = this.props;
    return (
      <div className="App mt-5">
        <Container className="text-center">
          <Row>
            <Col sm="10">
              <h1 >Github API_Redux-saga</h1>
            </Col>
            <Col sm="2">
              <Button color="warning" className="mt-4" onClick={this.logout}>Logout</Button>
            </Col>
            
          </Row>
          <Row >
            <Col>
              <SearchForm onSubmit={this.usersearch}/>
            </Col>
          </Row>
          { loading && <div><img src="./loading.gif" alt="Avatar"/></div> }
          { !loading &&  errors && <div><UncontrolledAlert color="danger">{errors}</UncontrolledAlert></div>}
          { !loading && userdata && userdata.length>0 && userdata.map((url, index) => {
              return(
                <Row key={index} >
                  <Col xs="12" sm="6" lg="3" md={{ size: 4, offset: 2 }}>
                    <Card>
                      <CardImg src={ url.avatar_url } />
                    </Card>
                  </Col >
                  <Col className="text-left font-25 mt-5" md="4" >
                    <Label>UserName</Label><br/>
                    &nbsp;<a href={ url.html_url }><Label>{ url.login }</Label></a><br/>
                    <Label>Repository</Label><br/>
                    &nbsp;<a href={ url.html_url + '?tab=repositories'}><Label>Repesitories</Label></a><br/>
                  </Col>
                </Row>
                );
              })}
        </Container>
      </div>
    );
  }
}

export default App;