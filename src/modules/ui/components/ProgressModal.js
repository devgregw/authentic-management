import React from 'react'
import PropTypes from 'prop-types'
import {Modal, ModalBody, Progress} from 'reactstrap'

export default class ProgressModal extends React.Component {
    static propType = {
        isOpen: PropTypes.bool,
        progressColor: PropTypes.string,
        progressText: PropTypes.string,
        value: PropTypes.number
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} style={{
                                    top: '50%',
                                    transform: 'translateY(-50%)'
                                }}>
                <ModalBody>
                    <Progress animated="animated" color={this.props.progressColor || 'primary'} value={this.props.value || 100}>{this.props.progressText}</Progress>
                </ModalBody>
            </Modal>
        )
    }
}