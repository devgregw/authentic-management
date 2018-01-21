import React from 'react'
import {Input, Label, Form, FormGroup} from 'reactstrap'
import ActionInput from './ActionInput.js'

export default class ButtonConfiguration extends React.Component {
    constructor(props) {
        super(props)
        this.validate = this.validate.bind(this)
        this.getValue = this.getValue.bind(this)
    }

    validate() {
        var errors = []
        if (!this.buttonLabel.value)
            errors.push('No button label specified')
        var action = this.actionInput.validate()
        if (action.invalid)
            errors.push(...action.errors)
        return errors.length === 0 ? false : errors
    }

    getValue() {
        if (!this.buttonLabel.value || !this.actionInput.value)
            return {}
        return {
            label: this.buttonLabel.value,
            action: this.actionInput.value
        }
    }

    render() {
        return <Form>
            <Label for="actionButtonLabel">Button label</Label>
            <Input id="actionButtonLabel" innerRef={i => this.buttonLabel = i} defaultValue={this.props.value
                    ? this.props.value.label
                    : ''}/>
            <Label for="actionInput">Button action</Label>
            <ActionInput id="actionInput" value={this.props.value ? this.props.value.action : null} ref={r => this.actionInput = r}/>
        </Form>
    }
}