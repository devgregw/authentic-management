import React from 'react'
import {Label,Input} from 'reactstrap'

export default class OpenSpotifyAction extends React.Component {
    constructor(props) {
        super(props)
        this.validate = this.validate.bind(this)
        this.getValue = this.getValue.bind(this)
        this.makeId = id => id + this.props.rand
    }
    
    render() {
        return <div>
                <Label for={this.makeId("action_osa_0_addr")}>Spotify Identifier</Label>
                <Label for={this.makeId("action_osa_0_addr")}>To get the Spotify identifier, click the three dots beside the play and follow buttons for a playlist or artist, click Share, and click <b>Copy Spotify URI</b>.  To get the Spotify identifier for a song, right click the song then follow same steps.  Paste the value in the box below.</Label>
                <Input type="text" id={this.makeId("action_osa_0_addr")} defaultValue={this.props.current
                        ? this.props.current.spotifyUri
                        : null}/>
            </div>
    }

    validate() {
        if (!document.getElementById(this.makeId("action_osa_0_addr")).value)
            return {invalid: true, errors: ['No Spotify identifier specified']}
        return {}
    }

    getValue() {
        var spotifyUrl = document.getElementById(this.makeId("action_osa_0_addr")).value
        while (spotifyUrl.indexOf(':') >= 0)
            spotifyUrl = spotifyUrl.replace(':', '/')
        spotifyUrl = spotifyUrl.replace('spotify', 'https://open.spotify.com')
        return {
            type: 'OpenSpotifyAction',
            group: 0,
            spotifyUri: document.getElementById(this.makeId("action_osa_0_addr")).value,
            spotifyUrl: spotifyUrl
        }
    }

    static get description() {
        return 'Launches the Spotify app (or website if the app is not available)'
    }

    static get title() {
        return 'Open Spotify App'
    }

    static get className() {
        return 'OpenSpotifyAction'
    }

    static getSummary(action) {
        return `Open Spotify: ${action.spotifyUri}`
    }
}