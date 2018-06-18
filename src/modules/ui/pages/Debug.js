import React from 'react'
import ProgressModal from '../components/ProgressModal'
import * as firebase from 'firebase'
import Utils from '../../classes/Utils'

export default class Debug extends React.Component {
    run() {
        var additional = []
        return new Promise((resolve, reject) => {
            Promise.all([
                firebase.database().ref('/tabs').once('value').then(tabsSnapshot => {
                    let tabsDb = tabsSnapshot.val()
                    for (var tabId in tabsDb) {
                        var tab = tabsDb[tabId]
                        let elements = tab.elements
                        let headerName = tab.header
                        tab.header = {name: headerName, width: 100, height: 100}
                        elements.forEach(element => {
                            if (element.type === "image")
                                element.image = {name: element.image, width: 100, height: 100}
                        })
                        tab.elements = elements
                        additional.push(firebase.database().ref(`/tabs/${tab.id}`).set(tab))
                    }
                }),
                firebase.database().ref('/events').once('value').then(eventsSnapshot => {
                    let eventsDb = eventsSnapshot.val()
                    for (var eventId in eventsDb) {
                        var event = eventsDb[eventId]
                        event.header = {name: event.header, width: 100, height: 100}
                        additional.push(firebase.database().ref(`/events/${eventId}`).set(event))
                    }
                }),
                firebase.database().ref('/appearance/events').once('value').then(appSnapshot => {
                    let eapp = appSnapshot.val()
                    eapp.header = {name: eapp.header, width: 100, height: 100}
                    additional.push(firebase.database().ref(`/appearance/events`).set(eapp))
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