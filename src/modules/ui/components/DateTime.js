import React from 'react'
import {
    ButtonGroup, Button
} from 'reactstrap'
import * as moment from 'moment'
import Datetime from 'react-datetime'

export default class DateTime extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            newValue: null
        }
        this.getValue = this.getValue.bind(this)
        this.isValid = this.isValid.bind(this)
        this.getSelectedValue = this.getSelectedValue.bind(this)
        this.manualFireOnChange = this.manualFireOnChange.bind(this)
        this.didChange = true
    }

    getSelectedValue() {
        return moment.isMoment(this.inputValue) ? this.inputValue : moment('-')
    }

    getValue() {
        return this.isValid() ? this.getSelectedValue() : null
    }

    isValid() {
        return this.getSelectedValue().isValid()
    }

    manualFireOnChange(v) {
        this.inputValue = v
        if (this.props.onChange)
            this.props.onChange(v || this.getValue())
    }

    render() {
        var value = this.state.newValue ? this.state.newValue : (this.props.moment ? this.props.moment : moment('-'))
        if (this.didChange)
            this.manualFireOnChange(value.isValid() ? value : null)
        this.didChange = false
        return <div>
            <Datetime ref={f => this.dateTime = f} value={value} onChange={val => {
                this.didChange = true
                this.setState({newValue: val})
            }}/>
            <ButtonGroup>
                <Button onClick={() => {
                    this.didChange = true
                    this.setState({newValue: moment()})
                }} color="primary">Now</Button>
                <Button onClick={() => {
                    this.didChange = true
                    this.setState({newValue: moment('-')})
                }} color="warning">Clear</Button>
            </ButtonGroup>
        </div>
    }
}