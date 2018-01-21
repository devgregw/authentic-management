import React from 'react'
import * as firebase from 'firebase'
import {Redirect} from 'react-router-dom'

export default class StorageViewer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            url: null,
            err: null
        }
    }

    render() {
        if (!this.state.url && !this.state.err) 
            firebase
                .storage()
                .ref(this.props.fileName)
                .getDownloadURL()
                .then(url => this.setState({url: url, err: null}),
                    err => this.setState({url: null, err: err})
                )
        if (this.state.url) {
            window.location.replace(this.state.url)
            return null
        }
        if (this.state.error) 
            return <p style={{
                    color: 'red'
                }}>{this.state.err}</p>
        return null
    }
}