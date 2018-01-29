import React from 'react'
import PropTypes from 'prop-types'
import {Button,Input,InputGroup,InputGroupAddon,InputGroupButton} from 'reactstrap'
import moment from 'moment'
import DateTime from './DateTime'

export default class DateRangeField extends React.Component {
    static propTypes = {
        startName: PropTypes.string,
        endName: PropTypes.string,
        startValue: PropTypes.string,
        endValue: PropTypes.string,
        disabled: PropTypes.bool
    }

    constructor(props) {
        super(props)
        this.getValue = this.getValue.bind(this)
        this.validate = this.validate.bind(this)
        this.fireOnChange = this.fireOnChange.bind(this)
    }

    fireOnChange(variable, value) {
        this[variable] =  value ? (value.isValid ? (value.isValid() ? value : null) : null) : null
        if (this.props.onChange)
            this.props.onChange(this.startValue, this.endValue, this.validate())
    }

    render() {
        return <div>
            <h4>Start</h4>
            <DateTime disabled={this.props.disabled} onChange={v => this.fireOnChange.bind(this, 'startValue', v)()} moment={this.props.startValue ? moment(this.props.startValue, moment.ISO_8601) : null}/>
            <h4>End</h4>
            <DateTime disabled={this.props.disabled} onChange={v => this.fireOnChange.bind(this, 'endValue', v)()} moment={this.props.endValue ? moment(this.props.endValue, moment.ISO_8601) : null}/>
            </div>
    }

    getValue() {
        var ignored = this.props.disabled || (!this.startValue || !this.endValue)
        var obj = {}
        obj[this.props.startName || 'start'] = ignored ? '' : this.startValue.toISOString()
        obj[this.props.endName || 'end'] = ignored ? '' : this.endValue.toISOString()
        return obj
    }

    validate() {
        if (this.props.disabled)
            return false
        if (!this.startValue || !this.endValue)
            return 'Valid start and end dates and times must be specified.'
        if (!this.endValue.isAfter(this.startValue))
            return 'The end date must come after the start date.'
        return false
    }
}