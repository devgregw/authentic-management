import * as firebase from 'firebase'

export default class Delete {
    static tab(data) {
        var promises = [
            firebase
                .database()
                .ref(`/tabs/${data.id}/`)
                .remove(),
            firebase
                .storage()
                .ref(data.header)
                .delete()
        ]
        if (data.elements) 
            data
                .elements
                .filter(e => e.type === 'image')
                .forEach(e => promises.push(firebase.storage().ref(e.image).delete()))
        return Promise.all(promises)
    }

    static element(data, index, parent) {
        var updated = parent
        updated.elements[index] = null
        var promises = [
            firebase
                .database()
                .ref(`/tabs/${updated.id}/`)
                .update(updated)
        ]
        if (data.type === 'image') 
            promises.push(firebase.storage().ref(data.image).delete())
        return Promise.all(promises)
    }
}