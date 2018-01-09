import React, {Component} from 'react'
import './App.css'
import Authentication from './modules/ui/pages/Authentication.js'
import ChangeDisplayName from './modules/ui/pages/ChangeDisplayName.js'
import Home from './modules/ui/pages/Home.js'
import {Switch, BrowserRouter, Route, Redirect} from 'react-router-dom'
import RequireAuth from './modules/ui/components/RequireAuth.js'
import Editor from './modules/ui/pages/Editor.js'

export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route exact="exact" path="/" render={({match}) => <RequireAuth path={match.path} render={() => <Home/>}/>}/>
                        <Route path="/editor" render={({match}) => <RequireAuth path={match.path} render={() => <Editor/>}/>}/>
                        <Route path="/account/auth/:action" component={Authentication}/>
                        <Route path="/account/meta/changename" render={({match}) => <RequireAuth path={match.path} render={() => <ChangeDisplayName/>}/>}/>
                        <Redirect from="/account/meta" to="/"/>
                        <Redirect from="/account/auth" to="/"/>
                        <Redirect from="/account" to="/"/>
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}
