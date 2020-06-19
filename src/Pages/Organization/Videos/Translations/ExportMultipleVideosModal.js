import React from 'react';
import { Modal, Button } from 'semantic-ui-react';

export default class ExportMultipleVideosModal extends React.Component {

    render() {
        return (
            <Modal open={this.props.open} size="tiny" onClose={this.props.onClose}>
                <Modal.Header>
                    Export Selected Videos
            </Modal.Header>
                <Modal.Content>
                    Are you sure you want to export the selected videos?
            </Modal.Content>
                <Modal.Actions>
                    <Button
                        onClick={this.props.onClose}
                    >
                        Cancel
                </Button>
                    <Button
                        color="blue"
                        onClick={this.props.onSubmit}
                    >
                        Yes
                </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}