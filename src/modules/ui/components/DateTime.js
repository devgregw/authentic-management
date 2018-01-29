import React from 'react'
import {
    Button, InputGroup, InputGroupAddon, Input, InputGroupButton
} from 'reactstrap'
import moment from 'moment'

export default class DateTime extends React.Component {
    constructor(props) {
        super(props)
        this.getValue = this.getValue.bind(this)
        this.isValid = this.isValid.bind(this)
        this.getSelectedValue = this.getSelectedValue.bind(this)
        this.manualFireOnChange = this.manualFireOnChange.bind(this)
    }

    getSelectedValue() {
        return moment(`${this.dateInput.value} ${this.timeInput.value}`, 'YYYY-MM-DD kk:mm')
    }

    getValue() {
        return this.isValid() ? this.getSelectedValue() : null
    }

    isValid() {
        return this.getSelectedValue().isValid()
    }

    initializeInnerRef(type, value) {
        this[`${type}Input`] = value
        if (value)
            value.onchange = this.manualFireOnChange
    }

    manualFireOnChange() {
        if (this.props.onChange)
            this.props.onChange(this.getValue())
    }

    render() {
        return <div>
            <InputGroup>
                <InputGroupAddon addonType="prepend">Date</InputGroupAddon>
                <Input disabled={this.props.disabled} innerRef={this.initializeInnerRef.bind(this, 'date')} type="date" defaultValue={this.props.moment ? this.props.moment.format('YYYY-MM-DD') : null}/>
                <InputGroupButton disabled={this.props.disabled} onClick={() => {
                    this.dateInput.value = moment().format('YYYY-MM-DD')
                    this.manualFireOnChange()
                }} color="secondary">Today</InputGroupButton>
                <InputGroupButton disabled={this.props.disabled} onClick={() => {
                    this.dateInput.value = null
                    this.manualFireOnChange()
                }} color="secondary">Clear</InputGroupButton>
            </InputGroup>
            <br/>
            <InputGroup>
                <InputGroupAddon addonType="prepend">Time</InputGroupAddon>
                <Input disabled={this.props.disabled} innerRef={this.initializeInnerRef.bind(this, 'time')} type="time" defaultValue={this.props.moment ? this.props.moment.format('kk:mm') : null}/>
                <InputGroupButton disabled={this.props.disabled} onClick={() => {
                    this.timeInput.value = moment().format('kk:mm')
                    this.manualFireOnChange()
                }} color="secondary">Now</InputGroupButton>
                <InputGroupButton disabled={this.props.disabled} onClick={() => {
                    this.timeInput.value = null
                    this.manualFireOnChange()
                }} color="secondary">Clear</InputGroupButton>
            </InputGroup>
        </div>
    }
}