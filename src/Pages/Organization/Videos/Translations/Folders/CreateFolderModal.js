import React from "react";
import { Grid, Button, Modal, Input } from "semantic-ui-react";

export default class CreateFolderModal extends React.Component {
  state = { name: "" };

  componentDidMount() {
    if (this.props.name) {
      this.setState({ name: this.props.name });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.name) {
      this.setState({ name: nextProps.name });
    }
  }

  render() {
    return (
      <Modal open={this.props.open} onClose={this.props.onClose} size="tiny">
        <Modal.Header>
          <h3>{this.props.title}</h3>
          <Button
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
            <Grid.Row>
              <Grid.Column width={16}>
                <label style={{ display: "block", marginBottom: 10 }}>
                  Folder Name:
                </label>
                <Input
                  fluid
                  placeholder="Folder name..."
                  value={this.state.name}
                  onChange={(e, { value }) => {
                    this.setState({ name: value });
                  }}
                />
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
              this.props.onSubmit(this.state.name);
              this.setState({ name: "" });
            }}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    );
  }
}
