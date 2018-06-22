import React from 'react'
import {Input,Label} from 'reactstrap'

export default class GetDirectionsAction extends React.Component {
    constructor(props) {
        super(props)
        this.validate = this.validate.bind(this)
        this.getValue = this.getValue.bind(this)
    }

    render() {
        return <div>
                <Label for="action_gda_0_addr">Address</Label>
                <Input type="text" id="action_gda_0_addr" defaultValue={this.props.current
                        ? this.props.current.address
                        : null}/>
                <br/>
            </div>
    }

    validate() {
        if (!document.getElementById('action_gda_0_addr').value)
            return {invalid: true, errors: ['No address specified']}
        return {}
    }

    getValue() {
        return {
            type: 'GetDirectionsAction',
            group: 0,
            address: document.getElementById('action_gda_0_addr').value
        }
    }

    static get description() {
        return 'Launches the user\'s maps app and provides directions to an address'
    }

    static get title() {
        return 'Get Directions'
    }

    static get className() {
        return 'GetDirectionsAction'
    }

    static getSummary(action) {
        return `Get Directions: ${action.address}`
    }
}