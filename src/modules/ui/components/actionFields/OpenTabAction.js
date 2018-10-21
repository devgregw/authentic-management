import React from 'react'
import {Input, Label} from 'reactstrap'

export default class OpenTabAction extends React.Component {
    constructor(props) {
        super(props)
        this.validate = this
            .validate
            .bind(this)
        this.getValue = this
            .getValue
            .bind(this)
        this.makeId = id => id + this.props.rand
    }

    render() {
        var tabs = []
        var db = this
            .props
            .database
            .tabs
            for (var id in db) 
                tabs.push(db[id])
            tabs
            .sort((a,
                b
            ) => a.index - b.index)
        return (
            <div>
                <Label for={this.makeId('action_ota_0_id')}>Tab</Label>
                <Input type="select" id={this.makeId('action_ota_0_id')} innerRef={i => this.__select = i} defaultValue={this.props.current
                ? this.props.current.tabId
                : null}>
            {tabs.map(t => <option value={t.id}>{t.title}</option>)}
        </Input>
            </div>
        )
    }

    static get description() {
        return 'Opens a tab as a new page, even if it is hidden or empty'
    }

    static get title() {
        return 'Open Tab'
    }

    static get className() {
        return 'OpenTabAction'
    }

    static getSummary(a) {
        return `Open Tab: /tabs/${a.tabId}`
    }

    validate() {
        let select = document.getElementById(this.makeId('action_ota_0_id'))
        if (!select) 
            return {}
        if (!select.value) 
            return {invalid: true, errors: ['No tab selected']}
        else 
            return {}
        }

    getValue() {
        var s = document.getElementById(this.makeId('action_ota_0_id'))
        return {
            type: 'OpenTabAction',
            group: 0,
            tabId: s.value
        }
    }
}