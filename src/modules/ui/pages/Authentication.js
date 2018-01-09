import React from 'react'
import {
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Card,
    CardBody,
    CardImg,
    CardTitle,
    CardSubtitle,
    Progress,
    Alert
} from 'reactstrap'
import * as firebase from 'firebase'
import * as queryString from 'query-string'

export default class Authentication extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: false,
            postAlert: (queryString.parse(window.location.search).post || '').toString() === '1'
        }
    }

    setFieldsDisabled(val) {
        var e = document.getElementById('email'),
            p = document.getElementById('password'),
            r = document.getElementById('remember'),
            b = document.getElementById('button')
        e.disabled = val
        p.disabled = val
        r.disabled = val
        b.disabled = val
        b.innerText = val
            ? 'Signing in...'
            : 'Sign in'
    }

    signIn() {
        var e = document.getElementById('email'),
            p = document.getElementById('password'),
            r = document.getElementById('remember')
        this.setFieldsDisabled(true)

        firebase
            .auth()
            .setPersistence(firebase.auth.Auth.Persistence[
                r.checked
                    ? 'LOCAL'
                    : 'SESSION'
            ])
            .then(() => {
                firebase
                    .auth()
                    .signInWithEmailAndPassword(e.value,
                        p.value
                    )
                    .then(() => {
                        window
                            .location
                            .replace(decodeURIComponent(queryString.parse(window.location.search).to || '/'))
                    },
                        reason => {
                        this.setState({error: reason})
                        this.setFieldsDisabled(false)
                        p.value = ''
                    }
                    )
            },
                reason => {
                this.setState({error: reason})
                this.setFieldsDisabled(false)
                p.value = ''
            }
            )
    }

    render() {
        if (this.props.match.params.action === 'signin') {
            var pwd = <Input innerRef={x => {
                    (x || document.getElementById('password')).onkeypress = e => {
                        if (e.keyCode === 13) {
                            this
                                .signIn
                                .bind(this)()
                            return false
                        }
                        return true
                    }
                }} type="password" id="password" placeholder="password"/>
            /*pwd.onkeypress = e => {
                if (e.keyCode === 13) {
                    this.signIn.bind(this)()
                    return false
                }
                return true
            }*/
            return (
                <div style={{
                        background: '#eee',
                        width: '100%',
                        height: '100%',
                        position: 'absolute'
                    }}>
                    <Card className="Auth-card">
                        <CardImg top="top" width="100%" src="https://authentic-city-church.firebaseapp.com/full.png" alt="Authentic City Church app management system"/>
                        <CardBody>
                            <CardTitle>Sign In</CardTitle>
                            <CardSubtitle>Authentic City Church App Management System</CardSubtitle>
                            <Form style={{
                                    marginTop: '5px'
                                }}>
                                <Alert color="success" isOpen={this.state.postAlert} toggle={() => this.setState({postAlert: false})}>
                                    You've been signed out.
                                </Alert>
                                <Alert color="danger" isOpen={!!this.state.error}>
                                    {this.state.error.toString()}
                                </Alert>
                                <FormGroup>
                                    <Input type="email" id="email" placeholder="email address"/>
                                </FormGroup>
                                <FormGroup>
                                    {pwd}
                                </FormGroup>
                                <FormGroup check="check">
                                    <Label check="check">
                                        <Input id="remember" type="checkbox"/>{' '}
                                        Remember me
                                    </Label>
                                </FormGroup>
                            </Form>
                            <Button id="button" color="primary" onClick={this
                                    .signIn
                                    .bind(this)}>Sign in</Button>
                        </CardBody>
                    </Card>
                </div>
            )
        } else if (this.props.match.params.action === 'signout') {
            firebase
                .auth()
                .signOut()
                .then(() => window.location.replace('/account/auth/signin?post=1&to=/'))
            return (
                <div className="Center-progress">
                    <Progress animated="animated" color="danger" value={100}>Signing out...</Progress>
                </div>
            )
        } else {
            return <p>Bad request</p>
        }
    }
}