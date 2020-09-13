import React from "react";
import { Button, Modal } from "semantic-ui-react";
import { SketchPicker } from "react-color";

class ColorPickerModal extends React.Component {
  render() {
    const { open, onClose, presetColors, color } = this.props;
    return (
      <Modal size="mini" open={open} onClose={onClose}>
        <Modal.Header>Select Color</Modal.Header>
        <Modal.Content style={{ display: "flex", justifyContent: "center" }}>
          <SketchPicker
            color={color}
            presetColors={presetColors}
            onChangeComplete={(color) => {
              this.props.onChangeComplete(color);
            }}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={onClose}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ColorPickerModal;
