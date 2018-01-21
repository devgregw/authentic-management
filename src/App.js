import React, {Component} from 'react'
import './App.css'
import Authentication from './modules/ui/pages/Authentication.js'
import ChangeDisplayName from './modules/ui/pages/ChangeDisplayName.js'
import Home from './modules/ui/pages/Home.js'
import {Switch, BrowserRouter, Route, Redirect} from 'react-router-dom'
import RequireAuth from './modules/ui/components/RequireAuth.js'
import Editor from './modules/ui/pages/Editor.js'
import Reorder from './modules/ui/pages/Reorder.js'
import StorageViewer from './modules/ui/pages/StorageViewer'

import ImageUploader from './modules/ui/components/ImageUploader'

export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route exact="exact" path="/" render={({match}) => <RequireAuth path={match.path} render={() => <Home/>}/>}/>
                        <Route exact path="/editor" render={({match}) => <RequireAuth path={match.path} render={() => <Editor/>}/>}/>
                        <Route path="/editor/reorder" component={Reorder}/>
                        <Route path="/account/auth/:action" component={Authentication}/>
                        <Route path="/account/meta/changename" render={({match}) => <RequireAuth path={match.path} render={() => <ChangeDisplayName/>}/>}/>
                        <Route exact path="/meta/storage/:name" render={({match}) => <StorageViewer fileName={match.params.name}/>}/>
                        <Route exact path="/demo/:val" render={({match}) => <ImageUploader value={match.params.val}/>}/>
                        <Route exact path="/demo" render={({match}) => <ImageUploader/>}/>
                        <Redirect from="/meta" to="/"/>
                        <Redirect from="/account/meta" to="/"/>
                        <Redirect from="/account/auth" to="/"/>
                        <Redirect from="/account" to="/"/>
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}
