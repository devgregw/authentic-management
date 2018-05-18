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

    render() {
        switch (this.props.type) {
            case 'category':
                switch (this.props.data.type) {
                    case 'tabs':
                        return <BasicCard title="Tabs"><Button onClick={() => this.props.push('tabs')} size="lg" outline color="primary">Manage</Button></BasicCard>
                    case 'notifications':
                        return <BasicCard title="Notifications"><Button onClick={() => Utils.openSender()} size="lg" outline color="primary">Send Notification</Button></BasicCard>
                    case 'blog':
                        return <BasicCard title="Blog"><h2><Badge color="warning" pill>Under Construction</Badge></h2></BasicCard>
                    case 'events':
                        return <BasicCard title="Upcoming Events">
                            <ButtonGroup>
                            <Button onClick={() => this.props.push('events')} size="lg" outline color="primary">Manage</Button>
                            <Button onClick={() => Utils.openEditor({category: 'appearance_events', parent: 'events', path: '/appearance/events/'})} outline color="dark">Edit Appearance</Button>
                            </ButtonGroup>
                            </BasicCard>
                    case 'meta':
                        return <BasicCard title="Resources">
                            <p>Because the App Management System is under construction, some features may be broken or unavailable.<br/>
                            To track development progress, check out the Trello Roadmap.<br/>To report an issue or make a suggestion, click Contact.</p>
                            <Button color="link" size="lg" onClick={() => window.open('https://trello.com/b/QUgekVh6/app-roadmap', '_blank')}>Trello Roadmap →</Button><br/>
                            <Button color="link" size="lg" onClick={() => window.location.assign('mailto:devgregw@outlook.com')}>Contact →</Button>
                        </BasicCard>
                    default:
                        throw new Error('Unexpected data type')
                }
            case 'tab':
                var elements = this.props.data.elements || []
                var count = elements.length
                var w = count === 1 ? 'Element' : 'Elements'
                var badge = count === 0 ? <Badge color="warning">No Content</Badge> : <Badge color="secondary">{count} {w}</Badge>
                return <Card className="Content-card">
                    <CardBody>
                        <CardTitle>{this.props.data.title} {badge}</CardTitle>
                        <CardSubtitle>/tabs/{this.props.data.id}/</CardSubtitle>
                        <ButtonToolbar className="Content-card-toolbar">
                        <Button style={{marginRight: '0.625rem'}} onClick={() => this.props.push(this.props.data.id)} outline color="primary">Manage</Button>
                        <ButtonGroup>
                            <Button outline color="dark" onClick={() => Utils.openEditor({category: 'tabs', path: `/tabs/${this.props.data.id}/`})}>Edit</Button>
                            <Button outline color="danger" onClick={this
                                    .toggleDeleteModal
                                    .bind(this)}>Delete</Button>
                            <BasicModal isOpen={this.state.deleteModal} toggle={this
                                    .toggleDeleteModal
                                    .bind(this)} header="Delete Confirmation" body={<p>Are you sure you want to delete this tab?<br/><br/>
                                        {this.props.data.title}<br/>/tabs/{this.props.data.id} / </p>}
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
                                        {this.props.data.title}<br/>/events/{this.props.data.id} / </p>}
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
                var path = `/tabs/${this.props.extras.tab.id}/elements/${this.props.index}`
                return <Card className="Content-card">
                <CardBody>
                    <CardTitle className="Cap-first">{this.props.data.type}</CardTitle>
                    <CardSubtitle>{Utils.getElementSummary(this.props.data)}</CardSubtitle>
                    <br/>
                    <CardSubtitle>{path}</CardSubtitle>
                    <ButtonToolbar className="Content-card-toolbar">
                    <ButtonGroup>
                        <Button outline color="dark" onClick={() => Utils.openEditor({category: 'elements_' + this.props.data.type, path: path, parent: this.props.extras.tab.id})}>Edit</Button>
                        <Button outline color="danger" onClick={this
                                .toggleDeleteModal
                                .bind(this)}>Delete</Button>
                        <BasicModal isOpen={this.state.deleteModal} toggle={this
                                .toggleDeleteModal
                                .bind(this)} header="Delete Confirmation" body={<p>Are you sure you want to delete this element?<br/><br/>{path}</p>}
                            primary="Delete" primaryColor="danger" secondary="Cancel" onPrimary={() => {
                                this.setState({ProgressModal: true})
                                Delete.element(this.props.data, this.props.index, this.props.extras.tab).then(() => {
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