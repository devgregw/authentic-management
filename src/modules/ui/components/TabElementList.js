import React from 'react'
import { Badge, Button } from 'reactstrap'
import ContentCard from './ContentCard'

export default class TabElementList extends React.Component {
    render() {
        var cards = <p>There are no bundles to display.<br/>To create a bundle, click New.</p>
                if (val.elements)
                cards = val.elements.map(e => <ContentCard type="element" index={val.elements.indexOf(e)} data={e} extras={{tab: val}} refresh={() => this.forceUpdate()}/>)
                return <div>
                    <h2>{val.title} <Badge color="secondary">Elements</Badge></h2>
                    {Array.isArray(cards) ? <Button color="primary">Reorder</Button> : null}
                    {cards}
                    </div>
    }
}