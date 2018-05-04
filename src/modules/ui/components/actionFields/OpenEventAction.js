import React from 'react'
import {Input, Label} from 'reactstrap'

export default class OpenEventAction extends React.Component {
    constructor(props) {
        super(props)
        this.validate = this
            .validate
            .bind(this)
        this.getValue = this
            .getValue
            .bind(this)
        this.getSelect = () => this.__select || document.getElementById('action_oea_0_id')
    }

    render() {
        var events = []
        var db = this
            .props
            .database
            .events
            for (var id in db) 
            events.push(db[id])
        return (
            <div>
                <Label for="action_oea_0_id">Tab</Label>
                <Input type="select" id="action_oea_0_id" innerRef={i => this.__select = i} defaultValue={this.props.current
                        ? this.props.current.eventId
                        : null}>
                    {events.map(t => <option value={t.id}>{t.title}</option>)}
                </Input>
            </div>
        )
    }

    static get description() {
        return 'Opens an event as a new page, even if it is expired'
    }

    static get title() {
        return 'Open Event'
    }

    static get className() {
        return 'OpenEventAction'
    }

    static getSummary(a) {
        return `Open Event: /events/${a.eventId}`
    }

    validate() {
        if (!this.getSelect()) 
            return {}
        if (!this.getSelect().value) 
            return {invalid: true, errors: ['No event selected']}
        else 
            return {}
        }

    getValue() {
        var s = this.getSelect()
        return {
            type: 'OpenEventAction',
            group: 0,
            eventId: s.value
        }
    }
}