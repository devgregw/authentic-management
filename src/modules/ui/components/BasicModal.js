import React from 'react'
import PropTypes from 'prop-types'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'

export default class BasicModal extends React.Component {
    static propTypes = {
        isOpen: PropTypes.bool,
        toggle: PropTypes.func,
        onPrimary: PropTypes.func,
        onSecondary: PropTypes.func,
        header: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
        body: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
        primary: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
        secondary: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
        primaryColor: PropTypes.string,
        secondaryColor: PropTypes.string
    }

    on(func) {
        if (func) 
            func()
        this
            .props
            .toggle()
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
                <ModalHeader toggle={this.props.toggle}>{this.props.header}</ModalHeader>
                <ModalBody>{this.props.body}</ModalBody>
                <ModalFooter>
                    {
                        this.props.secondary
                            ? <Button
                                    // eslint-disable-next-line
                                    color={this.props.secondaryColor != null
                                        ? this.props.secondaryColor
                                        : "secondary"} onClick={this
                                        .on
                                        .bind(this,
                                            this.props.onSecondary
                                        )}>{this.props.secondary}</Button>
                            : ''
                    }
                    {' '}
                    <Button
                        // eslint-disable-next-line
                        color={this.props.primaryColor != null
                            ? this.props.primaryColor
                            : "primary"} onClick={this
                            .on
                            .bind(this,
                                this.props.onPrimary
                            )}>{this.props.primary}</Button>
                </ModalFooter>
            </Modal>
        )
    }
}