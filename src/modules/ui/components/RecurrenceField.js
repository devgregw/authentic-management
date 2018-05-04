import React from 'react'
import {FormGroup, Input, Label} from 'reactstrap'
import DateTime from './DateTime'
import * as moment from 'moment'

export default class RecurrenceField extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            enable: Boolean(props.value),
            endBehavior: props.value ? props.value.endBehavior : 'infinite'
        }
        this.getValue = this.getValue.bind(this)
        this.validate = this.validate.bind(this)
    }

    getEndBehaviorParams() {
        //var input = document.getElementById('endBehavior')
        switch (this.state.endBehavior) {
            case 'until':
            return <div>
                <Label for="until">Date</Label>
                <DateTime ref={dt => this.dt = dt} moment={moment(this.props.value ? this.props.value.date : null)}/>
                </div>
            case 'number':
            return <div>
                <Label for="number">Number</Label>
                <Input type="number" id="number" min="1" step="1" defaultValue={this.props.value ? this.props.value.number : '1'}/>
                </div>
            default:
            return null
        }
    }

    getValue() {
        if (!this.state.enable)
            return null
        var object = {
            frequency: document.getElementById('frequency').value,
            interval: parseInt(document.getElementById('interval').value, 10),
            endBehavior: document.getElementById('endBehavior').value
        }
        switch (object.endBehavior) {
            case 'until':
            object.date = this.dt.getValue().toISOString()
            break
            case 'number':
            object.number = parseInt(document.getElementById('number').value, 10)
            break
            default:
            break
        }
        return object
    }

    validate() {
        if (!this.state.enable)
            return false
        var errors = []
        var interval = parseInt(document.getElementById('interval').value, 10)
        if (isNaN(interval) || interval <= 0)
            errors.push('The specified recurrence interval is not valid.')
        switch (document.getElementById('endBehavior').value) {
            case 'until':
            if (!this.dt.isValid())
                errors.push('A valid recurrence ending date and time was not specified.')
            break
            case 'number':
            var number = parseInt(document.getElementById('number').value, 10)
            if (isNaN(number) || number <= 0)
                errors.push('A valid recurrence count was not specified.')
            break
            default:
            break
        }
        if (errors.length === 0)
            return false
        return errors
    }

    render() {
        var params = null
        if (this.state.enable)
            params =
            <div>
                <Label for="frequency">Frequency</Label>
                <Input type="select" id="frequency" defaultValue={this.props.value ? this.props.value.frequency : 'daily'}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </Input>
                <Label for="interval">Interval</Label>
                <Input type="number" id="interval" min="1" step="1" defaultValue={this.props.value ? this.props.value.interval : '1'}/>
                <Label for="endBehavior">End Behavior</Label>
                <Input innerRef={i => (i || document.getElementById('endBehavior')).onchange = () => this.setState({endBehavior: document.getElementById("endBehavior").value})} type="select" id="endBehavior" defaultValue={this.state.endBehavior}>
                    <option value="infinite">Infinite</option>
                    <option value="until">Until Date</option>
                    <option value="number">Number of Occurrences</option>
                </Input>
                {this.getEndBehaviorParams()}
            </div>
        return <div>
            <FormGroup check>
                <Label check>
                    <Input id="enable" type="checkbox" defaultChecked={this.state.enable} onChange={() => this.setState({
                            enable: document
                                .getElementById('enable')
                                .checked,
                                end: document
                                .getElementById('enable')
                                .checked ? 0 : -1
                        })}/>{' '}
                    Enable recurrence
                </Label>
            </FormGroup>
            {params}
        </div>
    }
}