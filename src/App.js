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
import ActionCodeViewer from './modules/ui/pages/ActionCodeViewer'

import Debug from './modules/ui/pages/Debug'

import DateTime from './modules/ui/components/DateTime'
import * as moment from 'moment'
import {Button} from 'reactstrap'

class Demo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: null,
            id: Math
            .random()
            .toString(36)
            .substr(2, 10)
            .toUpperCase()
        }
    }

    render() {
        return <div>
            <DateTime onChange={v => this.setState({value: v})}/>
            <p>{moment.isMoment(this.state.value) ? moment(this.state.value).toISOString() : "INVALID"}</p>
            <p>{moment.isMoment(this.state.value) ? moment(this.state.value).valueOf() : "INVALID"}</p>
            <p>{this.state.id}</p>
            <Button color="dark" onClick={() => this.setState({id: Math
            .random()
            .toString(36)
            .substr(2, 10)
            .toUpperCase()})}>Regen</Button>
        </div>
    }
}

export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route exact path="/demo" render={({match}) => <Demo/>}/>
                        <Route exact path="/debug" render={({match}) =>  <RequireAuth path={match.path} render={() => <Debug/>}/>}/>
                        <Route exact path="/" render={({match}) => <RequireAuth path={match.path} render={() => <Home/>}/>}/>
                        <Route exact path="/editor" render={({match}) => <RequireAuth path={match.path} render={() => <Editor/>}/>}/>
                        <Route path="/editor/reorder" component={Reorder}/>
                        <Route path="/account/auth/:action" component={Authentication}/>
                        <Route path="/account/meta/changename" render={({match}) => <RequireAuth path={match.path} render={() => <ChangeDisplayName/>}/>}/>
                        <Route exact path="/meta/storage/:name" render={({match}) => <StorageViewer fileName={match.params.name}/>}/>
                        <Route exact path="/meta/action" component={ActionCodeViewer}/>
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
