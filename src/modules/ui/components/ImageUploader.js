import React from 'react'
import {Input,Button,ButtonGroup,Badge} from 'reactstrap'
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
                firebase.storage().ref((window.localStorage.getItem('db') === 'dev' ? '/dev/' : '') + this.state.data.name).getDownloadURL().then(url => this.setState({location: 'storage:loaded', url: url})).catch(err => {this.setState({data: {name: 'unknown.png', width: this.state.data.width, height: this.state.data.height}}); console.log(err)})
                break
            case 'storage:loaded':
                img.src = this.state.url
                break;
            case 'local':
                if (this.state.data)
                    img.src = this.state.data.name
                else {
                    img.src = 'https://placeholdit.imgix.net/~text?txtsize=40&txt=Loading&w=200&h=200&txtfont=sans-serif'
                    var reader = new FileReader()
                    reader.onload = event => this.setState({location: 'local', data: {name: event.target.result, width: 0, height: 0}})
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
        return this.props.value.name
    }

    saveImage(base) {
        /*var promises = [new Promise((resolve, reject) => {
            if (this.state.location === 'local')
                firebase.storage().ref(name + this.getExtension()).put(this.getFileInput().files[0], {cacheControl: 'no-cache'}).on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => this.setState({bytesTransferred: snapshot.bytesTransferred, totalBytes: snapshot.totalBytes}), reject, resolve)
        })]*/
        let name = this.getName(base)
        var size = this.props.value ? {width: this.props.value.width, height: this.props.value.height} : {width: 0, height: 0}
        this.setState({preparing: true})
        var promises = []
        if (this.state.location === 'local') {
            promises.push(new Promise((resolve, reject) => {
                var reader = new FileReader()
                reader.onload = () => {
                    var result = reader.result
                    let image = new Image()
                    image.onload = () => {
                        size = {width: image.width, height: image.height}
                        firebase.storage().ref((window.localStorage.getItem('db') === 'dev' ? '/dev/' : '') + name).putString(result, 'data_url', {cacheControl: 'no-cache'}).on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => this.setState({preparing: false, bytesTransferred: snapshot.bytesTransferred, totalBytes: snapshot.totalBytes}), reject, resolve)
                    }
                    image.src = result
                }
                reader.readAsDataURL(this.getFileInput().files[0])
            }))
        }
        if (this.props.value && this.state.location === 'local')
            promises.push(firebase.storage().ref((window.localStorage.getItem('db') === 'dev' ? '/dev/' : '') + this.props.value.name).delete())
        return Promise.all(promises).then(() => {return {name: name, ...size}})
        
    }

    hasValue() {
        return this.state.location !== 'none'
    }

    getExtension() {
        var name = this.props.value ? this.props.value.name : (this.state.file ? this.state.file.name : '.undefined')
        return name.substr(name.lastIndexOf('.'))
    }

    render() {
        if (this.props.value && !this.state.data && !this.state.file) {
            this.setState({location: 'storage', data: this.props.value})
            return null
        }
        return <div>
            <h4><Badge color="warning" pill>IMPORTANT</Badge></h4>
            <p>
                It is <b>strongly</b> recommended that you compress all images before uploading them.  High-resolution images and/or images larger than 1-2 MB will significantly degrade performance.  To compress your images, follow the following instructions:<br/>
                <ol>
                    <li>Go to <a href="http://compressimage.toolur.com/">http://compressimage.toolur.com/</a></li>
                    <li>Click 'Upload Images' and select the images you wish to compress</li>
                    <li>Compression method: <Badge color="secondary" pill>A</Badge></li>
                    <li>Image quality: <Badge color="secondary" pill><em>for wallpapers: </em>100</Badge>  <Badge color="secondary" pill><em>everything else: </em>90</Badge></li>
                    <li>Compression type: <Badge color="secondary" pill>Normal</Badge></li>
                    <li>Resize
                        <ul>
                            <li>Width (W): <Badge color="secondary" pill><em>for tab headers: </em>540</Badge>  <Badge color="secondary" pill><em>for wallpapers: </em>1080</Badge>  <Badge color="secondary" pill><em>everything else: </em>1000</Badge></li>
                            <li>Height (H): <Badge color="secondary" pill>0</Badge></li>
                        </ul>
                    </li>
                    <li>Click 'Compress Images' and wait for the process to complete</li>
                    <li>Click 'Download' to save them</li>
                </ol>
            </p>
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
            <p>Download URL: {this.state.location.startsWith('storage') ? <a rel="noopener noreferrer" href={`https://accams.devgregw.com/meta/storage/${window.localStorage.getItem('db') === 'dev' ? 'dev/' : ''}${this.state.data.name}`} target="_blank">{`https://accams.devgregw.com/meta/storage/${window.localStorage.getItem('db') === 'dev' ? 'dev/' : ''}${this.state.data.name}`}</a> : 'none'}</p>
            <img alt="Preview" ref={i => this.getData(i || document.getElementById(`imagePreview${this.random}`))} id={`imagePreview${this.random}`} style={{width: '200px', height: 'auto', border: '1px solid black'}}/>
            </div>
    }
}