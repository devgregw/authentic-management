import React from 'react'
import {Button, Breadcrumb, BreadcrumbItem, Badge} from 'reactstrap'
import HomeToolbar from '../components/HomeToolbar.js'
import Path from '../../classes/Path.js'
import ContentLoader from '../components/ContentLoader.js'
import ContentCard from '../components/ContentCard.js'
import Utils from '../../classes/Utils.js'
import * as queryString from 'query-string'

export default class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            path: new Path((queryString.parse(window.location.search).path || '').split('/').filter(p => Boolean(p)) || [])
        }
        this.transformSecondary = this.transformSecondary.bind(this)
        this.push = this.push.bind(this)
        this.pop = this.pop.bind(this)
        this.goHome = this.goHome.bind(this)
    }

    getItemsSecondary(last, type) {
        switch (type) {
            case 'tabs':
            return [
                {
                    category: 'elements_image',
                    name: 'Image',
                    parent: last
                },
                {
                    category: 'elements_video',
                    name: 'Video',
                    parent: last
                },
                {
                    category: 'elements_title',
                    name: 'Title Text',
                    parent: last
                },
                {
                    category: 'elements_text',
                    name: 'Basic Text',
                    parent: last
                },
                {
                    category: 'elements_button',
                    name: 'Button',
                    parent: last
                },
                {
                    category: 'elements_separator',
                    name: 'Separator',
                    parent: last
                }
            ]
            default:
            return []
        }
    }

    getItems() {
        var last = this.state.path.last()
        var type = this.state.path.get(this.state.path.count() - 2)
        switch (last) {
            case '':
            return []
            case 'tabs':
                return [
                    {
                        category: 'tabs',
                        name: 'Tab'
                    }
                ]
            case 'events':
                return [
                    {
                        category: 'events',
                        name: 'Event'
                    }
                ]
            default:
                return this.getItemsSecondary(last, type)
        }
    }

    componentDidMount() {
        window.addEventListener('popstate', e => {
            this.pop()
            //e.preventDefault()
        })
    }

    componentWillUpdate(nextProps, nextState) {
        return this.state.path.toString() !== (nextState.path ? nextState.path.toString() : '')
    }

    /*componentDidUpdate(prevProps, prevState) {
        if (this.permit) {
            window.history.pushState({}, '', `/?path=${this.state.path.toString()}`)
            this.permit = false
        }
    }*/

    transformSecondary(val) {
        var type = this.state.path.get(this.state.path.count() - 2)
        switch (type) {
            case 'tabs':
                var cards = <p>This tab does not contain any content.  <Badge color="warning" pill>Empty tabs will be hidden from the app.</Badge><br/>To add an element, click New.</p>
                if (val.elements)
                    cards = val.elements.map(e => <ContentCard key={e.id} type="element" index={val.elements.indexOf(e)} data={e} extras={{tab: val}} refresh={() => this.forceUpdate()}/>)
                return <div>
                    <h2>{val.title} <Badge color="secondary">Elements</Badge> <Button onClick={() => Utils.openReorder(val.id)} color="primary" disabled={!val.elements || (val.elements || []).length <= 1}>Reorder</Button></h2>
                    {cards}
                    </div>
            default:
            return <p style={{
                        color: 'red'
                    }}>Error<br/>Unexpected path: {
                        this
                            .state
                            .path.toString()
                    }</p>
        }
    }

    categories = ['tabs', 'events', 'blog', 'meta']

    transform(val) {
        var content
        switch (this.state.path.last()) {
            case '':
                content = this.categories.map(c => <ContentCard key={c} type="category" data={{
                    type: c
                }} push={this.push}/>)
                break
            case 'tabs':
                var cards = []
                var items = []
                for (var id in val)
                    items.push(val[id])
                items.sort((a, b) => a.index - b.index)
                items.forEach(i => cards.push(<ContentCard key={i.id} push={this.push} type="tab" data={i} refresh={() => this.forceUpdate()}/>))
                content = items.length > 0 ? cards : <p>No tabs have been created.  Click New to add a tab.</p>
                break
            case 'events':
                cards = []
                items = []
                for (id in val)
                    items.push(val[id])
                items.sort((a, b) => a.index - b.index)
                items.forEach(i => cards.push(<ContentCard key={i.id} type="event" data={i} refresh={() => this.forceUpdate()}/>))
                content = items.length > 0 ? cards : <p>No events have been created.  Click New to add an event.</p>
                break
            default:
                content = this.transformSecondary(val)
        }
        return <div style={{
                margin: '0 1rem'
            }}>{content}</div>
    }

    selectTitle(key) {
        switch (key) {
            case 'tabs':
                return 'Tabs'
            case 'events':
                return 'Upcoming Events'
            default:
                return key
        }
    }

    goHome() {
        this.permit = true
        this.setState({path: new Path()})
    }

    push(p) {
        //this.permit = true
        this.setState({path: this.state.path.append(p)})
    }

    pop() {
        this.back = true
        this.setState({path: this.state.path.pop()})
    }

    breadcrumbPop(index) {
        var arr = []
        for (var i = 0; i < index; i++) 
            arr.push(this.state.path.get(i))
        this.setState({path: new Path(arr)})
    }

    render() {
        window.history[!this.back ? 'pushState' : 'replaceState']({}, '', `/?path=${this.state.path.toString()}`)
        this.back = false
        return (
            <div><HomeToolbar items={this.getItems()} onNew={info => Utils.openNewEditor(info)} onHome={this.goHome} onBack={this.pop} onRefresh={() => this.forceUpdate()}/>
                <Breadcrumb tag="nav" style={{
                        margin: '1rem'
                    }}>
                    {
                        ["Home"]
                            .concat(this.state.path.pieces)
                            .map((val,
                                i,
                                arr
                            ) => <BreadcrumbItem key={val} onClick={i < arr.length - 1
                                    ? this
                                        .breadcrumbPop
                                        .bind(this,
                                            i
                                        )
                                    : null} style={{
                                    cursor: i === arr.length - 1
                                        ? 'default'
                                        : 'pointer'
                                }} tag={i === arr.length - 1
                                    ? 'span'
                                    : 'a'} href="#" active={i === arr.length - 1}>{this.selectTitle(val)}</BreadcrumbItem>)
                    }
                </Breadcrumb>
                <ContentLoader path={this.state.path} transformer={this
                        .transform
                        .bind(this)}/>
            </div>
        )
    }
}