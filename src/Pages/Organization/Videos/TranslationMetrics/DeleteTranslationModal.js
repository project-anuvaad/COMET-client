import React from 'react';
import { Modal, Button } from 'semantic-ui-react';

export default class DeleteTranslationModal extends React.Component {

    render() {
        return (
            <Modal open={this.props.open} size="tiny" onClose={this.props.onClose}>
                <Modal.Header>
                    Delete Translation
            </Modal.Header>
                <Modal.Content>
                    Are you sure you want to delete this translation?
            </Modal.Content>
                <Modal.Actions>
                    <Button
                        onClick={this.props.onClose}
                    >
                        Cancel
                </Button>
                    <Button
                        color="red"
                        onClick={this.props.onConfirm}
                    >
                        Yes
                </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}