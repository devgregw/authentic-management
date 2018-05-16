import React from 'react'
import {Input,Label} from 'reactstrap'

export default class AddToCalendarAction extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            group: props.current ? props.current.group : 0
        }
        this.validate = this.validate.bind(this)
        this.getValue = this.getValue.bind(this)
    }

    make(content) {
        return <div>
            <Label for="action_atca_group">Source</Label>
            <Input type="select" id="action_atca_group" innerRef={s => s.onchange = () => this.setState({group: s.value})} defaultValue={this.state.group.toString()}>
                <option value="0">Event</option>
                <option value="1">Custom</option>
            </Input>
            <hr/>
            {content}
        </div>
    }

    render() {
        // eslint-disable-next-line
        if (this.state.group == 0)
            return this.make(
                <Input type="select" id="action_atca_0_eventId" defaultValue={Object.getOwnPropertyNames(this.props.database.events)[0]}>
                    {(() => {
                        var items = []
                        var events = this.props.database.events
                        for (var id in events)
                            items.push(<option key={id} value={id}>{`${events[id].title} (${id})`}</option>)
                        return items
                    })()}
                </Input>
            )
        else return this.make(
                <div>

                </div>
            )
    }

    validate() {
        if (!document.getElementById('action_sma_0_addr').value)
            return {invalid: true, errors: ['No address specified']}
        return {}
    }

    getValue() {
        return {
            type: 'AddToCale',
            group: 0,
            address: document.getElementById('action_sma_0_addr').value
        }
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
        return `Show Map: ${action.address}`
    }
}