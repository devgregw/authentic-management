import React from 'react'
import PropTypes from 'prop-types'
import * as firebase from 'firebase'
import {Progress} from 'reactstrap'

export default class ContentLoader extends React.Component {
    static propTypes = {
        path: PropTypes.object,
        transformer: PropTypes.func
    }

    constructor(props) {
        super(props)
        this.state = {
            content: null
        }
    }

    shouldComponentUpdate(p,
        s
    ) {
        return Boolean(s.content) !== Boolean(this.state.content)
    }

    componentWillReceiveProps(next) {
        this.setState({loaded: false, content: null})
    }

    render() {
        firebase
            .database()
            .ref(this.props.path.toString())
            .once('value')
            .then(snapshot => {
                var c = null
                try {
                    c = this
                    .props
                    .transformer(snapshot.val())
                } catch (ex) {
                    c = <p style={{color: 'red'}}>{ex.toString()}</p>
                }
                this.setState({
                    content: c
                })
            })
        return this.state.content || <Progress style={{
                        margin: '0 1rem'
                    }} animated color="primary" value={100}>Loading...</Progress>
    }
}