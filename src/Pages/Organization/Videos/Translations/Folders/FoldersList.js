import React from "react";
import { Icon, Breadcrumb, Dropdown } from "semantic-ui-react";

export default class FoldersList extends React.Component {
  state = { groupedFolders: {}, openedFolderParents: [] };

  componentDidMount() {
    const groupedFolders = this.props.folders.reduce((acc, f) => {
      if (!f.parent) f.parent = "unassigned";
      acc[f.parent] = [...(acc[f.parent] || []), f];
      return acc;
    }, {});
    this.setState({ groupedFolders });

    if (this.props.openedFolder) {
      const openedFolderParents = [];
      let openedFolderParent = this.props.folders.find(
        (f) => f._id === this.props.openedFolder.parent
      );
      while (openedFolderParent) {
        openedFolderParents.unshift(openedFolderParent);
        openedFolderParent = this.props.folders.find(
          (f) => f._id === openedFolderParent.parent
        );
      }
      this.setState({ openedFolderParents });
    }
  }

  componentWillReceiveProps(nextProps) {
    const groupedFolders = nextProps.folders.reduce((acc, f) => {
      if (!f.parent) f.parent = "unassigned";
      acc[f.parent] = [...(acc[f.parent] || []), f];
      return acc;
    }, {});
    this.setState({ groupedFolders });

    if (nextProps.openedFolder) {
      const openedFolderParents = [];
      let openedFolderParent = nextProps.folders.find(
        (f) => f._id === nextProps.openedFolder.parent
      );
      while (openedFolderParent) {
        openedFolderParents.unshift(openedFolderParent);
        openedFolderParent = nextProps.folders.find(
          (f) => f._id === openedFolderParent.parent
        );
      }
      this.setState({ openedFolderParents });
    }
  }

  render() {
    let foldersOptions = [];
    if (Object.keys(this.state.groupedFolders).length > 0) {
      const parent =
        this.props.openedFolder && this.props.openedFolder.parent
          ? this.props.openedFolder.parent
          : "unassigned";

      foldersOptions = this.state.groupedFolders[parent].map((f) => ({
        key: f.name,
        value: f._id,
        text: (
          <span style={{ color: "#041c34", fontSize: "0.9rem" }}>
            <Icon name="folder" style={{ marginRight: 5 }} />
            {f.name}
          </span>
        ),
      }));
    }

    return (
      <Breadcrumb style={{ color: "#041c34" }}>
        <Breadcrumb.Section>
          <Icon name="home" style={{ marginRight: 5 }} />
          <span
            onClick={() => {
              if (this.props.openedFolder)
                this.props.onOpenedFolderChange(null);
            }}
            style={{
              marginRight: 5,
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Homepage
          </span>
        </Breadcrumb.Section>
        <Breadcrumb.Divider icon="right chevron" />

        {this.state.openedFolderParents.map((p) => (
          <React.Fragment>
            <Breadcrumb.Section>
              <Icon name="folder open" />
              <span
                onClick={() => {
                  this.props.onOpenedFolderChange(p._id);
                }}
                style={{
                  marginRight: 5,
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                {p.name}
              </span>
            </Breadcrumb.Section>
            <Breadcrumb.Divider icon="right chevron" />
          </React.Fragment>
        ))}

        <Breadcrumb.Section>
          <Dropdown
            text={
              this.props.openedFolder ? (
                <span>
                  <Icon name="folder open" style={{ marginRight: 5 }} />
                  <span>{this.props.openedFolder.name}</span>
                </span>
              ) : (
                <span>
                  <Icon name="folder" style={{ marginRight: 5 }} />
                  <span>Select Folder</span>
                </span>
              )
            }
            pointing
            options={foldersOptions}
            value={this.props.openedFolder ? this.props.openedFolder._id : null}
            onChange={(e, { value }) => {
              this.props.onOpenedFolderChange(value);
            }}
          />
        </Breadcrumb.Section>
      </Breadcrumb>
    );
  }
}
