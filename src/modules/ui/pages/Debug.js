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
            Promise
                .all([
                    firebase
                        .database()
                        .ref('/tabs/3LNAQMJYKF')
                        .once('value')
                        .then(snapshot => {
                            let proc = (p,
                                i
                            ) => {
                                console.log(`PROCESSING: ${p}/${i}`)
                                if (p === 'YouTube') 
                                    return window
                                        .fetch(`https://www.googleapis.com/youtube/v3/search?q=${i}&maxResults=1&part=snippet&type=video&key=AIzaSyB4w3GIY9AUi6cApXAkB76vlG6K6J4d8XE`)
                                        .then(r => r.json())
                                        .then(json => {
                                            if (!json || json.pageInfo.totalResults === 0) 
                                                return null
                                            else if (json.items[0].id.videoId !== i) 
                                                return null
                                            else 
                                                return {
                                                    title: json
                                                        .items[0]
                                                        .snippet
                                                        .title,
                                                    thumbnail: json.items[0].snippet.thumbnails.high.url,
                                                    provider: 'YouTube',
                                                    id: json
                                                        .items[0]
                                                        .id
                                                        .videoId
                                                }
                                        })
                                else 
                                    return window
                                        .fetch(`https://api.vimeo.com/videos/${i}?access_token=e2b6fedeebaa9768c909e81e2565e8a1`)
                                        .then(r => r.json())
                                        .then(json => {
                                            if (!json || json.error) 
                                                return null
                                            else 
                                                return {
                                                    title: json.name,
                                                    thumbnail: json
                                                        .pictures
                                                        .sizes[5]
                                                        .link,
                                                    provider: 'Vimeo',
                                                    id: json
                                                        .uri
                                                        .replace('/videos/',
                                                            ''
                                                        )
                                                }
                                            })
                                    }
                            let tab = snapshot.val()
                            tab.elements.forEach((element, i) => {
                                // eslint-disable-next-line
                                if (element.type == 'video')
                                additional.push(proc(element.provider, element.videoId).then(info => firebase.database().ref('/tabs/3LNAQMJYKF/elements/' +
                                i).set({
                                    id: element.id,
                                    parent: element.parent,
                                    type: 'video',
                                    videoInfo: info
                                })))
                            })
                        })
                ])
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
        if (window.confirm("Run script?")) {
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