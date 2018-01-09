import React from 'react'
import PropTypes from 'prop-types'
import {Modal, ModalBody, Progress} from 'reactstrap'

export default class IndeterminateModal extends React.Component {
    static propType = {
        isOpen: PropTypes.bool,
        progressColor: PropTypes.string,
        progressText: PropTypes.string
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} style={this.props.style}>
                <ModalBody>
                    <Progress animated="animated" color={this.props.progressColor != null
                            ? this.props.progressColor
                            : 'primary'} value={100}>{this.props.progressText}</Progress>
                </ModalBody>
            </Modal>
        )
    }
}