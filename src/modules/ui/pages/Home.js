import React from 'react'
import {Breadcrumb, BreadcrumbItem, Badge} from 'reactstrap'
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
            path: new Path((queryString.parse(window.location.search).path || '').split('/').filter(p => !!p) || [])
        }
        this.transformSecondary = this.transformSecondary.bind(this)
    }

    getItemsSecondary(last, type) {
        switch (type) {
            case 'tabs':
            return [
                {
                    category: 'bundles',
                    name: 'Bundle',
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
            default:
                return this.getItemsSecondary(last, type)
        }
    }

    componentDidUpdate(prevProps, prevState) {
            window.history.pushState({}, '', `/?path=${this.state.path.toString()}`)
    }

    transformSecondary(val) {
        var type = this.state.path.get(this.state.path.count() - 2)
        switch (type) {
            case 'tabs':
                var bundleCards = <p>There are no bundles to display.<br/>To create a bundle, click New.</p>
                if (val.bundles) {
                    var sorted = []
                    for (var id in val.bundles)
                        sorted.push(val.bundles[id])
                    sorted.sort((a, b) => a.index - b.index)
                    bundleCards = sorted.map(b => <ContentCard type="bundle" data={b} extras={{tab: val}} refresh={() => this.forceUpdate()}/>)
                }
                return <div>
                    <h2>{val.title} <Badge color="secondary">Bundles</Badge></h2>
                    {bundleCards}
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

    transform(val) {
        var content
        switch (this.state.path.last()) {
            case '':
                content = <ContentCard type="category" data={{
                        type: 'tabs'
                    }} push={p => this.setState({
                        path: this
                            .state
                            .path
                            .append(p)
                    })}/>
                break
            case 'tabs':
                var cards = []
                var items = []
                for (var id in val)
                    items.push(val[id])
                items.sort((a, b) => a.index - b.index)
                items.forEach(i => cards.push(<ContentCard key={i.id} push={p => this.setState({path: this.state.path.append(p)})} type="tab" data={i} refresh={() => this.forceUpdate()}/>))
                content = cards
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
            default:
                return key
        }
    }

    breadcrumbPop(index) {
        var arr = []
        for (var i = 0; i < index; i++) 
            arr.push(this.state.path.get(i))
        this.setState({path: new Path(arr)})
    }

    render() {
        return (
            <div><HomeToolbar items={this.getItems()} onNew={info => Utils.openNewEditor(info)} onHome={() => this.setState({path: new Path()})} onBack={() => this.setState({
                    path: this
                        .state
                        .path
                        .pop()
                })} onRefresh={() => this.forceUpdate()}/>
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