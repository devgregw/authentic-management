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
import IndeterminateModal from './IndeterminateModal.js'
import * as firebase from 'firebase'
import Utils from '../../classes/Utils.js'

export default class ContentCard extends React.Component {
    static propTypes = {
        type: PropTypes.string,
        data: PropTypes.object,
        refresh: PropTypes.func,
        push: PropTypes.func
    }

    constructor(props) {
        super(props)
        this.state = {
            deleteModal: false,
            indeterminateModal: false
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
                        return <Card className="Content-card">
                            <CardBody>
                                <CardTitle>Tabs</CardTitle>
                                <Button onClick={() => this.props.push('tabs')} outline color="primary">Manage</Button>
                            </CardBody>
                        </Card>
                    default:
                        throw new Error('Unexpected data type')
                }
            case 'tab':
                var bundles = this.props.data.bundles || {}
                var count = 0
                // eslint-disable-next-line
                for (var _ in bundles)
                    count++
                var w = count === 1 ? 'Bundle' : 'Bundles'
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
                                //{`Are you sure you want to delete this tab?<br><br>${this.props.data.title}<br>/tabs/${this.props.data.id}`}
                                primary="Delete" primaryColor="danger" secondary="Cancel" onPrimary={() => {
                                    this.setState({indeterminateModal: true})
                                    firebase
                                        .database()
                                        .ref(`/tabs/${this.props.data.id}/`)
                                        .remove()
                                        .then(() => {
                                            this.setState({deleteModal: false, indeterminateModal: false})
                                            this
                                                .props
                                                .refresh()
                                        })
                                }}/>
                            <IndeterminateModal style={{
                                    top: '50%',
                                    transform: 'translateY(-50%)'
                                }} isOpen={this.state.indeterminateModal} progressColor="danger" progressText="Deleting..."/>
                        </ButtonGroup>
                        </ButtonToolbar>
                    </CardBody>
                </Card>
                case 'bundle':
                return <Card className="Content-card">
                <CardBody>
                    <CardTitle>{this.props.data.title || <em>Untitled</em>}</CardTitle>
                    <CardSubtitle>{this.props.data.text || <em>No text</em>}</CardSubtitle>
                    <CardSubtitle>{this.props.data.image || <em>No image</em>}</CardSubtitle>
                    <CardSubtitle>{this.props.data._buttonInfo ? <p>Button enabled</p> : <em>No button</em>}</CardSubtitle>
                    <br/>
                    <CardSubtitle>/tabs/{this.props.extras.tab.id}/bundles/{this.props.data.id}</CardSubtitle>
                    <ButtonToolbar className="Content-card-toolbar">
                    <ButtonGroup>
                        <Button outline color="dark" onClick={() => Utils.openEditor({category: 'bundles', path: `/tabs/${this.props.extras.tab.id}/bundles/${this.props.data.id}`, parent: this.props.extras.tab.id})}>Edit</Button>
                        <Button outline color="danger" onClick={this
                                .toggleDeleteModal
                                .bind(this)}>Delete</Button>
                        <BasicModal isOpen={this.state.deleteModal} toggle={this
                                .toggleDeleteModal
                                .bind(this)} header="Delete Confirmation" body={<p>Are you sure you want to delete this bundle?<br/><br/>/tabs/{this.props.extras.tab.id}/bundles/{this.props.data.id}</p>}
                            primary="Delete" primaryColor="danger" secondary="Cancel" onPrimary={() => {
                                this.setState({indeterminateModal: true})
                                var updated = this.props.extras.tab
                                updated.bundles[this.props.data.id] = null
                                firebase
                                    .database()
                                    .ref(`/tabs/${this.props.extras.tab.id}/`)
                                    .update(updated)
                                    .then(() => {
                                        this.setState({deleteModal: false, indeterminateModal: false})
                                        this
                                            .props
                                            .refresh()
                                    })
                            }}/>
                        <IndeterminateModal style={{
                                top: '50%',
                                transform: 'translateY(-50%)'
                            }} isOpen={this.state.indeterminateModal} progressColor="danger" progressText="Deleting..."/>
                    </ButtonGroup>
                    </ButtonToolbar>
                </CardBody>
            </Card>
            default:
                throw new Error('Unexpected prop type')
        }
    }
}

//  `/tabs/${this.props.extras.tab.id}/bundles/${this.props.extras.tab.bundles.sort((a, b) => a.id.localeCompare(b.id)).map(b => b.id).indexOf(this.props.data.id)}`