import React from 'react'
import {Label,Input} from 'reactstrap'

export default class EmailAction extends React.Component {
    constructor(props) {
        super(props)
        this.validate = this.validate.bind(this)
        this.getValue = this.getValue.bind(this)
    }
    
    render() {
        return <div>
                <Label for="action_ea_0_addr">Email Address</Label>
                <Input type="email" id="action_ea_0_addr" defaultValue={this.props.current
                        ? this.props.current.emailAddress
                        : null}/>
            </div>
    }

    validate() {
        if (!document.getElementById('action_ea_0_addr').value)
            return {invalid: true, errors: ['No email address specified']}
        if (!document.getElementById('action_ea_0_addr').checkValidity())
            return {invalid: true, errors: ['The specified email address did not pass validation']}
        return {}
    }

    getValue() {
        return {
            type: 'EmailAddress',
            group: 0,
            emailAddress: document.getElementById('action_ea_0_addr')
        }
    }

    static get description() {
        return 'Launches the user\'s email app and creates a new addressed email'
    }

    static get title() {
        return 'Email Action'
    }

    static get className() {
        return 'EmailAction'
    }

    static getSummary(action) {
        return `Email: ${action.emailAddress}`
    }
}