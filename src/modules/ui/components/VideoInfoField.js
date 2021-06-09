import React from 'react'
import { Input, Button, Alert, Badge, Container, Col, Row, Card, CardImg, CardTitle, CardBody, CardFooter, Collapse } from 'reactstrap'

export default class VideoInfoField extends React.Component {
    constructor(props) {
        super(props)
        let v = props.value || {}
        this.state = {
            id: v.id || null,
            thumbnail: v.thumbnail || null,
            title: v.title || null,
            provider: v.provider || 'YouTube',
            status: 'none',
            knownVideos: {}
        }
        this.isVerified = () => this.state.id && this.state.thumbnail && this.state.title && this.state.provider && this.state.status === 'ok'
        this.getAlert = () => {
            switch (this.state.status) {
                case 'none': return <Alert style={{ margin: '1rem' }} color="warning">Before saving your changes, click Verify to ensure that the provided video is valid.</Alert>
                case 'processing': return <Alert style={{ margin: '1rem' }} color="primary">Please wait while the video is being verified.</Alert>
                case 'invalid': return <Alert style={{ margin: '1rem' }} color="danger">The provided video is not valid.  Did you copy the ID correctly?</Alert>
                case 'ok': return <Alert style={{ margin: '1rem' }} color="success">The video was verified successfully!<br /><br />
                    Provider: {this.state.provider.split(' ')[0]}<br />
                    ID: {this.state.id}<br />
                    Thumbnail: {this.state.thumbnail}<br />
                    Title: {this.state.title}<br />
                </Alert>
                default: return null
            }
        }
        this.verifyVideo = (p, i) => {
            console.log(p, i)
            if (p === 'YouTube')
                return window.fetch("https://us-central1-authentic-city-church.cloudfunctions.net/videos").then(r => r.json()).then(json => {
                    if (!json || Object.getOwnPropertyNames(json || {}).length === 0 || !json[i])
                        return null
                    return {
                        title: json[i].toString(),
                        id: i,
                        thumbnail: `https://img.youtube.com/vi/${i}/maxresdefault.jpg`
                    }
                }, e => {console.error(e);return null})
            else if (p === 'YouTube - Manual entry')
                return Promise.resolve({
                    title: document.getElementById("manTitle").value,
                    thumbnail: `https://img.youtube.com/vi/${i}/maxresdefault.jpg`,
                    id: i
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

    componentDidMount() {
        window.fetch('https://us-central1-authentic-city-church.cloudfunctions.net/videos').then(r => r.json(), e => {
            this.setState({ knownVideos: {} })
            console.error(e)
        }).then(json => this.setState({knownVideos: json}), e => {
            this.setState({knownVideos: {}})
            console.error(e)
        })
    }

    getValue() {
        return !this.validate() ? { provider: this.state.provider.split(" ")[0], id: this.state.id, title: this.state.title, thumbnail: this.state.thumbnail } : null
    }

    validate() {
        return this.state.status === 'ok' ? false : 'The video has not been verified.'
    }

    render() {
        return <div>
            <label style={{ fontSize: '1.2rem' }} htmlFor="provider">Video Provider</label>
            <Input type="select" id="provider" disabled={this.state.status === 'processing'} onChange={() => this.setState({ provider: document.getElementById("provider").value })} defaultValue={this.state.provider}>
                <option>YouTube</option>
                <option>YouTube - Manual entry</option>
                <option>Vimeo</option>
            </Input>
            <Collapse isOpen={this.state.provider === 'YouTube'} unmountOnExit mountOnEnter>
                <label style={{ fontSize: '1.2rem' }}>Select a Recent Video</label>
                <Container className="py-2">
                    <Row xs="2" md="4">
                        {Object.getOwnPropertyNames(this.state.knownVideos).filter((_, i) => i < 8).map(id => <Col className="pb-1" key={id}>
                            <Card>
                                <CardImg src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`} />
                                <CardBody>
                                    <CardTitle>{this.state.knownVideos[id]}</CardTitle>
                                    <small>{id}</small>
                                </CardBody>
                                <CardFooter className="p-1">
                                    <Button size="sm" color="primary" className="m-0" onClick={() => this.setState({ id: id, status: 'processing' }, () => {
                                        this.verifyVideo("YouTube", id).then(data => {
                                            if (!data)
                                                this.setState({
                                                    provider: "YouTube",
                                                    id: id,
                                                    title: null,
                                                    thumbnail: null,
                                                    status: 'invalid'
                                                })
                                            else
                                                this.setState({
                                                    provider: "YouTube",
                                                    status: 'ok',
                                                    ...data
                                                })
                                        })
                                    })}>Select</Button>
                                </CardFooter>
                            </Card>
                        </Col>)}
                    </Row>
                </Container>
            </Collapse>
            <label style={{ fontSize: '1.2rem' }} htmlFor="videoId">Video ID</label>
            <p>Manually enter the desired video's ID.  To find the video ID, look at the video's URL and paste the value (not the entire URL).</p>
            <ul>
                <li>YouTube (1): https://youtube.com/watch?v=<Badge color="primary">Video ID here</Badge>
                </li>
                <li>YouTube (2): https://youtu.be/<Badge color="primary">Video ID here</Badge>
                </li>
                <li>Vimeo: https://vimeo.com/<Badge color="primary">Video ID here</Badge>
                </li>
            </ul>
            <Input id="videoId" disabled={this.state.status === 'processing'} onChange={e => this.setState({status: 'none', id: e.currentTarget.value})} value={this.state.id || ""} />
            {this.state.provider === 'YouTube - Manual entry' ? <div>
                <label style={{ fontSize: '1.2rem' }} for="manTitle">Title</label>
                <Input id="manTitle" disabled={this.state.status === 'processing'} defaultValue={this.state.title} />
            </div> : null}
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