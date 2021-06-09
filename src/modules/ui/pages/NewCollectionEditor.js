import React from "react";
import EditorToolbar from '../components/EditorToolbar.js'
import BasicModal from '../components/BasicModal.js'
import ProgressModal from '../components/ProgressModal.js'
import { FormGroup, Label, Input, Form, Badge } from 'reactstrap'
import ImageUploader from '../components/ImageUploader'
import VideoInfoField from '../components/VideoInfoField'
import firebase from 'firebase/app'
import 'firebase/database'

function Field(props) {
    return <FormGroup>
        <Label className="Label-title" for={props.property}>{props.title} {props.optional ? <Badge pill color="primary">Optional</Badge> : null}</Label>
        {
            props.description
                ? <div>
                    <Label className="Label-description" for={props.property}>{props.description}</Label>
                </div>
                : null
        }
        {props.children}
        <hr />
    </FormGroup>
}

export default class NewCollectionEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            savingModal: false,
            errorModal: false,
            cancelModal: false,
            errors: []
        }
        this.validate = this.validate.bind(this)
        this.save = this.save.bind(this)
    }

    componentDidMount() {
        this.parentId = this.createId()
        this.elementId = this.createId()
    }

    createId() {
        return Math
            .random()
            .toString(36)
            .substr(2, 10)
            .toUpperCase()
    }

    validate() {
        let errors = []
        if (document.getElementById('title').value === '')
            errors.push('No title specified.')
        if (!this.imageUploader.hasValue())
            errors.push('A header image must be specified.')
        let video
        // eslint-disable-next-line
        if (video = this.videoInfoField.validate())
            errors.push(video)
        return errors
    }

    save() {
        var errors;
        // eslint-disable-next-line
        if ((errors = this.validate.bind(this)()) && errors.length > 0)
            this.setState({errorModal: true, errors: errors})
        else {
            this.setState({savingModal: true})
            this.imageUploader.saveImage(`header_${this.parentId}`).then(resource => {
                let playlistPageProperties = {
                    id: this.parentId,
                    index: 0,
                    action: null,
                    password: null,
                    visibility: { override: false },
                    title: document.getElementById('title').value,
                    header: resource,
                    specialType: 'watchPlaylist'
                }
                let videoElementProperties = {
                    type: 'video',
                    id: this.elementId,
                    parent: this.parentId,
                    large: false,
                    hideTitle: true,
                    videoInfo: this.videoInfoField.getValue()
                }
                playlistPageProperties.elements = [videoElementProperties]
                let watchTileProperties = {
                    type: 'thumbnailButton',
                    id: this.elementId,
                    parent: 'OPQ26R4SRP',
                    large: false,
                    hideTitle: true,
                    thumbnail: resource,
                    _buttonInfo: {
                        label: document.getElementById('title').value,
                        action: {
                            type: 'OpenTabAction',
                            group: 0,
                            tabId: this.parentId
                        }
                    }
                }
                setTimeout(() => {
                    let root = firebase.database().ref(window.localStorage.getItem('db') === 'dev' ? '/dev' : '')
                    Promise.all([
                        root.child('tabs').child(this.parentId).set(playlistPageProperties),
                        root.child('tabs').child('OPQ26R4SRP').once('value').then(snapshot => {
                            var tab = snapshot.val()
                            if (!tab.elements)
                                tab.elements = []
                            var i;
                            // eslint-disable-next-line
                            if ((i = tab.elements.map(v => v.id).indexOf(watchTileProperties.id)) === -1)
                                tab.elements.splice(0, 0, watchTileProperties)
                            else
                                tab.elements[i] = watchTileProperties
                            return tab
                        }).then(newData => {
                            return root.child('tabs').child('OPQ26R4SRP').set(newData)
                        })
                    ]).then(() => this.closeEditor(true), e => {alert(e);this.closeEditor(false)})
                })
            })
        }
    }

    closeEditor(reload) {
        if (window.opener) {
            if (reload)
                window.opener.location.reload()
            window.close()
        } else
            window.location.href = '/'
    }
    
    render() {
        return <div>
            <EditorToolbar onSave={this.save.bind(this)} onCancel={() => this.setState({ cancelModal: true })} />
            <div style={{
                margin: '0 1rem',
                paddingTop: '56px'
            }}>
                <Field property="title" title="Title">
                    <Input id="title" defaultValue="" />
                </Field>
                <Field property="header" title="Header Image" description="Specify a header image.  Click Clear to remove the image or click Reset to restore the original value.">
                    <ImageUploader ref={u => this.imageUploader = u} />
                </Field>

                <h3>Add the first video to this collection:</h3>
                <Field property="videoInfo" title="Video Info" description="Specify the video's ID and provider.">
                    <VideoInfoField ref={f => this.videoInfoField = f} />
                </Field>
            </div>

            <BasicModal toggle={() => this.setState({
                cancelModal: !this.state.cancelModal
            })} isOpen={this.state.cancelModal} header="Unsaved Changes" body={<p>If you close this window, your changes will not be saved.<br />Are you sure you want to continue?</p>} primary="Discard Changes" primaryColor="danger" secondary="Go Back" onPrimary={this.closeEditor.bind(this, false)} />
            <ProgressModal isOpen={this.state.savingModal} progressColor="primary" progressText="Processing..." />
            <BasicModal toggle={() => this.setState({ errorModal: false, errors: [] })} isOpen={this.state.errorModal} header="Validation Error" body={<div><p>Please resolve the following errors:<br /></p><ul>{(this.state.errors || []).map(e => <li key={e}>{e}</li>)}</ul></div>} primary="Dismiss" primaryColor="primary" />
        </div>
    }
}