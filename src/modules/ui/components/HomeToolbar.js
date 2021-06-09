import React from 'react'
import PropTypes from 'prop-types'
import BasicModal from './BasicModal.js'
import {
    Button,
    UncontrolledButtonDropdown,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    Collapse
} from 'reactstrap'
import firebase from 'firebase/app'
import 'firebase/auth'
import Utils from '../../classes/Utils'

class DatabaseSelector extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            color: null,
            db: window.localStorage.getItem("db") || "prod",
            prompt: ''
        }
    }

    render() {
        if (this.state.color === null)
            setInterval(() => this.setState({color: !this.state.color}), 750)
        let button
        if (this.state.db === 'prod')
            button = <Button color="success" style={{margin: '1.5px'}} onClick={() => {
                this.setState({prompt: 'dev'})
            }}>Production Database</Button>
        else {
            button = <Button color={this.state.color ? 'danger' : 'light'} style={{margin: '1.5px'}} onClick={() => {
                this.setState({prompt: 'prod'})
            }}>Development Database</Button>
        }
        return <div>
            <BasicModal isOpen={this.state.prompt === 'prod'} toggle={() => {}} header="Switch to Production Database" body="Note: All changes to the app's content will be saved to the production database and therefore visible to ALL USERS.  Are you sure you want to continue?" primary="Yes" primaryColor="danger" secondary="Cancel" onPrimary={() => {window.localStorage.setItem('db', this.state.prompt);window.location.replace('/')}} onSecondary={() => this.setState({prompt: ''})}/>
            <BasicModal isOpen={this.state.prompt === 'dev'} toggle={() => {}} header="Switch to Development Database" body="Note: All changes to the app's content will be saved to the development database and only be visible while running a development or beta build of the app (which is also using the development database).  Are you sure you want to continue?" primary="Yes" primaryColor="danger" secondary="Cancel" onPrimary={() => {window.localStorage.setItem('db', this.state.prompt);window.location.replace('/')}} onSecondary={() => this.setState({prompt: ''})}/>
            {button}
        </div>
    }
}

export default class MainToolbar extends React.Component {
    static propTypes = {
        items: PropTypes.arrayOf(PropTypes.object),
        onNew: PropTypes.func,
        onHome: PropTypes.func,
        onBack: PropTypes.func,
        onRefresh: PropTypes.func
    }

    constructor(props) {
        super(props)
        this.state = {
            newDropdown: false,
            accountDropdown: false,
            signOutModal: false,
            navToggle: false,
            items: [],
            newMenuOpen: false
        }
    }

    on(func,
        arg
    ) {
        if (func && arg) 
            func(arg)
        else if (func) 
            func()
        this.setState({navToggle: false})
    }

    toggleNav() {
        this.setState({
            navToggle: !this.state.navToggle
        })
    }

    toggleSignOut() {
        this.setState({
            signOutModal: !this.state.signOutModal
        })
    }

    newToggle() {
        this.setState({
            newDropdown: !this.state.newDropdown
        })
    }

    accountToggle() {
        this.setState({
            accountDropdown: !this.state.accountDropdown
        })
    }

    render() {
        return (
            <div>
                <Navbar color="dark" dark expand="md">
                    <NavbarBrand href="/"><img src="./favicon.png" alt="" style={{width: '2.5rem', marginRight: '1rem'}} />Authentic City Church</NavbarBrand>
                    <NavbarToggler onClick={this
                            .toggleNav
                            .bind(this)}/>
                    <Collapse isOpen={this.state.navToggle} navbar>
                        <Nav className="ml-auto" navbar>
                            {Utils.isLocalhost() ? <NavItem active>
                                <Button color="warning" style={{
                                        margin: '1.5px'
                                    }} onClick={() => window.location.replace('/debug')}>Run Script</Button>
                            </NavItem> : null}
                            <NavItem active>
                                <DatabaseSelector/>
                            </NavItem>
                            <NavItem active>
                                <Button color="light" style={{
                                        margin: '1.5px'
                                    }} onClick={this
                                        .on
                                        .bind(this,
                                            this.props.onHome
                                        )}>Home</Button>
                            </NavItem>
                            <NavItem active>
                                <Button color="light" style={{
                                        margin: '1.5px'
                                    }} onClick={this
                                        .on
                                        .bind(this,
                                            this.props.onBack
                                        )}>Back</Button>
                            </NavItem>
                            <NavItem active>
                                <Button color="light" style={{
                                        margin: '1.5px'
                                    }} onClick={this
                                        .on
                                        .bind(this,
                                            this.props.onRefresh
                                        )}>Refresh</Button>
                            </NavItem>
                            <NavItem>
                                <Dropdown isOpen={this.state.newMenuOpen} toggle={() => this.setState({newMenuOpen: !this.state.newMenuOpen, items: this.state.newMenuOpen ? [] : (this.props.onItems ? this.props.onItems() : this.props.items)})}>
                                    <DropdownToggle style={{
                                            margin: '1.5px'
                                        }} color="light" caret>New</DropdownToggle>
                                    <DropdownMenu>
                                        {
                                            this.state.items.length ? this.state.items.map(i => <DropdownItem key={i.key} onClick={this
                                                            .on
                                                            .bind(this,
                                                                this.props.onNew,
                                                                i
                                                            )}>{i.name}</DropdownItem>
                                                ) : <DropdownItem disabled>No items</DropdownItem>
                                        }
                                    </DropdownMenu>
                                </Dropdown>
                            </NavItem>
                            <NavItem>
                                <UncontrolledButtonDropdown>
                                    <DropdownToggle style={{
                                            margin: '1.5px'
                                        }} color="light" caret>{
                                            firebase
                                                .auth()
                                                .currentUser
                                                .displayName || firebase
                                                .auth()
                                                .currentUser
                                                .email
                                        }</DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem onClick={() => window.location.href = '/account/meta/changename'}>Change display name</DropdownItem>
                                        <DropdownItem className="text-danger" onClick={this
                                                .toggleSignOut
                                                .bind(this)}>Sign out</DropdownItem>
                                        <DropdownItem divider/>
                                        <DropdownItem header>Version</DropdownItem>
                                        <DropdownItem disabled>{Utils.version}</DropdownItem>
                                        <BasicModal isOpen={this.state.signOutModal} toggle={this
                                                .toggleSignOut
                                                .bind(this)} header="Sign Out" body="Are you sure you want to sign out?" primary="Yes" secondary="Cancel" onPrimary={() => window.location.href = '/account/auth/signout'}/>
                                    </DropdownMenu>
                                </UncontrolledButtonDropdown>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        )
    }
}