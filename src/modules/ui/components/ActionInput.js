import React from 'react'
import {Input} from 'reactstrap'
import ContentLoader from './ContentLoader.js'
import Utils from '../../classes/Utils'
import AddToCalendarAction from './actionFields/AddToCalendarAction.js';

export default class ActionInput extends React.Component {
    constructor(props){
        super(props)
        this.state = {index: 0, rand: Math.random().toString()}
        this.getValue = this.getValue.bind(this)
        this.validate = this.validate.bind(this)
        this.makeId = id => id + this.state.rand
    }

    transform(data) {
        if (this.state.index === 6)
            return <AddToCalendarAction ref={r => this.atca = r} {...{database: data, current: this.props.value, rand: this.state.rand}}/>
        else this.element = new Utils.actionClassesIndexed[this.state.index]({database: data, current: this.props.value, rand: this.state.rand}, this)
        return this.element.render()
    }

    getValue() {
        return this.atca ? this.atca.getValue() : this.element.getValue()
    }

    validate() {
        return this.atca ? this.atca.validate() : this.element.validate()
    }

    render() {
        if (this.props.disabled)
            return <p>None</p>
        if (this.props.value && !this.state.__x) {
            this.setState({__x: true, index: Utils.actionClassesIndexed.map(c => c.className).indexOf(this.props.value.type)})
            return null
        }
        return <div>
            <Input type="select" id={this.makeId("action_type")} defaultValue={this.state.index} innerRef={e => (e || document.getElementById(this.makeId("action_type"))).onchange = event => {
                this.setState({index: parseInt(event.target.value, 10)})
            }}>
                {(() => {
                    return Utils.actionClassesIndexed.map((clazz, i) => <option value={i}>{clazz.title}</option>)
                })()}
            </Input>
            {this.state.index >= 0 ? <ContentLoader path="/" transformer={this.transform.bind(this)}/> : null}
        </div>
    }
}