import React from 'react'
import {FormGroup, Input, Label} from 'reactstrap'

export default class Checkbox extends React.Component {
    render() {
        return <FormGroup check>
        <Label check>
            <Input {...this.props} type="checkbox"/>{' '}
            {this.props.title}
        </Label>
    </FormGroup>
    }
}