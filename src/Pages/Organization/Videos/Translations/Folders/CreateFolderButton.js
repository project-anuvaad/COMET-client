import React from "react";
import { Button, Icon } from "semantic-ui-react";

export default class CreateFolderButton extends React.Component {
  render() {
    return (
      <span style={{ display: "flex" }}>
        {this.props.openedFolder && (
          <Button
            color="green"
            style={{ display: "block", margin: "auto" }}
            onClick={this.props.onChangeNameClick}
          >
            <Icon name="edit" />
            Change Folder Name
          </Button>
        )}

        <Button
          color="green"
          style={{ display: "block", margin: "auto" }}
          onClick={this.props.onCreateClick}
        >
          <Icon name="plus" />
          {this.props.openedFolder ? "Create Sub-Folder" : "Create New Folder"}
        </Button>
      </span>
    );
  }
}
