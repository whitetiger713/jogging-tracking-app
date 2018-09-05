import React,{Component} from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button,Row,Col } from 'reactstrap';
import renderField from './renderField';
const validate = (values) => {
const errors = {};
if(!values.keyword){
		errors.keyword = 'Required';
}
return errors;
};
const user = sessionStorage.getItem('username');

class SearchForm extends Component{
	handleInitialize (){
		const initData = {
			keyword : user
		};
		this.props.initialize(initData);
	}
	componentDidMount() {
		this.handleInitialize();
	}
	render(){
		const { handleSubmit } = this.props;
		return(
			<form className="mt-5" onSubmit={(e) => {
				e.preventDefault();
				handleSubmit();
		}} >
			<Row>
					<Col sm="10" className="text-right">
							<Field
								name="keyword"
								component={renderField}
								label="Keyword:"
								type="text"
								placeholder="Enter a keyword"
							/>
					</Col>
					<Col sm="2" className="text-left">
						<Button color="success">Search</Button>
					</Col>
			</Row>             
		</form>			       
		);
	}
} 

export default reduxForm({
	form: 'searchForm' , validate,
})(SearchForm);