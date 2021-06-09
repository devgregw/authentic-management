import React from 'react'
import { Input, FormGroup, Label, Button, Spinner, InputGroup, InputGroupAddon } from 'reactstrap'

export default class RegistrationConfigurationField extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            enable: props.value,
            forms: null,
            brerr: false,
            brform: -1,
            alreadyReverted: false
        }
        this.getValue = this.getValue.bind(this)
        this.validate = this.validate.bind(this)
        this.getContent = this.getContent.bind(this)
    }

    getValue() {
        return !this.state.enable ? null : {
            price: parseFloat(document.getElementById('price').value),
            url: document.getElementById('form_url').value
        }
    }

    validate() {
        if (!this.state.enable)
            return false
        var errors = []
        if ((!document.getElementById('form_url').checkValidity() || !document.getElementById('form_url').value))
            errors.push('No registration form URL specified.')
        if (isNaN(parseFloat(document.getElementById('price').value)) || parseFloat(document.getElementById('price').value) < 0)
            errors.push('The specified price is invalid.')
        return errors.length > 0 ? errors : false
    }

    shouldComponentUpdate(newProps, newState) {
        return JSON.stringify(this.state) !== JSON.stringify(newState)
    }

    getContent() {
        return <div>
          <div>
            <Label for="form_url" className="Label-title">Registration Form URL</Label><br/>
            <Label for="form_url" className="Label-description">If this event requires payment, ensure that (1) the custom registration form handles online payments and/or (2) payment will be accepted at the door (and indicate so in the description box).</Label>
            <Input type="url" innerRef={f => this.formUrl = f} id="form_url" defaultValue={this.props.value ? this.props.value.url : ''}/>
        </div>
          <Label for="price" className="Label-title">Price</Label><br/>
            <Label for="price" className="Label-description">Specify the price of the event.  Set this to 0 if the event is free.</Label>
            <InputGroup>
                <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                <Input innerRef={f => this.price = f} id="price" type="number" step="0.01" min="0" defaultValue={this.props.value ? this.props.value.price : 0} />
            </InputGroup>
        </div>
    }

    render() {
        return <div>
            <FormGroup check>
                <Label check>
                    <Input defaultChecked={this.state.enable} innerRef={f => { if (f) f.onchange = () => this.setState({enable: f.checked}) }} type="checkbox" />{' '}
                        Configure registration
                </Label>
            </FormGroup>
            {this.state.enable ? this.getContent() : null}
        </div>
    }
}