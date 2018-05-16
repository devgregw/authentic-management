import React from 'react'
import {FormGroup, Label, Input, Form, Badge, Navbar, Nav, ButtonGroup, Button, NavItem} from 'reactstrap'
import BasicModal from '../components/BasicModal.js'
import ProgressModal from '../components/ProgressModal.js'
import ActionInput from '../components/ActionInput'
import DateTime from '../components/DateTime'
import * as moment from 'moment'

class SenderActionInput extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            actionEnabled: false
        }
        this.getValue = this.getValue.bind(this)
        this.validate = this.validate.bind(this)
    }

    getValue() {
        return this.state.actionEnabled ? this.actionInput.value : null
    }

    validate() {
        return this.state.actionEnabled ? this.actionInput.validate() : false
    }

    render() {
        return <div>
        <FormGroup check>
            <Label check>
                <Input id="actionEnabled" type="checkbox" defaultChecked={this.state.actionEnabled} onChange={() => this.setState({
                    actionEnabled: document
                            .getElementById('actionEnabled')
                            .checked
                    })}/>{' '}
                Enable click action
            </Label>
        </FormGroup>
        <ActionInput disabled={!this.state.actionEnabled} ref={i => this.actionInput = i}/>
    </div>
    }
}

class SenderDateTime extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dateEnabled: false
        }
        this.getValue = this.getValue.bind(this)
        this.validate = this.validate.bind(this)
    }

    getValue() {
        return this.state.dateEnabled ? this.dateInput.getValue() : null
    }

    validate() {
        let v
        if (this.state.dateEnabled) {
            // eslint-disable-next-line
            if (this.dateInput.isValid() && (v = this.dateInput.getValue()))
                return moment(v).isAfter(moment()) ? false : 'A date and time in the past was specified.'
            else
                return 'An invalid date and time was specified.'
        }
        return false
    }

    render() {
        return <div>
        <FormGroup check>
            <Label check>
                <Input id="dateEnabled" type="checkbox" defaultChecked={this.state.dateEnabled} onChange={() => this.setState({
                    dateEnabled: document
                            .getElementById('dateEnabled')
                            .checked
                    })}/>{' '}
                Schedule this notification
            </Label>
        </FormGroup>
        {this.state.dateEnabled ? <DateTime ref={i => this.dateInput = i}/> : 'Notification will be sent immediately.'}
    </div>
    }
}

class SenderForm extends React.Component {
    constructor(props) {
        super(props)
        this.validate = this.validate.bind(this)
        this.fields = [
            {
                title: 'Title',
                name: 'title',
                render: () => <Input id="title"/>,
                get: () => document.getElementById('title').value,
                validate: () => document.getElementById('title').value ? false : 'No title specified.'
            },
            {
                title: 'Message',
                name: 'body',
                render: () => <Input id="body"/>,
                get: () => document.getElementById('body').value,
                validate: () => document.getElementById('body').value ? false : 'No message specified.'
            },
            {
                title: 'Send At',
                optional: true,
                name: 'schedule',
                description: 'If you want to schedule this notification to be sent later, specify a date and time.',
                render: () => <SenderDateTime ref={i => this.dateTime = i}/>,
                get: () => this.dateTime.getValue(),
                validate: () => this.dateTime.validate()
            },
            {
                title: 'Channel',
                name: 'channel',
                description: 'Specify a channel to send this message to.  Select Main to send the notification to all users.',
                render: () => <Input type="select" id="channel">
                    <option value="main">Main (all available users)</option>
                    <option value="dev">Development (internal use only)</option>
                </Input>,
                get: () => document.getElementById("channel").value,
                validate: () => document.getElementById("channel").value ? false : 'No channel specified.'
            },
            {
                title: 'Click Action',
                optional: true,
                name: 'action',
                description: 'Optionally, add an action to run when a user taps the notification.  If no action is specified, the app will open to the main screen.',
                render: () => <SenderActionInput ref={i => this.actionInput = i}/>,
                get: () => this.actionInput.getValue(),
                validate: () => this.actionInput.validate()
            }
        ]
    }

    validate() {
        var results = [this.fields[0].validate(), this.fields[1].validate(), this.fields[2].validate()]
        var actionValidation
        // eslint-disable-next-line
        if ((actionValidation = this.fields[3].validate()).invalid)
            results.push(...actionValidation.errors)
        var filtered = results.filter(r => Boolean(r))
        if (filtered.length > 0)
            return filtered
        return false
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false
    }

    renderField(field) {
        return <FormGroup key={`${field.name}_${Math.random() * 1000}`}>
            <Label className="Label-title" for={field.name}>{field.title} {field.optional ? <Badge pill color="primary">Optional</Badge> : null}</Label>
            {
                field.description
                    ? <div>
                            <Label className="Label-description" for={field.name}>{field.description}</Label>
                        </div>
                    : null
            }
            {field.render()}
            <hr/>
        </FormGroup>
    }

    render() {
        return <div style={{
            margin: '0 1rem',
            paddingTop: '56px'
        }}>
        <Form>{
            this
                .fields
                .map(this.renderField)
        }</Form>
        </div>
    }
}

export default class Sender extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sendingModal: false,
            errorModal: false,
            errors: []
        }
        this.send = this.send.bind(this)
        this.validate = this.validate.bind(this)
    }

    validate() {
        let r
        // eslint-disable-next-line
        if ((r = this.form.validate()) === false)
            return true
        this.setState({errorModal: true, errors: r})
        return false
    }

    send() {
        if (!this.validate())
            return
        this.setState({sendingModal: true})
        var t = this.form.fields[0].get()
        var b = this.form.fields[1].get()
        var s = this.form.fields[2].get()
        var seconds = 0
        if (s)
            seconds = moment.duration(moment(s).diff(moment())).asSeconds()
        var c = this.form.fields[3].get()
        var a = this.form.fields[4].get()
        fetch(`https://devgregw.com/authentic/notify.php?delay=${seconds}&title=${encodeURIComponent(t)}&body=${encodeURIComponent(b)}&topic=${c}${a ? `&action=${encodeURIComponent(btoa(JSON.stringify(a)))}` : ''}`, {
            method: 'GET'
        })
        setTimeout(() => {
            alert('The notification is being processed and will be sent shortly.  If you specified a date and time, it will be sent then.')
            this.closeWindow()
        }, 3000)
    }

    closeWindow() {
        if (window.opener)
            window.close()
        else 
            window.location.href = '/'
    }

    render() {
        return (
        <div>
            <Navbar fixed="top" dark color="dark">
                <Nav className="mr-auto">
                    <NavItem active>
                       <ButtonGroup>
                            <Button color="success" onClick={this.send}>Send Notification</Button>
                            <Button color="light" onClick={this.closeWindow}>Cancel</Button>
                        </ButtonGroup>
                    </NavItem>
                </Nav>
            </Navbar>
            <SenderForm ref={f => this.form = f}/>
            <ProgressModal isOpen={this.state.sendingModal} progressColor="primary" progressText="Processing..."/>
            <BasicModal toggle={() => this.setState({errorModal: false, errors: []})} isOpen={this.state.errorModal} header="Validation Error" body={<div><p>Please resolve the following errors:<br/></p><ul>{(this.state.errors || []).map(e => <li key={e}>{e}</li>)}</ul></div>} primary="Dismiss" primaryColor="primary"/>
        </div>
        )
    }
}