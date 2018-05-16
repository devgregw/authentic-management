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
import Sender from './modules/ui/pages/Sender'

export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route exact path="/" render={({match}) => <RequireAuth path={match.path} render={() => <Home/>}/>}/>
                        <Route exact path="/editor" render={({match}) => <RequireAuth path={match.path} render={() => <Editor/>}/>}/>
                        <Route exact path="/send" render={({match}) => <RequireAuth path={match.path} render={() => <Sender/>}/>}/>
                        <Route path="/editor/reorder" component={Reorder}/>
                        <Route path="/account/auth/:action" component={Authentication}/>
                        <Route path="/account/meta/changename" render={({match}) => <RequireAuth path={match.path} render={() => <ChangeDisplayName/>}/>}/>
                        <Route exact path="/meta/storage/:name" render={({match}) => <StorageViewer fileName={match.params.name}/>}/>
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
