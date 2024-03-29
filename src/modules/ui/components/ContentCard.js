import React from 'react'
import {
    Button,
    ButtonGroup,
    ButtonToolbar,
    Card,
    CardBody,
    CardTitle,
    CardSubtitle,
    Badge
} from 'reactstrap'
import BasicModal from './BasicModal.js'
import PropTypes from 'prop-types'
import ProgressModal from './ProgressModal.js'
import Utils from '../../classes/Utils.js'
import BasicCard from './BasicCard'
import Delete from '../../classes/Delete'
import * as moment from 'moment'

export default class ContentCard extends React.Component {
    static propTypes = {
        type: PropTypes.string,
        data: PropTypes.any,
        refresh: PropTypes.func,
        push: PropTypes.func
    }

    constructor(props) {
        super(props)
        this.state = {
            deleteModal: false,
            ProgressModal: false
        }
    }

    toggleDeleteModal() {
        this.setState({
            deleteModal: !this.state.deleteModal
        })
    }

    validateTabs(tabs) {
        if (!tabs)
            return 0
        var count = 0
        for (var id in tabs) {
            let tab = tabs[id]
            if (!tab.action && (!tab.elements || tab.elements.length === 0))
                count++
        }
        return count
    }

    validateEvents(events) {
        if (!events)
            return 0
        var count = 0
        for (var id in events) {
            let event = events[id]
            if (event.index === undefined && moment(event.dateTime.end, moment.ISO_8601).isBefore(moment()) && !event.recurrence)
                count++
        }
        return count
    }

    render() {
        switch (this.props.type) {
            case 'category':
                switch (this.props.data.type) {
                    case 'tabs':
                        let tabErrors = this.validateTabs(this.props.data.tabs)
                        return <BasicCard title="All Pages">
                            <Button onClick={() => this.props.push('tabs')} size="lg" outline color="primary">Manage</Button>
                            <Badge style={{fontSize: 'x-large', verticalAlign: 'middle', margin: '3px'}} color="dark">{Object.getOwnPropertyNames(this.props.data.tabs || {}).length}</Badge>
                            { tabErrors ? <Badge style={{fontSize: 'large', verticalAlign: 'middle', margin: '3px'}} color="warning">{tabErrors} need{tabErrors !== 1 ? '' : 's'} attention</Badge> : null }
                        </BasicCard>
                    case 'videos':
                        return <BasicCard title="Collections">
                            <ButtonGroup>
                                <Button color="primary" outline onClick={() => Utils.openNewCollection()}>New Collection</Button>
                                <Button color="primary" outline onClick={() => Utils.openAddVideoToCollection()}>Add Video to Collection</Button>
                            </ButtonGroup>
                            <br/>
                            <Button onClick={() => this.props.push('tabs', 'watchPlaylist')} size="sm" outline>Manage Collections</Button>
                            <Badge style={{fontSize: 'large', verticalAlign: 'middle', margin: '3px'}} color="dark">{Object.getOwnPropertyNames(Object.getOwnPropertyNames(this.props.data.tabs).map(n => this.props.data.tabs[n]).filter(x => x.specialType === "watchPlaylist") || {}).length}</Badge>
                        </BasicCard>
                    case 'notifications':
                        return <BasicCard title="Notifications">
                            <ButtonGroup>
                            <Button onClick={() => window.open('https://console.firebase.google.com/project/authentic-city-church/notification/compose', '_blank')} size="lg" outline color="primary">Send Notification</Button>
                            <Button onClick={() => Utils.openPopup(`${Utils.getBaseUrl()}/meta/action`, 1000, 600)} outline color="dark">Create Action</Button>
                            <Button onClick={() => Utils.openPopup(`https://us-central1-authentic-city-church.cloudfunctions.net/storage?path=firebase.pdf`, 1000, 600)} outline color="dark">Instructions</Button>
                            </ButtonGroup>
                        </BasicCard>
                    case 'blog':
                        return <BasicCard title="Blog"><h2><Badge color="warning" pill>Under Construction</Badge></h2></BasicCard>
                    case 'events':
                        let eventErrors = this.validateEvents(this.props.data.events)
                        return <BasicCard title="Upcoming Event Pages">
                            <ButtonGroup>
                            <Button onClick={() => this.props.push('events')} size="lg" outline color="primary">Manage</Button>
                            <Button onClick={() => Utils.openEditor({category: 'appearance_events', parent: 'events', path: '/appearance/events/'})} outline color="dark">Edit Appearance</Button>
                            </ButtonGroup>
                            <Badge style={{fontSize: 'x-large', verticalAlign: 'middle', margin: '3px'}} color="dark">{Object.getOwnPropertyNames(this.props.data.events || {}).length}</Badge>
                            { eventErrors ? <Badge style={{fontSize: 'large', verticalAlign: 'middle', margin: '3px'}} color="warning">{eventErrors} need{eventErrors !== 1 ? '' : 's'} attention</Badge> : null }
                            </BasicCard>
                    case 'meta':
                        return <BasicCard title="Resources">
                            <Button color="link" onClick={() => window.open('https://trello.com/b/QUgekVh6/app-roadmap', '_blank')}>Trello Roadmap →</Button><br/>
                            <Button color="link" onClick={() => window.location.assign('mailto:devgregw@outlook.com')}>Contact →</Button>
                            <hr/>
                            <CardTitle>Download Links <small>(right-click to copy)</small></CardTitle>
                            <p><a href="https://play.google.com/store/apps/details?id=church.authenticcity.android" rel="noopener noreferrer" target="_blank">Android</a><br/><a href="https://itunes.apple.com/us/app/authentic-city-church/id1402645724?ls=1&mt=8" rel="noopener noreferrer" target="_blank">iOS</a></p>
                            <hr/>
                            <CardTitle>Version Codes</CardTitle>
                            <p>{`Android: ${this.props.data.versions.android}`}<br/>{`iOS: ${this.props.data.versions.ios}`}</p>
                        </BasicCard>
                    default:
                        throw new Error('Unexpected data type: ' + this.props.data.type)
                }
            case 'tab':
                var elements = this.props.data.elements || []
                var count = elements.length
                var w = count === 1 ? 'Element' : 'Elements'
                var badge = count === 0 && !this.props.data.action ? <Badge color="warning">No Content</Badge> : this.props.data.action ? <Badge color="primary">Action Enabled</Badge> : <Badge color="secondary">{count} {w}</Badge>
                return <Card className="Content-card">
                    <CardBody>
                        <CardTitle>{this.props.data.specialType ? <i style={{color: 'var(--dark)'}} className="material-icons">extension</i> : null} {this.props.data.title} {badge}</CardTitle>
                        <CardSubtitle>/tabs/{this.props.data.id}/</CardSubtitle>
                        <ButtonToolbar className="Content-card-toolbar">
                        {Boolean(this.props.data.action) ? null : <Button style={{marginRight: '0.625rem'}} onClick={() => this.props.push(this.props.data.id)} outline color="primary">Manage</Button>}
                        <ButtonGroup>
                            <Button outline color="dark" onClick={() => Utils.openEditor({category: 'tabs', path: `/tabs/${this.props.data.id}/`})}>Edit</Button>
                            <Button outline color="danger" onClick={this
                                    .toggleDeleteModal
                                    .bind(this)}>Delete</Button>
                            <BasicModal isOpen={this.state.deleteModal} toggle={this
                                    .toggleDeleteModal
                                    .bind(this)} header="Delete Confirmation" body={<p>Are you sure you want to delete this tab?<br/><br/>
                                        {this.props.data.title}<br/>/tabs/{this.props.data.id}/</p>}
                                primary="Delete" primaryColor="danger" secondary="Cancel" onPrimary={() => {
                                    this.setState({ProgressModal: true})
                                    Delete.tab(this.props.data).then(() => {
                                            this.setState({deleteModal: false, ProgressModal: false})
                                            this
                                                .props
                                                .refresh()
                                        })                                        
                                }}/>
                            <ProgressModal isOpen={this.state.ProgressModal} progressColor="danger" progressText="Deleting..."/>
                        </ButtonGroup>
                        </ButtonToolbar>
                    </CardBody>
                </Card>
                case 'event':
                if (this.props.data.index !== undefined) {
                    elements = this.props.data.elements || []
                    count = elements.length
                    w = count === 1 ? 'Element' : 'Elements'
                    badge = count === 0 && !this.props.data.action ? <Badge color="warning">No Content</Badge> : this.props.data.action ? <Badge color="primary">Action Enabled</Badge> : <Badge color="secondary">{count} {w}</Badge>
                    return <Card className="Content-card">
                        <CardBody>
                            <CardTitle>{this.props.data.title} {badge}</CardTitle>
                            <CardSubtitle>/events/{this.props.data.id}/</CardSubtitle>
                            <ButtonToolbar className="Content-card-toolbar">
                            {this.props.data.action ? null : <Button style={{marginRight: '0.625rem'}} onClick={() => this.props.push(this.props.data.id)} outline color="primary">Manage</Button>}
                            <ButtonGroup>
                                <Button outline color="dark" onClick={() => Utils.openEditor({category: 'events_c', path: `/events/${this.props.data.id}/`})}>Edit</Button>
                                <Button outline color="danger" onClick={this
                                        .toggleDeleteModal
                                        .bind(this)}>Delete</Button>
                                <BasicModal isOpen={this.state.deleteModal} toggle={this
                                        .toggleDeleteModal
                                        .bind(this)} header="Delete Confirmation" body={<p>Are you sure you want to delete this event?<br/><br/>
                                            {this.props.data.title}<br/>/events/{this.props.data.id}/</p>}
                                    primary="Delete" primaryColor="danger" secondary="Cancel" onPrimary={() => {
                                        this.setState({ProgressModal: true})
                                        Delete.event(this.props.data).then(() => {
                                                this.setState({deleteModal: false, ProgressModal: false})
                                                this
                                                    .props
                                                    .refresh()
                                            })                                        
                                    }}/>
                                <ProgressModal isOpen={this.state.ProgressModal} progressColor="danger" progressText="Deleting..."/>
                            </ButtonGroup>
                            </ButtonToolbar>
                        </CardBody>
                    </Card>
                }
                badge = moment(this.props.data.dateTime.end, moment.ISO_8601).isBefore(moment()) && !this.props.data.recurrence ? <Badge color="warning">Outdated</Badge> : null
                return <Card className="Content-card">
                    <CardBody>
                        <CardTitle>{this.props.data.title} {badge}</CardTitle>
                        <CardSubtitle>/events/{this.props.data.id}/</CardSubtitle>
                        <ButtonToolbar className="Content-card-toolbar">
                        <ButtonGroup>
                            <Button outline color="dark" onClick={() => Utils.openEditor({category: 'events', path: `/events/${this.props.data.id}/`})}>Edit</Button>
                            <Button outline color="danger" onClick={this
                                    .toggleDeleteModal
                                    .bind(this)}>Delete</Button>
                            <BasicModal isOpen={this.state.deleteModal} toggle={this
                                    .toggleDeleteModal
                                    .bind(this)} header="Delete Confirmation" body={<p>Are you sure you want to delete this event?<br/><br/>
                                        {this.props.data.title}<br/>/events/{this.props.data.id}/</p>}
                                primary="Delete" primaryColor="danger" secondary="Cancel" onPrimary={() => {
                                    this.setState({ProgressModal: true})
                                    Delete.event(this.props.data).then(() => {
                                            this.setState({deleteModal: false, ProgressModal: false})
                                            this
                                                .props
                                                .refresh()
                                        })                                        
                                }}/>
                            <ProgressModal isOpen={this.state.ProgressModal} progressColor="danger" progressText="Deleting..."/>
                        </ButtonGroup>
                        </ButtonToolbar>
                    </CardBody>
                </Card>
                case 'element':
                var id = (this.props.extras.tab || this.props.extras.event).id
                var path = `/${this.props.parentCategory}/${id}/elements/${this.props.index}`
                return <Card className="Content-card">
                <CardBody>
                    <CardTitle className="Cap-first">{Utils.getElementTitle(this.props.data)}</CardTitle>
                    <CardSubtitle>{Utils.getElementSummary(this.props.data)}</CardSubtitle>
                    <br/>
                    <CardSubtitle>{path}</CardSubtitle>
                    <ButtonToolbar className="Content-card-toolbar">
                    <ButtonGroup>
                        <Button outline color="dark" onClick={() => Utils.openEditor({category: 'elements_' + this.props.data.type, path: path, parent: id, parentCategory: this.props.parentCategory})}>Edit</Button>
                        <Button outline color="danger" onClick={this
                                .toggleDeleteModal
                                .bind(this)}>Delete</Button>
                        <BasicModal isOpen={this.state.deleteModal} toggle={this
                                .toggleDeleteModal
                                .bind(this)} header="Delete Confirmation" body={<p>Are you sure you want to delete this element?<br/><br/>{path}</p>}
                            primary="Delete" primaryColor="danger" secondary="Cancel" onPrimary={() => {
                                this.setState({ProgressModal: true})
                                Delete.element(this.props.data, this.props.index, this.props.extras.tab || this.props.extras.event, this.props.parentCategory).then(() => {
                                        this.setState({deleteModal: false, ProgressModal: false})
                                        this
                                            .props
                                            .refresh()
                                    })
                            }}/>
                        <ProgressModal isOpen={this.state.ProgressModal} progressColor="danger" progressText="Deleting..."/>
                    </ButtonGroup>
                    </ButtonToolbar>
                </CardBody>
            </Card>
            default:
                throw new Error('Unexpected prop type')
        }
    }
}