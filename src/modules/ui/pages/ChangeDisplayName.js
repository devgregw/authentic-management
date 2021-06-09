import React from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import {
    Button,
    ButtonGroup,
    Form,
    FormGroup,
    Input,
    Card,
    CardBody,
    CardTitle
} from 'reactstrap'
import BasicModal from '../components/BasicModal.js'

export default class ChangeDisplayName extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: false
        }
    }

    setFieldsDisabled(val) {
        var n = document.getElementById('name'),
            b = document.getElementById('button'),
            b2 = document.getElementById('button2')
        n.disabled = val
        b2.disabled = val
        b.disabled = val
        b.innerText = val
            ? 'Saving...'
            : 'Save'
    }

    changeName() {
        var n = document.getElementById('name')
        this.setFieldsDisabled(true)
        firebase
            .auth()
            .currentUser
            .updateProfile({displayName: n.value})
            .then(() => window.location.replace('/'),
                reason => this.setState({error: reason})
            )
    }

    render() {
        return (
            <div style={{
                    background: '#eee',
                    width: '100%',
                    height: '100%',
                    position: 'absolute'
                }}>
                <Card className="Auth-card">
                    <CardBody>
                        <CardTitle>Change Display Name</CardTitle>
                        <Form style={{
                                marginTop: '5px'
                            }}>
                            <FormGroup>
                                <Input type="text" id="name" defaultValue={firebase
                                        .auth()
                                        .currentUser
                                        .displayName || ''} placeholder="display name"/>
                            </FormGroup>
                        </Form>
                        <ButtonGroup>
                            <Button id="button2" color="secondary" onClick={() => window.location.replace('/')}>Back</Button>
                            <Button id="button" color="primary" onClick={this
                                    .changeName
                                    .bind(this)}>Save</Button>
                        </ButtonGroup>
                    </CardBody>
                </Card>
                <BasicModal isOpen={this.state.error
                        ? true
                        : false} toggle={() => this.setState({error: false})} header="Error" body={this
                        .state
                        .error
                        .toString()} primary="Dismiss" onPrimary={() => this.setState({error: false})}/>
            </div>
        )
    }
}