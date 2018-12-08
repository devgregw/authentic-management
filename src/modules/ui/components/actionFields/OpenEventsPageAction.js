import React from 'react'

export default class OpenEventsPageAction extends React.Component {
    constructor(props) {
        super(props)
        this.validate = this.validate.bind(this)
        this.getValue = this.getValue.bind(this)
    }
    
    render() {
        return <p><i>This action does not have any parameters.</i></p>
    }

    validate() {
        return {}
    }

    getValue() {
        return {
            type: 'OpenEventsPageAction',
            group: 0
        }
    }

    static get description() {
        return 'Opens the Upcoming Events page'
    }

    static get title() {
        return 'Open events page'
    }

    static get className() {
        return 'OpenEventsPageAction'
    }

    static getSummary(action) {
        return `Open events page`
    }
}