import React from 'react'
import {Input} from 'reactstrap'
import ContentLoader from './ContentLoader.js'
import OpenTabAction from './actionFields/OpenTabAction.js'

export default class ActionInput extends React.Component {
    constructor(props){
        super(props)
        this.state = {index: 0}
    }

    get classes() {
        return [OpenTabAction]
    }

    transform(data) {
        this.element = new this.classes[this.state.index]({database: data, current: this.props.value}, this)
        return this.element.render()
    }

    get value() {
        return this.element.getValue()
    }

    validate() {
        return this.element.validate()
    }

    render() {
        if (this.props.disabled)
            return <p>None</p>
        if (this.props.value && !this.state.__x) {
            this.setState({__x: true, index: this.classes.map(c => c.className).indexOf(this.props.value.type)})
            return null
        }
        return <div>
            <Input type="select" id="action_type" defaultValue={this.state.index} innerRef={e => (e || document.getElementById('action_type')).onchange = event => {
                this.setState({index: parseInt(event.target.value, 10)})
            }}>
                {(() => {
                    return this.classes.map((clazz, i) => <option value={i}>{clazz.title}</option>)
                })()}
            </Input>
            {this.state.index >= 0 ? <ContentLoader path="/" transformer={this.transform.bind(this)}/> : null}
        </div>
    }
}