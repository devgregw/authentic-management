import React from 'react'
import {Input,Button,ButtonGroup} from 'reactstrap'
import * as firebase from 'firebase'
import ProgressModal from './ProgressModal'

export default class ImageUploader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            location: 'none',
            data: null,
            bytesTransferred: 0,
            totalBytes: 0
        }
        this.getData = this.getData.bind(this)
        this.getFileInput = () => this.fileInput || document.getElementById('fileInput')
        this.saveImage = this.saveImage.bind(this)
        this.hasValue = this.hasValue.bind(this)
        this.getExtension = this.getExtension.bind(this)
    }

    getData(img) {
        if (this.state.bytesTransferred)
            return
        var placeholder = "https://placeholdit.imgix.net/~text?txtsize=50&txt=None&w=200&h=200&txtfont=sans-serif"
        if (!img)
            return
        if (this.state.location === 'none')
            img.src = placeholder
        switch (this.state.location) {
            case 'storage':
            img.src = 'https://placeholdit.imgix.net/~text?txtsize=40&txt=Loading&w=200&h=200&txtfont=sans-serif'
                firebase.storage().ref(this.state.data).getDownloadURL().then(url => this.setState({location: 'storage:loaded', url: url}), err => {this.setState({location: 'none', data: null}); console.log(err)})
                break
            case 'storage:loaded':
                img.src = this.state.url
                break;
            case 'local':
                if (this.state.data)
                    img.src = this.state.data
                else {
                    img.src = 'https://placeholdit.imgix.net/~text?txtsize=40&txt=Loading&w=200&h=200&txtfont=sans-serif'
                    var reader = new FileReader()
                    reader.onload = event => this.setState({location: 'local', data: event.target.result})
                    reader.readAsDataURL(this.state.file)
                }
                break
        }
    }

    saveImage(name) {
        return new Promise((resolve, reject) => {
            if (this.state.location === 'local')
                firebase.storage().ref(name + this.getExtension()).put(this.getFileInput().files[0]).on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => this.setState({bytesTransferred: snapshot.bytesTransferred, totalBytes: snapshot.totalBytes}), reject, resolve)
            else
                resolve()
        })
        
    }

    hasValue() {
        return this.state.location !== 'none'
    }

    getExtension() {
        var name = this.props.value || this.state.file.name
        return name.substr(name.lastIndexOf('.'))
    }

    render() {
        if (this.props.value && !this.state.data && !this.state.file) {
            this.setState({location: 'storage', data: this.props.value})
            return null
        }
        var url = `https://accams.devgregw.com/meta/storage/${this.state.data}`
        return <div>
            <Input accept="image/png, image/jpeg" innerRef={i => {
                this.fileInput = i;
                this.getFileInput().onchange = () => {
                    if (this.getFileInput().files.length)
                        this.setState({location: 'local', data: null, file: this.getFileInput().files[0]})
                    else
                        this.setState({location: 'none', data: null})
            }}} id="fileInput" type="file"/>
            <ButtonGroup>
                <Button onClick={() => this.setState({location: 'none'})} color="danger">Clear</Button>
                <Button onClick={() => this.setState({data: null, file: null})} disabled={!this.props.value} color="warning">Reset</Button>
            </ButtonGroup>
            <ProgressModal isOpen={this.state.totalBytes > 0} progressColor="primary" value={(this.state.bytesTransferred / (this.state.totalBytes || 1)) * 100} progressText={Math.round((this.state.bytesTransferred / (this.state.totalBytes || 1)) * 100) + '%'}/>
            <p>Download URL: {this.state.location.startsWith('storage') ? <a href={url} target="_blank">{url}</a> : 'none'}</p>
            <img ref={i => this.getData(i || document.getElementById('imagePreview'))} id="imagePreview" style={{width: '200px', height: 'auto', border: '1px solid black'}}/>
            </div>
    }
}