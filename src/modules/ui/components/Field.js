import React from 'react'

export default class Field {
    constructor(component, id, props, getter, setter) {
        this.component = component
        this.component.ref = id
        this.id = id
        this.props = props
        this.getter = getter
        this.setter = setter
    }

    getValue() {
        return this.getter()
    }
}