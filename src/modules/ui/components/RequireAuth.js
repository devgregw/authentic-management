import React from 'react'
import * as firebase from 'firebase'
import PropTypes from 'prop-types'
import {Progress, Spinner} from 'reactstrap'
import {Redirect} from 'react-router-dom'

export default class RequireAuth extends React.Component {
    static propTypes = {
        path: PropTypes.string,
        render: PropTypes.func
    }

    constructor(props) {
        super(props)
        this.state = {
            user: null,
            updated: false
        }
        firebase
            .auth()
            .onAuthStateChanged(user => {
                this.setState({user: user, updated: true})
            })
    }

    render() {
        if (!this.state.user && !this.state.updated) {
            return (
                <div className="Center-progress">
                    <Spinner style={{ width: '3rem', height: '3rem' }} />
                </div>
            )
        } else if (this.state.updated) {
            if (!this.state.user) 
                return (<Redirect to={`/account/auth/signin?to=${encodeURIComponent(this.props.path + window.location.search)}`}/>)
            else 
                return this
                    .props
                    .render()
            } else 
            return null
    }
}