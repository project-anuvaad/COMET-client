import React from "react";
import { Button, Modal } from "semantic-ui-react";

class DeleteShapeModal extends React.Component {
  render() {
    const { open, onClose, onConfirm } = this.props;
    return (
      <Modal size="mini" open={open} onClose={onClose}>
        <Modal.Header>Delete Box</Modal.Header>
        <Modal.Content style={{ display: "flex", justifyContent: "center" }}>
          Are you sure tyou want to delete the box?
        </Modal.Content>
        <Modal.Actions>
          <Button primary size="mini" onClick={onConfirm}>
            Confirm
          </Button>
          <Button size="mini" onClick={onClose}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default DeleteShapeModal;
