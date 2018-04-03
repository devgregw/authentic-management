import React from 'react'
import { Input, FormGroup, Label, Button, Progress, InputGroup, InputGroupAddon } from 'reactstrap'
import ContentLoader from './ContentLoader'
import * as firebase from 'firebase'
import Utils from '../../classes/Utils'

export default class RegistrationConfigurationField extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            enable: props.value,
            breeze: props.value ? props.value.url.indexOf('breezechms') >= 0 : true,
            forms: null,
            brerr: false,
            brform: -1,
            alreadyReverted: false
        }
        this.getValue = this.getValue.bind(this)
        this.validate = this.validate.bind(this)
        this.getContent = this.getContent.bind(this)
        this.getBreezeContent = this.getBreezeContent.bind(this)
        this.getDefaultBreezeForm = this.getDefaultBreezeForm.bind(this)
    }

    getValue() {
        return !this.state.enable ? null : {
            price: parseFloat(document.getElementById('price').value),
            url: this.state.breeze ? this.state.forms[parseInt(this.state.brform, 10)].url : document.getElementById('form_url').value
        }
    }

    validate() {
        if (!this.state.enable)
            return false
        var errors = []
        if (this.state.breeze && (this.state.brform === -1 || !this.state.forms || !this.state.forms.length || this.state.brerr))
            errors.push('A Breeze ChMS form was not selected.')
        else if (!this.state.breeze && (!document.getElementById('form_url').checkValidity() || !document.getElementById('form_url').value))
            errors.push('No registration form URL specified.')
        if (isNaN(parseFloat(document.getElementById('price').value)) || parseFloat(document.getElementById('price').value) < 0)
            errors.push('The specified price is invalid.')
        return errors.length > 0 ? errors : false
    }

    shouldComponentUpdate(newProps, newState) {
        return JSON.stringify(this.state) !== JSON.stringify(newState)
    }

    getDefaultBreezeForm() {
        if (this.props.value) {
            var index = this.state.forms.map(form => form.url).indexOf(this.props.value.url)
            if (index >= 0)
                this.setState({brform: index})
            else if (!this.state.alreadyReverted) {
                this.setState({brerr: false, brform: 0, breeze: false, forms: null, alreadyReverted: true})
                document.getElementById('custom_radio').checked = true
            }
        }
        this.setState({brform: 0})
    }

    getBreezeContent() {
        var internal
        if (this.state.brerr)
            internal = <div><Button color="primary" size="sm" onClick={() => this.setState({forms: null, brerr: false})}>Reload</Button><p style={{color: 'red'}}>An error occurred while contacting Breeze ChMS.</p></div>
        else if (this.state.forms && !this.state.brerr) {
            if (this.state.brform === -1) {
                this.getDefaultBreezeForm()
                return null
            }
            internal = this.state.forms.length > 0 ?
                <div>
                    <Input defaultValue={this.state.brform} innerRef={f => { if (f) f.onchange = () => this.setState({brform: f.value}) }} type="select" id="breeze_form">
                        {this.state.forms.map((val, i) => <option key={val.slug} value={i}>{val.name} ({val.id}: {val.slug})</option>)}
                    </Input>
                    <p>URL: <a href={this.state.forms[parseInt(this.state.brform, 10)].url} target="_blank" rel="noopener noreferrer">{this.state.forms[parseInt(this.state.brform, 10)].url}</a><br/>
                    <em>The form URL is for your reference only.  It will automatically be integrated into the app.</em>
                    </p>
                </div> :
                <p>No forms have been created.</p>
        } else if (!this.state.forms && !this.state.brerr) {
            window.fetch('https://devgregw.com/authentic/breeze.php', {method: 'POST', body: `uid=${firebase.auth().currentUser.uid.toString()}`, headers: {'content-type': 'application/x-www-form-urlencoded'}}).then(r => {   
                if (r.ok)
                    r.json().then(val => this.setState({forms: val, brerr: false}))
                else
                    this.setState({forms: null, brerr: true})
            });
            internal = <div>
                <Progress animated color="primary" value={100}>Contacting Breeze ChMS...</Progress>
            </div>
        }
        return <div>
            <Label for="breeze_form" className="Label-title">Registration Form</Label><br/>
            <Label for="breeze_form" className="Label-description">To create a form,
                <ol>
                    <li><a href="https://authenticcity.breezechms.com/forms/all" target="_blank" rel="noopener noreferrer">Click here</a> to view all forms.</li>
                    <li>Click <em>Create New Form</em>.</li>
                    <li>Click <em>Registration</em>.</li>
                    <li>Design the form to suit your needs.  Take note of the <em>Payment</em> field if this event requires payment.</li>
                    <li>When you are finished, click <em>Create Form</em>.</li>
                    <li>Click <em>Reload</em> on this page and select the new form.</li>
                </ol>
            </Label><br/>
            <Button disabled={!this.state.forms && !this.state.brerr} color="primary" onClick={() => this.setState({forms: null, brerr: false})}>Reload</Button><br/><br/>
            {internal}
        </div>
    }

    getContent() {
        var params = this.state.breeze ?
        this.getBreezeContent() :
        <div>
            <Label for="form_url" className="Label-title">Registration Form URL</Label><br/>
            <Label for="form_url" className="Label-description">If this event requires payment, ensure that (1) the custom registration form handles online payments and/or (2) payment will be accepted at the door (and indicate so in the description box).</Label>
            <Input type="url" innerRef={f => this.formUrl = f} id="form_url" defaultValue={this.props.value ? this.props.value.url : ''}/>
        </div>
        //Configure with <a href="https://authenticcity.breezechms.com/" rel="noopener noreferrer" target="_blank">Breeze ChMS</a>
        return <div>
            <FormGroup tag="fieldset">
          <FormGroup check>
            <Label check>
              <Input defaultChecked={this.state.breeze} innerRef={f => { if (f) f.onchange = () => this.setState({breeze: f.checked}) }} type="radio" name="radio1" />{' '}
              Configure with <a href="https://authenticcity.breezechms.com/" rel="noopener noreferrer" target="_blank"><span><img src={`${Utils.getBaseUrl()}/breeze.png`}/></span> Breeze ChMS</a>
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input defaultChecked={!this.state.breeze} id="custom_radio" innerRef={f => { if (f) f.onchange = () => this.setState({breeze: !f.checked}) }} type="radio" name="radio1" />{' '}
              Custom
            </Label>
          </FormGroup>
          </FormGroup>
          {params}
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