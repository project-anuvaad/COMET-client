import React from "react";
import { Button, Modal, Checkbox, Grid } from "semantic-ui-react";

export default class MoveVideoModal extends React.Component {
  state = {
    openedMainFolder: null,
    selectedFolderId: null,
    selecctecFolderName: null,
  };

  onCheckChange = (checked, id, name) => {
    if (checked)
      this.setState({ selectedFolderId: id, selectedFolderName: name });
    else this.setState({ selectedFolderId: null, selectedFolderName: null });
  };

  renderSubFolders() {
    if (this.props.openedFolder._id === this.state.openedMainFolder._id) {
      return this.props.openedFolder.subfolders.map((f) => (
        <Grid.Row key={f._id}>
          <Grid.Column>
            <div
              style={{ display: "flex", alignItems: "center", marginLeft: 40 }}
            >
              <Checkbox
                checked={this.state.selectedFolderId === f._id}
                onChange={(e, { checked }) => {
                  this.props.onOpenFolder(f._id);
                  this.onCheckChange(checked, f._id, f.name);
                }}
              />
              <span
                style={{
                  marginLeft: 10,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => {
                  this.props.onOpenFolder(f._id);
                  this.onCheckChange(true, f._id, f.name);
                }}
              >
                {f.name}
              </span>
            </div>
          </Grid.Column>
        </Grid.Row>
      ));
    } else if (
      this.props.openedFolder.parent &&
      this.props.openedFolder.parent._id === this.state.openedMainFolder._id
    ) {
      return [
        <Grid.Row>
          <Grid.Column>
            <div
              style={{ display: "flex", alignItems: "center", marginLeft: 40 }}
            >
              <Checkbox
                checked={
                  this.state.selectedFolderId === this.props.openedFolder._id
                }
                onChange={(e, { checked }) => {
                  this.props.onOpenFolder(this.props.openedFolder._id);
                  this.onCheckChange(
                    checked,
                    this.props.openedFolder._id,
                    this.props.openedFolder.name
                  );
                }}
              />
              <span
                style={{
                  marginLeft: 10,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => {
                  this.props.onOpenFolder(this.props.openedFolder._id);
                  this.onCheckChange(
                    true,
                    this.props.openedFolder._id,
                    this.props.openedFolder.name
                  );
                }}
              >
                {this.props.openedFolder.name}
              </span>
            </div>
          </Grid.Column>
        </Grid.Row>,
        this.props.openedFolder.subfolders.map((f) => (
          <Grid.Row key={f._id}>
            <Grid.Column>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: 60,
                }}
              >
                <Checkbox
                  checked={this.state.selectedFolderId === f._id}
                  onChange={(e, { checked }) => {
                    this.props.onOpenFolder(f._id);
                    this.onCheckChange(checked, f._id, f.name);
                  }}
                />
                <span
                  style={{
                    marginLeft: 10,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => {
                    this.props.onOpenFolder(f._id);
                    this.onCheckChange(true, f._id, f.name);
                  }}
                >
                  {f.name}
                </span>
              </div>
            </Grid.Column>
          </Grid.Row>
        )),
      ];
    } else if (
      this.props.openedFolder.parent &&
      this.props.openedFolder.parent._id !== this.state.openedMainFolder._id
    ) {
      return [
        <Grid.Row>
          <Grid.Column>
            <div
              style={{ display: "flex", alignItems: "center", marginLeft: 40 }}
            >
              <Checkbox
                checked={
                  this.state.selectedFolderId ===
                  this.props.openedFolder.parent._id
                }
                onChange={(e, { checked }) => {
                  this.props.onOpenFolder(this.props.openedFolder.parent._id);
                  this.onCheckChange(
                    checked,
                    this.props.openedFolder.parent._id,
                    this.props.openedFolder.parent.name
                  );
                }}
              />
              <span
                style={{
                  marginLeft: 10,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => {
                  this.props.onOpenFolder(this.props.openedFolder.parent._id);
                  this.onCheckChange(
                    true,
                    this.props.openedFolder.parent._id,
                    this.props.openedFolder.parent.name
                  );
                }}
              >
                {this.props.openedFolder.parent.name}
              </span>
            </div>
          </Grid.Column>
        </Grid.Row>,
        <Grid.Row>
          <Grid.Column>
            <div
              style={{ display: "flex", alignItems: "center", marginLeft: 60 }}
            >
              <Checkbox
                checked={
                  this.state.selectedFolderId === this.props.openedFolder._id
                }
                onChange={(e, { checked }) => {
                  this.props.onOpenFolder(this.props.openedFolder._id);
                  this.onCheckChange(
                    checked,
                    this.props.openedFolder._id,
                    this.props.openedFolder.name
                  );
                }}
              />
              <span
                style={{
                  marginLeft: 10,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => {
                  this.props.onOpenFolder(this.props.openedFolder._id);
                  this.onCheckChange(
                    true,
                    this.props.openedFolder._id,
                    this.props.openedFolder.name
                  );
                }}
              >
                {this.props.openedFolder.name}
              </span>
            </div>
          </Grid.Column>
        </Grid.Row>,
        this.props.openedFolder.subfolders.map((f) => (
          <Grid.Row key={f._id}>
            <Grid.Column>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: 80,
                }}
              >
                <Checkbox
                  checked={this.state.selectedFolderId === f._id}
                  onChange={(e, { checked }) => {
                    this.props.onOpenFolder(f._id);
                    this.onCheckChange(checked, f._id, f.name);
                  }}
                />
                <span
                  style={{
                    marginLeft: 10,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => {
                    this.props.onOpenFolder(f._id);
                    this.onCheckChange(true, f._id, f.name);
                  }}
                >
                  {f.name}
                </span>
              </div>
            </Grid.Column>
          </Grid.Row>
        )),
      ];
    }
  }

  render() {
    return (
      <Modal open={this.props.open} onClose={this.props.onClose} size="tiny">
        <Modal.Header>
          <h3>Move Video To</h3>
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
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    checked={!this.state.selectedFolderId}
                    onChange={(e, { checked }) => {
                      this.setState({ openedMainFolder: null });
                      this.props.onOpenHomePage();
                      this.onCheckChange(checked, null, null);
                    }}
                  />
                  <span
                    style={{
                      marginLeft: 10,
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() => {
                      this.setState({ openedMainFolder: null });
                      this.props.onOpenHomePage();
                      this.onCheckChange(true, null, null);
                    }}
                  >
                    Homepage
                  </span>
                </div>
              </Grid.Column>
            </Grid.Row>

            {this.props.mainFolders.map((f) => (
              <React.Fragment>
                <Grid.Row key={f._id}>
                  <Grid.Column>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: 20,
                      }}
                    >
                      <Checkbox
                        checked={this.state.selectedFolderId === f._id}
                        onChange={(e, { checked }) => {
                          this.setState({ openedMainFolder: f });
                          this.props.onOpenFolder(f._id);
                          this.onCheckChange(checked, f._id, f.name);
                        }}
                      />
                      <span
                        style={{
                          marginLeft: 10,
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={() => {
                          this.setState({ openedMainFolder: f });
                          this.props.onOpenFolder(f._id);
                          this.onCheckChange(true, f._id, f.name);
                        }}
                      >
                        {f.name}
                      </span>
                    </div>
                  </Grid.Column>
                </Grid.Row>

                {this.state.openedMainFolder &&
                this.state.openedMainFolder._id === f._id &&
                this.props.openedFolder
                  ? this.renderSubFolders()
                  : null}
              </React.Fragment>
            ))}
          </Grid>

          <Grid>
            <Grid.Row>
              <Grid.Column>
                {this.props.moveVideoCurrentPageNumber !==
                  this.props.moveVideoTotalPagesCount && (
                  <div
                    style={{
                      margin: 20,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      fluid
                      primary
                      size="mini"
                      disabled={this.props.moveVideoLoading}
                      loading={this.props.moveVideoLoading}
                      onClick={(e) => {
                        e.stopPropagation();
                        this.props.onLoadMoreFolders();
                      }}
                    >
                      Load More...
                    </Button>
                  </div>
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>

        <Modal.Actions>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button size="large" circular onClick={this.props.onClose}>
              Cancel
            </Button>
            <Button
              size="large"
              circular
              primary
              onClick={() =>
                this.props.onMoveVideo(
                  this.state.selectedFolderId,
                  this.state.selectedFolderName
                )
              }
            >
              Move
            </Button>
          </div>
        </Modal.Actions>
      </Modal>
    );
  }
}
