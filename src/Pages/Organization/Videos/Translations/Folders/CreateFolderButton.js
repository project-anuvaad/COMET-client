import React from "react";
import { Button, Icon } from "semantic-ui-react";

export default class CreateFolderButton extends React.Component {
  render() {
    return (
      <span style={{ display: "flex", justifyContent: 'space-between' }}>
        {this.props.openedFolder && (
          <Button
            primary
            size="tiny"
            basic
            style={{ marginRight: 10 }}
            onClick={this.props.onChangeNameClick}
          >
            <Icon name="edit" />
            Change Folder Name
          </Button>
        )}

        <Button
          primary
          size="tiny"
          basic
          onClick={this.props.onCreateClick}
        >
          <Icon name="plus" />
          {this.props.openedFolder ? "Create Sub-Folder" : "Create New Folder"}
        </Button>
      </span>
    );
  }
}
