import React from "react";
import { Icon, Breadcrumb, Dropdown, Button } from "semantic-ui-react";

export default class FoldersList extends React.Component {
  state = {
    selectedMainFolderId: null,
    selectedMainFolderName: null,
    selectedSubfolderId: null,
    selectedSubfolderName: null,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.breadcrumbFolder) {
      this.setState({ selectedSubfolderName: nextProps.breadcrumbFolder.name });
      this.setState({ selectedSubfolderId: nextProps.breadcrumbFolder._id });
    }

    if (nextProps.openedFolder) {
      const folder = nextProps.mainFolders.find(
        (f) => f._id === this.state.selectedMainFolderId
      );
      if (folder) {
        if (folder.name !== this.state.selectedMainFolderName) {
          this.setState({ selectedMainFolderName: folder.name });
        }
      }
    }
  }

  render() {
    const mainFoldersOptions = this.props.mainFolders.map((f) => ({
      key: f.name,
      value: f._id,
      name: f.name,
      content: (
        <span style={{ color: "#041c34", fontSize: "0.9rem" }}>
          <Icon name="folder" style={{ marginRight: 5 }} />
          {f.name}
        </span>
      ),
    }));

    const { breadcrumbFolder } = this.props;
    let siblingFoldersOptions = [];
    if (breadcrumbFolder) {
      siblingFoldersOptions = breadcrumbFolder.siblings.map((f) => ({
        key: f.name,
        value: f._id,
        name: f.name,
        content: (
          <span style={{ color: "#041c34", fontSize: "0.9rem" }}>
            <Icon name="folder" style={{ marginRight: 5 }} />
            {f.name}
          </span>
        ),
      }));
      siblingFoldersOptions.unshift({
        key: breadcrumbFolder.name,
        value: breadcrumbFolder._id,
        name: breadcrumbFolder.name,
        content: (
          <span style={{ color: "#041c34", fontSize: "0.9rem" }}>
            <Icon name="folder" style={{ marginRight: 5 }} />
            {breadcrumbFolder.name}
          </span>
        ),
      });
    }

    return (
      <Breadcrumb style={{ color: "#041c34" }}>
        <Breadcrumb.Section>
          <Icon name="home" style={{ marginRight: 5 }} />
          <span
            onClick={() => {
              this.setState({
                mainFoldersOptions: null,
                siblingFoldersOptions: null,
              });
              this.props.onHomeClick();
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

        <Breadcrumb.Section>
          {this.props.breadcrumbFolder && this.props.breadcrumbFolder.parent ? (
            <span
              style={{
                color: "#041c34",
                fontSize: "0.9rem",
                cursor: "pointer",
                textDecoration: 'underline'
              }}
              onClick={() => {
                this.setState({ selectedMainFolderName: this.state.selectedMainFolderName });
                this.setState({ selectedMainFolderId: this.state.selectedMainFolderId });
                this.props.onOpenMainFolder(this.state.selectedMainFolderId);
              }}
            >
              <Icon name="folder open" style={{ marginRight: 5 }} />
              {this.state.selectedMainFolderName}
            </span>
          ) : (
            <Dropdown
              text={
                this.props.openedFolder ? (
                  <span style={{ color: "#041c34", fontSize: "0.9rem" }}>
                    <Icon name="folder open" style={{ marginRight: 5 }} />
                    {this.state.selectedMainFolderName}
                  </span>
                ) : (
                  <span style={{ color: "#041c34", fontSize: "0.9rem" }}>
                    <Icon name="folder" style={{ marginRight: 5 }} />
                    Select Folder
                  </span>
                )
              }
              pointing={mainFoldersOptions.length > 0}
            >
              <Dropdown.Menu>
                {mainFoldersOptions.map((o) => (
                  <Dropdown.Item
                    {...o}
                    onClick={(e, { value }) => {
                      this.setState({ selectedMainFolderName: o.name });
                      this.setState({ selectedMainFolderId: o.value });
                      this.props.onOpenMainFolder(value);
                    }}
                  />
                ))}
                {this.props.mainFoldersCurrentPageNumber !==
                  this.props.mainFoldersTotalPagesCount && (
                  <div
                    style={{
                      margin: 20,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      primary
                      size="mini"
                      disabled={this.props.mainFoldersLoading}
                      loading={this.props.mainFoldersLoading}
                      onClick={(e) => {
                        e.stopPropagation();
                        this.props.onLoadMoreMainFolders();
                      }}
                    >
                      Load More...
                    </Button>
                  </div>
                )}
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Breadcrumb.Section>

        {this.props.breadcrumbFolder &&
          this.props.breadcrumbFolder.parent &&
          this.props.breadcrumbFolder.parent.parent && (
            <React.Fragment>
              <Breadcrumb.Divider icon="right chevron" />
              <Breadcrumb.Section>
                <Icon name="folder open" style={{ marginRight: 5 }} />
                <span
                  onClick={() => {
                    this.props.onOpenFolder(
                      this.props.breadcrumbFolder.parent._id
                    );
                  }}
                  style={{
                    marginRight: 5,
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  {this.props.breadcrumbFolder.parent.name}
                </span>
              </Breadcrumb.Section>
            </React.Fragment>
          )}

        {this.props.breadcrumbFolder && (
          <Breadcrumb.Divider icon="right chevron" />
        )}

        {this.props.breadcrumbFolder && (
          <React.Fragment>
            <Breadcrumb.Section>
              <Dropdown
                text={
                  <span style={{ color: "#041c34", fontSize: "0.9rem" }}>
                    <Icon name="folder open" style={{ marginRight: 5 }} />
                    {this.state.selectedSubfolderName}
                  </span>
                }
                pointing={siblingFoldersOptions.length > 0}
                defaultValue={this.props.breadcrumbFolder._id}
              >
                <Dropdown.Menu>
                  {siblingFoldersOptions.map((o) => (
                    <Dropdown.Item
                      {...o}
                      onClick={(e, { value }) => {
                        this.setState({ selectedSubfolderName: o.name });
                        this.setState({ selectedSubfolderId: o.value });
                        this.props.onOpenFolder(value);
                      }}
                    />
                  ))}
                  {this.props.breadcrumbCurrentPageNumber !==
                    this.props.breadcrumbTotalPagesCount && (
                    <div
                      style={{
                        margin: 20,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        primary
                        size="mini"
                        disabled={this.props.breadcrumbLoading}
                        loading={this.props.breadcrumbLoading}
                        onClick={(e) => {
                          e.stopPropagation();
                          this.props.onLoadMoreSiblingFolders();
                        }}
                      >
                        Load More...
                      </Button>
                    </div>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Breadcrumb.Section>
          </React.Fragment>
        )}
      </Breadcrumb>
    );
  }
}
