import React from 'react'
import {Input,Label,Alert} from 'reactstrap'
import DateRangeField from '../DateRangeField'
import * as moment from 'moment'
import RecurrenceField from '../RecurrenceField'

class ATCAGroup0Params extends React.Component {
    constructor(props) {
        super(props)
        this.getValue = this.getValue.bind(this)
        this.rand = Math.random()
        this.makeId = id => id + this.rand
    }

    render() {
        var deleted = false
        if (this.props.current && this.props.current.type === 'AddToCalendarAction' && this.props.current.eventId && Object.getOwnPropertyNames(this.props.database.events || {}).indexOf(this.props.current.eventId) < 0)
            deleted = true
        return <div>
            {deleted ? <Alert color="warning">The event you selected ({this.props.current.eventId}) no longer exists.  Please select another event.</Alert> : null}
            <Input type="select" id={this.makeId("action_atca_0_eventId")} defaultValue={this.props.current && !deleted ? this.props.current.eventId : Object.getOwnPropertyNames(this.props.database.events)[0]}>
                    {(() => {
                        var items = []
                        var events = this.props.database.events
                        for (var id in events)
                            items.push(<option disabled={!Boolean(events[id].dateTime)} key={id} value={id}>{`${events[id].title} (${id})${!Boolean(events[id].dateTime) ? ' (incompatible)' : ''}`}</option>)
                        return items
                    })()}
            </Input>
        </div>
    }

    getValue() {
        return {eventId: document.getElementById(this.makeId("action_atca_0_eventId")).value}
    }
}

class ATCAGroup1Params extends React.Component {
    constructor(props) {
        super(props)
        this.getValue = this.getValue.bind(this)
        this.validate = this.validate.bind(this)
        this.makeId = id => id + this.props.rand
    }

    render() {
        return <div>
            <Label for={this.makeId("action_atca_0_title")}>Title</Label>
            <Input id={this.makeId("action_atca_0_title")} defaultValue={this.props.current ? this.props.current.title : ''}/>
            <Label for={this.makeId("action_atca_0_location")}>Location</Label>
            <Input id={this.makeId("action_atca_0_location")} defaultValue={this.props.current ? this.props.current.location : ''}/>
            <Label>Date and Time</Label>
            <DateRangeField ref={f => this.dateRangeField = f} startValue={this.props.current && this.props.current.type === 'AddToCalendarAction' ? this.props.current.dates.start : null} endValue={this.props.current && this.props.current.type === 'AddToCalendarAction' ? this.props.current.dates.end : null}/>
            <Label>Recurrence</Label>
            <RecurrenceField ref={i => this.recurrenceField = i} value={this.props.current ? this.props.current.recurrence || {} : {}}/>
        </div>
    }

    getValue() {
        return {
            title: document.getElementById(this.makeId("action_atca_0_title")).value,
            location: document.getElementById(this.makeId("action_atca_0_location")).value,
            dates: this.dateRangeField.getValue(),
            recurrence: this.recurrenceField.getValue()
        }
    }

    validate() {
        let dateRange = this.dateRangeField.validate()
        let recurrence = this.recurrenceField.validate()
        let result = []
        if (dateRange)
            result.push(dateRange)
        if (recurrence)
            result.push(recurrence)
        return result
    }
}

export default class AddToCalendarAction extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            group: props.current ? props.current.group : 0
        }
        this.validate = this.validate.bind(this)
        this.getValue = this.getValue.bind(this)
        this.rand = Math.random()
        this.makeId = id => id + this.rand
    }

    render() {
        return <div>
            <Label for={this.makeId("action_atca_group")}>Source</Label>
            <Input innerRef={i => (i || document.getElementById(this.makeId("action_atca_group"))).onchange = () => this.setState({group: document.getElementById(this.makeId("action_atca_group")).value})} type="select" id={this.makeId("action_atca_group")} defaultValue={this.state.group.toString()}>
                <option value="0">Event</option>
                <option value="1">Custom</option>
            </Input>
            <hr/>
            {this.state.group.toString() === '0' ? <ATCAGroup0Params ref={p0 => this.p0 = p0} database={this.props.database} current={this.props.current}/> : <ATCAGroup1Params ref={p1 => this.p1 = p1} current={this.props.current}/>}
        </div>
    }

    validate() {
        let value = this.state.group.toString() === '0' ? this.p0.getValue() : this.p1.getValue()
        if (this.state.group.toString() === '0') {
            if (!Boolean(value.eventId))
                return {invalid: true, errors: ['No event selected.']}
            return {}
        } else {
            var errors = []
            if (!/\S/.test(value.title))
                errors.push('No title specified.')
            if (!/\S/.test(value.location))
                errors.push('No location specified.')
            var p1v = this.p1.validate()

            if (p1v.length) {
                errors.push(p1v[0])
                if (p1v[1])
                    errors.push(p1v[1])
            }
            if (errors.length > 0)
                return {invalid: true, errors: errors}
            return {}
        }
    }

    getValue() {
        return {
            type: 'AddToCalendarAction',
            group: this.state.group,
            ...(this.state.group.toString() === '0' ? this.p0.getValue() : this.p1.getValue())
        }
    }

    static newInstance(props) {
        return <AddToCalendarAction {...props}/>
    }

    static get description() {
        return 'Adds an event to the user\'s calendar'
    }

    static get title() {
        return 'Add to Calendar'
    }

    static get className() {
        return 'AddToCalendarAction'
    }

    static getSummary(action) {
        if (action.group.toString() === '0')
            return `Event ID: ${action.eventId}`
        else
            return `"${action.title}" @ "${action.location}" (${moment(action.dates.start, moment.ISO_8601).format('dddd, D MMMM, YYYY [at] h:mm A')} to ${moment(action.dates.end, moment.ISO_8601).format('dddd, D MMMM, YYYY [at] h:mm A')})`
    }
}