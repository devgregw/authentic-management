import React from 'react'
import {Input,Label,Button} from 'reactstrap'

export default class ShowMapAction extends React.Component {
    constructor(props) {
        super(props)
        this.validate = this.validate.bind(this)
        this.getValue = this.getValue.bind(this)
    }

    render() {
        return <div>
                <Label for="action_sma_0_addr">Address</Label>
                <Input type="text" id="action_sma_0_addr" defaultValue={this.props.current
                        ? this.props.current.address
                        : null}/>
                <br/>
                <Button size="sm" color="secondary" onClick={() => document.getElementById('action_sma_0_preview').src = `https://maps.googleapis.com/maps/api/staticmap?size=500x500&center=${encodeURIComponent(document.getElementById('action_sma_0_addr').value).replace(/%20/g, '+')}`}>Preview</Button>
                <br/>
                <br/>
                <img alt="Preview" id="action_sma_0_preview" style={{width: '500px', height: '500px'}}/>
            </div>
    }

    validate() {
        if (!document.getElementById('action_sma_0_addr').value)
            return {invalid: true, errors: ['No address specified']}
        return {}
    }

    getValue() {
        return {
            type: 'ShowMapAction',
            group: 0,
            address: document.getElementById('action_sma_0_addr').value
        }
    }

    static get description() {
        return 'Launches the user\'s maps app and searches for an address or place'
    }

    static get title() {
        return 'Show Map'
    }

    static get className() {
        return 'ShowMapAction'
    }

    static getSummary(action) {
        return `Show Map: ${action.address}`
    }
}