import React from "react";
import { Grid, Button, Icon, Modal, Input, Checkbox } from "semantic-ui-react";

export default class ExportMultipleVideosModal extends React.Component {
  state = {
    normalizeAudio: true,
    voiceVolume: 1,
    downloadZip: true,
  };

  toggleDownloadZip = () => {
    this.setState({ downloadZip: !this.state.downloadZip });
  };

  render() {
    return (
      <Modal open={this.props.open} size="tiny" onClose={this.props.onClose}>
        <Modal.Header>
          <h3>CONFIRM AUDIO SETTINGS</h3>
          <Button
            // basic
            onClick={this.props.onClose}
            className="pull-right"
            color="white"
            circular
            icon="close"
            style={{ position: "relative", top: "-3rem" }}
          />
        </Modal.Header>

        <Modal.Content>
          <Grid style={{ margin: 0 }}>
            <Grid.Row style={{ borderBottom: "1px solid #eee" }}>
              <Grid.Column width={8}>Audio Mastering</Grid.Column>
              <Grid.Column
                width={8}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Checkbox
                  toggle
                  onChange={(e, { checked }) => {
                    this.setState({
                      normalizeAudio: checked,
                    });
                  }}
                  size="huge"
                  checked={this.state.normalizeAudio}
                />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row style={{ borderBottom: "1px solid #eee" }}>
              <Grid.Column width={8}>Voice Volume:</Grid.Column>
              <Grid.Column
                width={8}
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Icon
                  circular
                  name="minus"
                  onClick={() => {
                    if (this.state.voiceVolume - 0.1 < 0) {
                      this.setState({ voiceVolume: 0 });
                    } else {
                      const newVoiceVolume = this.state.voiceVolume - 0.1;
                      this.setState({ voiceVolume: newVoiceVolume });
                    }
                  }}
                  size="small"
                  style={{ cursor: "pointer", backgroundColor: "#d4e0ed" }}
                />
                <Input
                  style={{ width: 70, marginLeft: 10, marginRight: 10 }}
                  type="text"
                  disabled
                  value={parseInt(this.state.voiceVolume * 100) + "%"}
                />
                <Icon
                  circular
                  name="plus"
                  onClick={() => {
                    if (this.state.voiceVolume + 0.1 > 10) {
                      this.setState({ voiceVolume: 10 });
                    } else {
                      const newVoiceVolume = this.state.voiceVolume + 0.1;
                      this.setState({ voiceVolume: newVoiceVolume });
                    }
                  }}
                  size="small"
                  style={{ cursor: "pointer", backgroundColor: "#d4e0ed" }}
                />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={8}>
                <div className="ui checkbox">
                  <input
                    type="checkbox"
                    style={{ marginRight: 5 }}
                    checked={this.state.downloadZip}
                    onChange={this.toggleDownloadZip}
                  />
                  <label>Send download link by email</label>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "1rem",
          }}
        >
          <Button size="large" circular onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button
            size="large"
            circular
            primary
            onClick={() => {
              this.props.onSubmit(
                this.state.voiceVolume,
                this.state.normalizeAudio,
                this.state.downloadZip
              );
            }}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    );
  }
}
