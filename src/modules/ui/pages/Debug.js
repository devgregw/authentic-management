import React from 'react'
import ProgressModal from '../components/ProgressModal'
import * as firebase from 'firebase'
import Utils from '../../classes/Utils'

export default class Debug extends React.Component {
    run() {
        var additional = []
        return new Promise((resolve, reject) => {
            Promise.all([
                firebase.database().ref('/tabs/ME6HV83IM0').once('value').then(snapshot => {
                    let tab = snapshot.val()
                    var newElements = []
                    for (var i in tab.elements)
                        newElements.push(tab.elements[i])
                        alert(JSON.stringify(tab.elements))
                        alert(JSON.stringify(newElements))
                    tab.elements = newElements
                    additional.push(firebase.database().ref('/tabs/ME6HV83IM0').update(tab))
                })
            ]).then(() => Promise.all(additional).then(() => resolve()))
        })
    }

    render() {
        if (!Utils.isLocalhost()) {
            alert("Unavailable")
            window.location.replace('/')
            return null
        }
        if (window.confirm("Run script?")) {
            this.run().then(() => window.location.replace('/'))
            return <ProgressModal progressText="Working..." progressColor="warning" isOpen/>
        } else {
            window.location.replace('/')
            return null
        }
    }
}