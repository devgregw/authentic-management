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
            totalBytes: 0,
            preparing: false
        }
        this.getData = this.getData.bind(this)
        this.getFileInput = () => this.fileInput || document.getElementById('fileInput')
        this.saveImage = this.saveImage.bind(this)
        this.hasValue = this.hasValue.bind(this)
        this.getExtension = this.getExtension.bind(this)
        this.random = Math.random() * 1000
        this.getName = this.getName.bind(this)
    }

    getData(img) {
        if (this.state.bytesTransferred)
            return
        var placeholder = "https://placeholdit.imgix.net/~text?txtsize=50&txt=None&w=200&h=200&txtfont=sans-serif"
        if (!img)
            return
        if (this.state.location === 'none') {
            img.src = placeholder
            return
        }
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
            default:
                throw new Error('Invalid location')
        }
    }

    getName(base) {
        if (this.state.location === 'local')
            return base + this.random + this.getExtension()
        if (this.state.location === 'none')
            return ''
        return this.props.value
    }

    saveImage(name) {
        /*var promises = [new Promise((resolve, reject) => {
            if (this.state.location === 'local')
                firebase.storage().ref(name + this.getExtension()).put(this.getFileInput().files[0], {cacheControl: 'no-cache'}).on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => this.setState({bytesTransferred: snapshot.bytesTransferred, totalBytes: snapshot.totalBytes}), reject, resolve)
        })]*/
        this.setState({preparing: true})
        var promises = []
        if (this.state.location === 'local') {
            promises.push(new Promise((resolve, reject) => {
                var reader = new FileReader()
                reader.onload = () => {
                    var result = reader.result
                    window.fetch('https://devgregw.com/utilities/tinify/tinify.php', {
                        method: "POST",
                        body: result.substr(result.lastIndexOf(',') + 1)
                    }).then(r => {
                        r.text().then(data => {
                            firebase.storage().ref(name).putString(result.substr(0, result.lastIndexOf(',') + 1) + data, 'data_url', {cacheControl: 'no-cache'}).on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => this.setState({preparing: false, bytesTransferred: snapshot.bytesTransferred, totalBytes: snapshot.totalBytes}), reject, resolve)
                        })
                    })
                }
                reader.readAsDataURL(this.getFileInput().files[0])
            }))
        }
        if (this.props.value && this.state.location === 'local')
            promises.push(firebase.storage().ref(this.props.value).delete())
        return Promise.all(promises)
        
    }

    hasValue() {
        return this.state.location !== 'none'
    }

    getExtension() {
        var name = this.props.value || (this.state.file ? this.state.file.name : '.undefined')
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
            <ProgressModal isOpen={this.state.preparing} progressColor="primary" value={100} progressText="Preparing media..."/>
            <p>Download URL: {this.state.location.startsWith('storage') ? <a href={url} target="_blank">{url}</a> : 'none'}</p>
            <img alt="Preview" ref={i => this.getData(i || document.getElementById(`imagePreview${this.random}`))} id={`imagePreview${this.random}`} style={{width: '200px', height: 'auto', border: '1px solid black'}}/>
            </div>
    }
}