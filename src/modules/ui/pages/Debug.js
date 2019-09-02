import React from 'react'
import ProgressModal from '../components/ProgressModal'
import * as firebase from 'firebase'
import Utils from '../../classes/Utils'

export default class Debug extends React.Component {
    run() {
        var additional = []
        return new Promise((resolve,
            reject
        ) => {
            let ids = ["1FUDXDSTKE", "5U0JPPDIPQ", "8OUVYX4DSK", "EJ4L5A34PK", "GMF632SFDS", "I7T2EPJ37B", "JNVJTB8ZP8", "NA8SKQLHIK", "PIIHMVHH1V", "SKJL92GXDY", "VX7MV7A26X", "VXEFBW4I6C"]
            Promise
                .all(ids.map(id => firebase.database().ref().child(`/tabs/${id}`).update({specialType: 'watchPlaylist'})))
                .then(() => Promise.all(additional).then(() => resolve()))
        })
    }

    render() {
        if (!Utils.isLocalhost()) {
            alert("Unavailable")
            window
                .location
                .replace('/')
            return null
        }
        if (window.confirm("Convert to watchPlaylist")) {
            this
                .run()
                .then(() => window.location.replace('/'))
            return <ProgressModal progressText="Working..." progressColor="warning" isOpen="isOpen"/>
        } else {
            window
                .location
                .replace('/')
            return null
        }
    }
}