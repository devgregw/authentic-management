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
        this.getSelect = () => this.__select || document.getElementById('action_ota_0_id')
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
                <Label for="action_ota_0_id">Tab</Label>
                <Input type="select" id="action_ota_0_id" innerRef={i => this.__select = i} defaultValue={this.props.current
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

    validate() {
        if (!this.getSelect()) 
            return {}
        if (!this.getSelect().value) 
            return {invalid: true, errors: ['No tab selected']}
        else 
            return {}
        }

    getValue() {
        var s = this.getSelect()
        return {
            type: 'OpenTabAction',
            group: 0,
            tabId: s.value
        }
    }
}