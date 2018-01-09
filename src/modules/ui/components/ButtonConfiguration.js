import React from 'react'
import {Input, Label, Form, FormGroup} from 'reactstrap'
import ActionInput from './ActionInput.js'

export default class ButtonConfiguration extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            actionCheckbox: false
        }
        this.validate = this.validate.bind(this)
        this.getValue = this.getValue.bind(this)
    }

    validate() {
        if (!this.state.actionCheckbox)
            return false
        var errors = []
        if (!this.buttonLabel.value)
            errors.push('No button label specified')
        var action = this.actionInput.validate()
        if (action.invalid)
            errors.push(...action.errors)
        return errors.length === 0 ? false : errors
    }

    getValue() {
        if (!this.state.actionCheckbox)
            return {}
        if (!this.buttonLabel.value || !this.actionInput.value)
            return {}
        return {
            label: this.buttonLabel.value,
            action: this.actionInput.value
        }
    }

    render() {
        if (this.props.value && !this.state.__x) {
            this.setState({actionCheckbox: true, __x: true})
            return null
        }
        return <Form>
            <FormGroup check>
                <Label check>
                <Input type="checkbox" id="actionCheckbox" checked={this.state.actionCheckbox} innerRef={i => (this.actionCheckbox = (i || document.getElementById('actionCheckbox'))).onchange = () => this.setState({actionCheckbox: !this.actionCheckbox.checked})}/>{' '}
                    Enable button
                </Label>
            </FormGroup>
            <Label for="actionButtonLabel">Button label</Label>
            <Input id="actionButtonLabel" innerRef={i => this.buttonLabel = i} defaultValue={this.props.value
                    ? this.props.value.label
                    : ''} disabled={!this.state.actionCheckbox}/>
            <Label for="actionInput">Button action</Label>
            <ActionInput id="actionInput" value={this.props.value ? this.props.value.action : null} ref={r => this.actionInput = r} disabled={!this.state.actionCheckbox}/>
        </Form>
    }
}