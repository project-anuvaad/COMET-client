import React from "react";
import { Input, Icon, Card } from "semantic-ui-react";
import RoleRenderer from "../../../../../shared/containers/RoleRenderer";

export default class FolderCard extends React.Component {
  state = { editing: false, name: "" };

  componentDidMount() {
    this.setState({ name: this.props.folder.name });
  }

  toggleEdit = () => {
    this.setState({ editing: !this.state.editing });
  };

  OnNameChange = (value) => {
    this.setState({ name: value });
  };

  render() {
    return (
      <Card
        style={{
          padding: "15px 10px 15px 10px",
          display: "block",
          color: "#041c34",
        }}
      >
        {this.state.editing ? (
          <React.Fragment>
            <RoleRenderer roles={["admin"]}>
              <Input
                fluid
                size="mini"
                placeholder="Folder name..."
                value={this.state.name}
                onChange={(e, { value }) => {
                  this.OnNameChange(value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    this.props.onSubmit(this.props.folder._id, this.state.name);
                    this.toggleEdit();
                  }
                }}
              />
              <div style={{ fontSize: ".6rem" }}>
                <span>Press enter so save</span>
                <span
                  style={{
                    float: "right",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={this.toggleEdit}
                >
                  cancel
                </span>
              </div>
            </RoleRenderer>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                this.props.onOpenedFolderChange(this.props.folder._id);
              }}
            >
              <Icon name="folder" style={{ marginRight: 12 }} />
              {this.props.folder.name}
            </span>
            <RoleRenderer roles={["admin"]}>
              <Icon
                name="edit"
                style={{ float: "right", cursor: "pointer" }}
                onClick={this.toggleEdit}
              />
            </RoleRenderer>
          </React.Fragment>
        )}
      </Card>
    );
  }
}
