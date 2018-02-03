import React from 'react'
import {Label,Input,Badge} from 'reactstrap'

export default class OpenURLAction extends React.Component {
    constructor(props) {
        super(props)
        this.validate = this.validate.bind(this)
        this.getValue = this.getValue.bind(this)
    }
    
    render() {
        return (
            <div>
                <Label for="action_oua_0_url">URL</Label>
                <h4><Badge color="warning"><b>IMPORTANT: </b>If this URL is for a website (e.g. <em>example.com</em>), you <b>must</b> prepend <em>http://</em> or <em>https://</em> to it.</Badge></h4>
                <Input type="url" id="action_oua_0_url" defaultValue={this.props.current
                        ? this.props.current.url
                        : null}/>
            </div>
        )
    }

    validate() {
        if (!document.getElementById('action_oua_0_url').value)
            return {invalid: true, errors: ['No URL provided']}
        return {}
    }

    getValue() {
        return {
            type: 'OpenURLAction',
            group: 0,
            url: document.getElementById('action_oua_0_url').value
        }
    }

    static get description() {
        return 'Launches a URL with the appropriate application'
    }

    static get title() {
        return 'Open URL'
    }

    static get className() {
        return 'OpenURLAction'
    }

    static getSummary(action) {
        return `Open URL: ${action.url}`
    }
}