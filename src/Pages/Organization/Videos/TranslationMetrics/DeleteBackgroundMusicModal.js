import React from 'react';
import { Modal, Button } from 'semantic-ui-react';

export default class DeleteBackgroundMusicModal extends React.Component {
    render() {
        const { onClose, onConfirm, open } = this.props;

        return (
            <Modal open={open} size="tiny">
                <Modal.Header>
                    Delete Background Music
                </Modal.Header>
                <Modal.Content>
                    Are you sure you want to delete the background music? 
                    <p>
                        <strong><small>this will take effect for only new exports</small></strong>
                    </p>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} primary>
                        Yes
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}