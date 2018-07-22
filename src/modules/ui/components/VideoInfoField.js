import React from 'react'
import {Input, Button, Alert, Badge} from 'reactstrap'

export default class VideoInfoField extends React.Component {
    constructor(props) {
        super(props)
        let v = props.value || {}
        this.state = {
            id: v.id || null,
            thumbnail: v.thumbnail || null,
            title: v.title || null,
            provider: v.provider || 'YouTube',
            status: 'none'
        }
        this.isVerified = () => this.state.id && this.state.thumbnail && this.state.title && this.state.provider && this.state.status === 'ok'
        this.getAlert = () => {
            switch (this.state.status) {
                case 'none': return <Alert style={{margin: '1rem'}} color="warning">Before saving your changes, click Verify to ensure that the provided video is valid.</Alert>
                case 'processing': return <Alert style={{margin: '1rem'}} color="primary">Please wait while the video is being verified.</Alert>
                case 'invalid': return <Alert style={{margin: '1rem'}} color="danger">The provided video is not valid.  Did you copy the ID correctly?</Alert>
                case 'ok': return <Alert style={{margin: '1rem'}} color="success">The video was verified successfully!<br/><br/>
                    Provider: {this.state.provider}<br/>
                    ID: {this.state.id}<br/>
                    Thumbnail: {this.state.thumbnail}<br/>
                    Title: {this.state.title}<br/>
                </Alert>
            }
        }
        this.verifyVideo = (p, i) => {
            if (p === 'YouTube')
                return window.fetch(`https://www.googleapis.com/youtube/v3/search?q=${i}&maxResults=1&part=snippet&type=video&key=AIzaSyB4w3GIY9AUi6cApXAkB76vlG6K6J4d8XE`).then(r => r.json()).then(json => {
                    if (!json || json.pageInfo.totalResults === 0)
                        return null
                    else if (json.items[0].id.videoId !== i)
                        return null
                    else
                        return {
                            title: json.items[0].snippet.title,
                            thumbnail: `https://img.youtube.com/vi/${i}/maxresdefault.jpg`,
                            id: json.items[0].id.videoId
                        }
                })
            else
                return window.fetch(`https://api.vimeo.com/videos/${i}?access_token=e2b6fedeebaa9768c909e81e2565e8a1`).then(r => r.json()).then(json => {
                    if (!json || json.error)
                        return null
                    else
                        return {
                            title: json.name,
                            thumbnail: json.pictures.sizes[5].link,
                            id: json.uri.replace('/videos/', '')
                        }
                })
        }
        this.getValue = this.getValue.bind(this)
        this.validate = this.validate.bind(this)
    }

    getValue() {
        return !this.validate() ? {provider: this.state.provider, id: this.state.id, title: this.state.title, thumbnail: this.state.thumbnail} : null
    }

    validate() {
        return this.state.status === 'ok' ? false : 'The video has not been verified.'
    }

    render() {
        return <div>
            <label style={{fontSize: '1.2rem'}} for="provider">Video Provider</label>
            <Input type="select" id="provider" disabled={this.state.status === 'processing'} defaultValue={this.state.provider}>
                        <option>YouTube</option>
                        <option>Vimeo</option>
            </Input>
            <label style={{fontSize: '1.2rem'}} for="videoId">Video ID</label>
            <p>To find the video ID, look at the video's URL:<br/>
                <ul>
                    <li>YouTube (1): https://youtube.com/watch?v=<Badge color="primary">Video ID here</Badge>
                    </li>
                    <li>YouTube (2): https://youtu.be/<Badge color="primary">Video ID here</Badge>
                    </li>
                    <li>Vimeo: https://vimeo.com/<Badge color="primary">Video ID here</Badge>
                    </li>
                </ul>
                Copy that value into the box below, excluding the slash.
            </p>
            <Input id="videoId" disabled={this.state.status === 'processing'} defaultValue={this.state.id}/>
            {this.getAlert()}
            <Button size="lg" color="primary" onClick={() => {
                let p = document.getElementById('provider').value
                let i = document.getElementById('videoId').value
                if (!p || !i) {
                    this.setState({
                        provider: p,
                        id: i,
                        title: null,
                        thumbnail: null,
                        status: 'invalid'
                    })
                    return
                }
                this.setState({
                    provider: p,
                    id: i,
                    title: null,
                    thumbnail: null,
                    status: 'processing'
                })
                this.verifyVideo(p, i).then(data => {
                    if (!data)
                        this.setState({
                            provider: p,
                            id: i,
                            title: null,
                            thumbnail: null,
                            status: 'invalid'
                        })
                    else
                        this.setState({
                            provider: p,
                            status: 'ok',
                            ...data
                        })
                })
            }}>Verify</Button>
        </div>
    }
}