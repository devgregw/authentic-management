import React from 'react'
import { Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap'

export default class BasicCard extends React.Component {
    render() {
        return <Card className="Content-card">
                    <CardBody>
                        <CardTitle>{this.props.title}</CardTitle>
                        {this.props.subtitle ? <CardSubtitle>{this.props.subtitle}</CardSubtitle> : null}
                        {this.props.children}
                    </CardBody>
                </Card>
    }
}