import React from 'react'
import { Card, CardBody, CardTitle, CardSubtitle, Button,ButtonGroup } from 'reactstrap'
import Utils from '../../classes/Utils'
import ContentLoader from '../components/ContentLoader'
import Path from '../../classes/Path'
import * as queryString from 'query-string'
import BasicModal from '../components/BasicModal'
import EditorToolbar from '../components/EditorToolbar'
import ProgressModal from '../components/ProgressModal'
import * as firebase from 'firebase'

export default class Reorder extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            didLoad: false,
            newList: [],
            tab: null,
            ProgressModal: false,
            cancelModal: false
        }
        this.options = queryString.parse(window.location.search)
    }

    move(e, d) {
        var list = this.state.newList
        var mv = (f, t, l) => {
            l.splice(t, 0, l.splice(f, 1)[0])
            this.setState({newList: l})
        }
        var oldIndex = list.indexOf(e)
        switch (d) {
            case 'up':
                mv(oldIndex, oldIndex - 1, list)
                break
            case 'dn':
                mv(oldIndex, oldIndex + 1, list)
                break;
            default:
                throw new Error('what the heck')
        }
    }

    moveTo(e, d) {
        var list = this.state.newList
        var mv = (f, t, l) => {
            l.splice(t, 0, l.splice(f, 1)[0])
            this.setState({newList: l})
        }
        var oldIndex = list.indexOf(e)
        switch (d) {
            case 'up':
                mv(oldIndex, 0, list)
                break
            case 'dn':
                mv(oldIndex, list.length - 1, list)
                break;
            default:
                throw new Error('what the heck')
        }
    }

    makeCard(t, e) {
        return <Card key={e.id} className="Content-card" style={{minHeight: '150px'}}>
                <CardBody style={{display: 'flex', flexDirection: 'row'}}>
                    <div style={{position: 'relative', marginRight: '1.25rem'}}>
                        <Button color={this.state.newList.indexOf(e) === 0 ? 'light' : 'primary'} size="lg" onClick={this.move.bind(this, e, 'up')} disabled={this.state.newList.indexOf(e) === 0}>↑</Button>
                        <Button color={this.state.newList.indexOf(e) === this.state.newList.length - 1 ? 'light' : 'primary'} size="lg" onClick={this.move.bind(this, e, 'dn')} disabled={this.state.newList.indexOf(e) === this.state.newList.length - 1} style={{position: 'absolute', left: 0, bottom: 0}}>↓</Button>
                    </div>
                    <div style={{flexGrow: 1, padding: 0, margin: 0}}>
                    <CardTitle className="Cap-first">{e.type}</CardTitle>
                    <CardSubtitle>{Utils.getElementSummary(e)}</CardSubtitle>
                    <br/>
                    <CardSubtitle>{`/${this.options.type}/${e.parent}/elements/${t.elements.indexOf(e)}`}</CardSubtitle>
                    <br/>
                    <ButtonGroup>
                        <Button color="link" disabled={this.state.newList.indexOf(e) === 0} onClick={this.moveTo.bind(this, e, 'up')}>Top</Button>
                        <Button color="link" disabled={this.state.newList.indexOf(e) === this.state.newList.length - 1} onClick={this.moveTo.bind(this, e, 'dn')}>Bottom</Button>
                    </ButtonGroup>
                    </div>
                </CardBody>
            </Card>
    }

    save() {
        this.setState({ProgressModal: true})
        setTimeout(() => {
            var newTab = this.state.tab
            newTab.elements = this.state.newList.filter(o => Boolean(o))
            firebase.database().ref(`/${this.options.type}/${newTab.id}`).update(newTab).then(() => this.closeEditor(true), err => {
                alert(err)
                this.closeEditor(false)
            })
        }, 50)
    }

    transform(data) {
        if (!this.state.tab) {
            this.setState({didLoad: true, tab: data, newList: data.elements})
            return
        }
        return <div>
            <EditorToolbar onSave={this.save.bind(this)} onCancel={() => this.setState({cancelModal: true})}/>
                <div style={{margin: 'calc(56px + 1rem) 1rem 1rem 1rem'}}>{this.state.newList.map(e => this.makeCard(data, e))}</div>
                <ProgressModal isOpen={this.state.ProgressModal} progressColor="primary" progressText="Processing..."/>
                <BasicModal toggle={() => this.setState({
                        cancelModal: !this.state.cancelModal
                    })} isOpen={this.state.cancelModal} header="Unsaved Changes" body={<p>If you close this window, your changes will not be saved.<br/>Are you sure you want to continue?</p>} primary="Discard Changes" primaryColor="danger" secondary="Go Back" onPrimary={this.closeEditor.bind(this, false)}/>
                </div>
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
        if (!this.state.didLoad || !this.state.tab) {
            if (!this.options.id)
                return <BasicModal isOpen={true} onPrimary={this.closeEditor.bind(this, false)} primary="Close" header="Invalid Request" body="ERROR: The request is invalid."/>
            return <ContentLoader path={new Path([this.options.type, this.options.id])} transformer={this.transform.bind(this)}/>
        }
        return this.transform.bind(this)(this.state.tab)
    }
}