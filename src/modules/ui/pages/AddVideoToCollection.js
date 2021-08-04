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

export default class AddVideoToCollection extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            savingModal: false,
            errorModal: false,
            cancelModal: false,
            errors: [],
            collectionId: null,
            collections: []
        }
        this.validate = this.validate.bind(this)
        this.save = this.save.bind(this)
    }

    componentDidMount() {
        let root = firebase.database().ref()
        if (window.localStorage.getItem('db') === 'dev')
            root = root.child('dev')
        root.child('tabs').child('OPQ26R4SRP').child('elements').once('value').then(snapshot => {
                let arr = snapshot.val().map(e => ({ id: e._buttonInfo.action.tabId, title: e._buttonInfo.label})).filter(x => !!x)
                this.setState({collections: arr, collectionId: arr.length > 0 ? arr[0].id : null})
            })
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
        if (!this.state.collections.findIndex(c => c.id === this.state.collectionId) < 0)
            errors.push('A collection has not been selected.')
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
            this.setState({ errorModal: true, errors: errors })
        else {
            this.setState({ savingModal: true })
            let videoElementProperties = {
                type: 'video',
                id: this.elementId,
                parent: this.state.collectionId,
                large: false,
                hideTitle: true,
                videoInfo: this.videoInfoField.getValue()
            }
            setTimeout(() => {
                let root = firebase.database().ref()
                if (window.localStorage.getItem('db') === 'dev')
                    root = root.child('dev')
                root.child('tabs').child(this.state.collectionId).once('value').then(snapshot => {
                    var tab = snapshot.val()
                    if (!tab.elements)
                        tab.elements = []
                    var i;
                    // eslint-disable-next-line
                    if ((i = tab.elements.map(v => v.id).indexOf(videoElementProperties.id)) === -1)
                        tab.elements.splice(0, 0, videoElementProperties)
                    else
                        tab.elements[i] = videoElementProperties
                    return tab
                }).then(newData => {
                    return root.child('tabs').child(this.state.collectionId).set(newData)
                }).then(() => this.closeEditor(true), e => { alert(e); this.closeEditor(false) })
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
                <Field property="collectionId" title="Collection" description="Select the collection that this video belongs to.">
                    <Input type="select" value={this.state.collectionId || ""} onChange={e => this.setState({collectionId: e.currentTarget.selectio})}>
                        {this.state.collections.map(c => <option value={c.id} key={c.id}>{c.title}</option>)}
                    </Input>
                </Field>
                <Field property="videoInfo" title="Video Info" description="Specify the video's ID and provider.">
                    <VideoInfoField ref={f => this.videoInfoField = f} />
                </Field>
            </div>

            <BasicModal toggle={() => this.setState({
                cancelModal: !this.state.cancelModal
            })} isOpen={this.state.cancelModal} header="Unsaved Changes" body={<p>If you close this window, your changes will not be saved.<br />Are you sure you want to continue?</p>} primary="Discard Changes" primaryColor="danger" secondary="Go Back" onPrimary={this.closeEditor.bind(this, false)} />
            <ProgressModal isOpen={this.state.collectionId === null && this.state.collections.length === 0} progressColor="primary" progressText="Loading collections..." />
            <ProgressModal isOpen={this.state.savingModal} progressColor="primary" progressText="Processing..." />
            <BasicModal toggle={() => this.setState({ errorModal: false, errors: [] })} isOpen={this.state.errorModal} header="Validation Error" body={<div><p>Please resolve the following errors:<br /></p><ul>{(this.state.errors || []).map(e => <li key={e}>{e}</li>)}</ul></div>} primary="Dismiss" primaryColor="primary" />
        </div>
    }
}