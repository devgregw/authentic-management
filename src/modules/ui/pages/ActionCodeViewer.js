import React from 'react'
import ActionInput from '../components/ActionInput'
import {Button} from 'reactstrap'
import BasicModal from '../components/BasicModal'

class GetData extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null
        }
    }

    render() {
        return <div>
            <BasicModal isOpen={Boolean(this.state.data)} toggle={() => this.setState({data: null})} onPrimary={() => this.setState({data: null})} header="Action Data" body={this.state.data} primary="Dismiss" primaryColor="primary"/>
            <Button color="primary" size="lg" onClick={() => {
                var v = this.props.this.ai.validate()
                if (v.invalid)
                    window.alert('Error: Invalid action')
                else {
                    let action = this.props.this.ai.getValue()
                    this.setState({data: <div>
                        {Object.getOwnPropertyNames(action).map(k => <p><code>{k}</code>: <code>{action[k]}</code></p>)}
                    </div>})
                }
            }}>Get data</Button>
        </div>
    }
}

export default class ActionCodeViewer extends React.Component {
    render() {
        return <div style={{margin: '1rem'}}>
            <ActionInput ref={r => this.ai = r}/>
            <hr/>
            <GetData this={this}/>
        </div>
    }
}