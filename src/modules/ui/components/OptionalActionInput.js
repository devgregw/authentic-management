import React from 'react'
import {Input,Label,FormGroup} from 'reactstrap'
import ActionInput from './ActionInput'

export default class OptionalActionInput extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            enabled: Boolean(this.props.value)
        }
        this.getValue = this.getValue.bind(this)
        this.validate = this.validate.bind(this)
    }

    getValue() {
        if (this.state.enabled)
            return this.actionInput.getValue()
        return null
    }

    validate() {
        if (this.state.enabled)
            return this.actionInput.validate()
        return false
    }

    render() {
        return <div>
            <FormGroup check>
                <Label check>
                    <Input id="oai_enable" type="checkbox" defaultChecked={this.state.enabled} onChange={() => this.setState({
                            enabled: document
                                .getElementById('oai_enable')
                                .checked
                        })}/>{' '}
                    Enable action
                </Label>
            </FormGroup>
            {this.state.enabled ? <ActionInput ref={i => this.actionInput = i} value={this.props.value}/> : null}
        </div>
    }
}