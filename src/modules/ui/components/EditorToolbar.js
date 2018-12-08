import React from 'react'
import PropTypes from 'prop-types'
import {Button, ButtonGroup, Navbar, Nav, NavItem, Badge} from 'reactstrap'

export default class MainToolbar extends React.Component {
    static propTypes = {
        onSave: PropTypes.func,
        onCancel: PropTypes.func
    }

    on(func,
        arg
    ) {
        if (func && arg) 
            func(arg)
        else if (func) 
            func()
    }

    shouldComponentUpdate(p, s) {
        return false
    }

    closeEditor() {
        if (window.opener) 
            window.close()
        else 
            window.location.href = '/'
    }

    render() {
        return (
            <Navbar fixed="top" dark color="dark">
                <Nav className="mr-auto">
                    <NavItem active>
                        <ButtonGroup>
                            <Button color="success" onClick={this
                                    .on
                                    .bind(this,
                                        this.props.onSave
                                    )}>Save</Button>
                            <Button color="light" onClick={this
                                    .on
                                    .bind(this,
                                        this.props.onCancel
                                    )}>Cancel</Button>
                        </ButtonGroup>
                    </NavItem>
                    {window.localStorage.getItem('db') === 'dev' ? <NavItem active><Badge style={{marginLeft: '1rem', fontSize: '1rem', top: '50%', transform: 'translateY(-50%)', position: 'relative'}} color="danger">Development Database</Badge></NavItem> : null}
                </Nav>
            </Navbar>
        )
    }
}