import React from 'react'
import {Label,Input, Badge} from 'reactstrap'

export default class OpenYouTubeAction extends React.Component {
    constructor(props) {
        super(props)
        this.validate = this.validate.bind(this)
        this.getValue = this.getValue.bind(this)
        this.makeId = id => id + this.props.rand
    }
    
    render() {
        return <div>
                <Label for={this.makeId("action_oyta_0_addr")}>Video ID</Label>
                <p>To find the video ID, look at the video's URL:<br/>
                <ul>
                    <li>https://youtube.com/watch?v=<Badge color="primary">Video ID here</Badge>
                    </li>
                    <li>https://youtu.be/<Badge color="primary">Video ID here</Badge>
                    </li>
                </ul>
                Copy that value into the box below, excluding the slash.
            </p>
                <Input type="text" id={this.makeId("action_oyta_0_addr")} defaultValue={this.props.current
                        ? this.props.current.videoId
                        : null}/>
            </div>
    }

    validate() {
        if (!document.getElementById(this.makeId("action_oyta_0_addr")).value)
            return {invalid: true, errors: ['No video ID specified']}
        return {}
    }

    getValue() {
        return {
            type: 'OpenYouTubeAction',
            group: 0,
            videoId: document.getElementById(this.makeId("action_oyta_0_addr")).value,
            watchUrl: `https://www.youtube.com/watch?v=${document.getElementById(this.makeId("action_oyta_0_addr")).value}`,
            youtubeUri: `youtube://${document.getElementById(this.makeId("action_oyta_0_addr")).value}`
        }
    }

    static get description() {
        return 'Launches the YouTube app (or website if the app is not available)'
    }

    static get title() {
        return 'Open YouTube App'
    }

    static get className() {
        return 'OpenYouTubeAction'
    }

    static getSummary(action) {
        return `Open YouTube: ${action.videoId}`
    }
}