import React from 'react';
import { FormGroup, Label, Input,Row,Col} from 'reactstrap';

const renderField = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
}) => (
  <FormGroup>
    <Row>
      <Col sm="2">
        <Label className="mt-2">{label}</Label>
      </Col>
      <Col sm="10">
        <Input {...input} placeholder={label} type={type}/>
        {touched &&
        ((error && <span>{error}</span>) ||
          (warning && <span>{warning}</span>))}
      </Col>
    </Row>
    
    
  </FormGroup>
);

export default renderField;
