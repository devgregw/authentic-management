import React from 'react'
import {Input, Label, Alert, FormGroup} from 'reactstrap'
import DateRangeField from './DateRangeField'
import moment from 'moment'

export default class VisibilityRulesField extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            init: false,
            visibilityOverride: true,
            dateStatus: {
                error: false,
                hidden: false,
                visible: false,
                neither: false
            }
        }
        this.nothing = this.nothing.bind(this)
        this.getRangeAlerts = () => this.state ? <div style={{marginTop: '1rem'}}>
        <Alert isOpen={this.nothing()} color="info"><b>NOTE: </b>This tab will be hidden because no date and time range was specified.</Alert>
            <Alert isOpen={this.state.dateStatus.error} color="danger"><b>ERROR: </b>The specified date and time range could not be parsed.  {this.state.dateStatus.error}</Alert>
            <Alert isOpen={this.state.dateStatus.neither} color="danger">This tab will never be visible.</Alert>
            <Alert isOpen={this.state.dateStatus.hidden} color="warning">This tab will be hidden until {this.state.dateStatus.hidden ? this.state.dateStatus.hidden.format('dddd, D MMMM, YYYY [at] h:mm A') : 'null'}.</Alert>
            <Alert isOpen={this.state.dateStatus.visible} color="success">This tab will be visible until {this.state.dateStatus.visible ? this.state.dateStatus.visible.format('dddd, D MMMM, YYYY [at] h:mm A') : 'null'}.</Alert>
    </div> : null
        this.validate = this.validate.bind(this)
        this.getValue = this.getValue.bind(this)
    }

    makeDateStatus(e, h, v, n) {
        return {error: e, hidden: h, visible: v, neither: n}
    }

    handleChange(start, end, validation) {
        if (!start && !end)
            this.setState({dateStatus: this.makeDateStatus(false, false, false, false)})
        else if (validation)
            this.setState({dateStatus: this.makeDateStatus(validation, false, false, false)})
        else if (start && end) {
            var now = moment()
            if (now.isBefore(end) && now.isAfter(start))
                this.setState({dateStatus: this.makeDateStatus(false, false, end, false)})
            else if (now.isBefore(start))
                this.setState({dateStatus: this.makeDateStatus(false, start, false, false)})
            else if (now.isAfter(end))
                this.setState({dateStatus: this.makeDateStatus(false, false, false, true)})
        } else
            this.setState({dateStatus: this.makeDateStatus(false, false, false, false)})
    }

    nothing() {
        if (!this.state) {
            console.warn('VisibilityRulesField.js: this.state == null')
            return true
        }
        return !this.state.dateStatus.error && !this.state.dateStatus.hidden && !this.state.dateStatus.visible && !this.state.dateStatus.neither
    }

    validate() {
        if (this.state.visibilityOverride)
            return false
        if (this.state.dateStatus.error)
            return this.state.dateStatus.error
        return false
    }

    getValue() {
        return { override: this.state.visibilityOverride, ...(this.range ? this.range.getValue() : {}) }
    }

    render() {
        if (!this.state.init) {
            this.setState({init: true, visibilityOverride: this.props.value ? this.props.value.override : true})
            if (this.props.value)
                if (this.props.value.start && this.props.value.end)
                    setTimeout(() => {
                        var s = moment(this.props.value.start), e = moment(this.props.value.end)
                        this.handleChange.bind(this, s, e, '')()
                        this.range.fireOnChange('startValue', s)
                        this.range.fireOnChange('endValue', e)
                    }, 500)
            return null
        }
        return <div>
            <FormGroup check>
                <Label check>
                    <Input id="vis" type="checkbox" defaultChecked={this.state.visibilityOverride} onChange={() => this.setState({
                            visibilityOverride: document
                                .getElementById('vis')
                                .checked
                        })}/>{' '}
                    Always make this tab visible
                </Label>
            </FormGroup>
            <Alert isOpen={this.state.visibilityOverride} color="warning"><b>NOTE: </b>This tab will be visible regardless of the date and time range specified below.</Alert>
            <Alert isOpen={!this.state.visibilityOverride && this.nothing()} color="info"><b>NOTE: </b> This tab will be hidden.  Specify a date and time range to automatically control this tab's visibility.</Alert>
            <Alert isOpen={!this.state.visibilityOverride && !this.nothing()} color="info"><b>NOTE: </b> This tab's visibility will be determined by the date and time range specified below.</Alert>
            { !this.state.visibilityOverride ? <DateRangeField startValue={this.props.value ? moment(this.props.value.start) : ''} endValue={this.props.value ? moment(this.props.value.end) : ''} ref={f => this.range = f} onChange={this.handleChange.bind(this)}/> : null }
            { this.state.visibilityOverride ? null : this.getRangeAlerts() }
            
        </div>
    }
}