import React from 'react'
import {Label,Input} from 'reactstrap'

export default class EmailAction extends React.Component {
    constructor(props) {
        super(props)
        this.validate = this.validate.bind(this)
        this.getValue = this.getValue.bind(this)
        this.makeId = id => id + this.props.rand
    }
    
    render() {
        return <div>
                <Label for={this.makeId("action_ea_0_addr")}>Email Address</Label>
                <Input type="email" id={this.makeId("action_ea_0_addr")} defaultValue={this.props.current
                        ? this.props.current.emailAddress
                        : null}/>
            </div>
    }

    validate() {
        if (!document.getElementById(this.makeId("action_ea_0_addr")).value)
            return {invalid: true, errors: ['No email address specified']}
        if (!document.getElementById(this.makeId("action_ea_0_addr")).checkValidity())
            return {invalid: true, errors: ['The specified email address did not pass validation']}
        return {}
    }

    getValue() {
        return {
            type: 'EmailAction',
            group: 0,
            emailAddress: document.getElementById(this.makeId("action_ea_0_addr")).value
        }
    }

    static get description() {
        return 'Launches the user\'s email app and creates a new addressed email'
    }

    static get title() {
        return 'Send Email'
    }

    static get className() {
        return 'EmailAction'
    }

    static getSummary(action) {
        return `Send Email: ${action.emailAddress}`
    }
}