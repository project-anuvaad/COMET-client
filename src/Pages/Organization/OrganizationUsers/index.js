import React from "react";
import UserTable from "./UserTable";
import UsersTabs from "./UsersTabs";
import {
  Icon,
  Grid,
  Input,
  Dropdown,
  Checkbox,
  Label,
  Button,
} from "semantic-ui-react";
import { connect } from "react-redux";
import {
  searchUsers,
  fetchUsersCounts,
  setOrganizationUsersCurrentPage,
} from "../../../actions/organization";
import ClearPagination from "../../../shared/components/ClearPagination";
import { debounce } from "../../../shared/utils/helpers";
import { USER_ROLES_TITLE_MAP } from "../../../shared/constants";

const USER_INVITESTATUS_MAP = {
  active_users: "accepted",
  pending_invites: "pending",
};

function formatCount(count) {
  if (count < 10) return `0${count}`;
  return count;
}

class OrganizationUsers extends React.Component {
  state = {
    activeTab: "active_users",
    permissions: [],
    search: "",
  };

  componentDidMount = () => {
    this.props.setOrganizationUsersCurrentPage(1);
    this.fetchUsers();
    this.fetchUsersCounts();
    this.debouncedSearch = debounce(() => {
      this.fetchUsers();
    }, 1000);
  };

  onTabChange = (value) => {
    this.props.setOrganizationUsersCurrentPage(1);
    this.setState({ activeTab: value, permission: [], search: "" }, () => {
      this.fetchUsers();
    });
  };

  onPageChange = (e, data) => {
    this.props.setOrganizationUsersCurrentPage(data.activePage);
    this.props.searchUsers(this.props.organization._id, {
      inviteStatus: USER_INVITESTATUS_MAP[this.state.activeTab],
      page: data.activePage,
      search: this.state.search,
      permissions: this.state.permissions,
    });
  };

  onSearchChange = (value) => {
    this.setState({ search: value });
    this.debouncedSearch();
  };

  onPermissionClick = (permission) => {
    let newPermissions = this.state.permissions.slice();
    if (newPermissions.indexOf(permission) === -1) {
      newPermissions.push(permission);
    } else {
      newPermissions = newPermissions.filter((p) => p !== permission);
    }
    this.setState({ permissions: newPermissions }, () => {
      this.fetchUsers();
    });
  };

  fetchUsers = () => {
    this.props.searchUsers(this.props.organization._id, {
      inviteStatus: USER_INVITESTATUS_MAP[this.state.activeTab],
      page: this.props.organizationUsersCurrentPage,
      search: this.state.search,
      permissions: this.state.permissions,
    });
  };

  fetchUsersCounts = () => {
    this.props.fetchUsersCounts(this.props.organization._id);
  };

  render() {
    const SUBTABS = [
      {
        title: `Active Users (${
          this.props.usersCounts
            ? formatCount(this.props.usersCounts.accepted)
            : 0
        })`,
        value: "active_users",
      },
      {
        title: `Pending Invites (${
          this.props.usersCounts
            ? formatCount(this.props.usersCounts.pending)
            : 0
        })`,
        value: "pending_invites",
      },
    ];

    return (
      <div>
        <UsersTabs
          extraContent={
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              {SUBTABS.map((item, index) => (
                <React.Fragment key={`subtab-item-${item.title}`}>
                  <span
                    onClick={() => this.onTabChange(item.value)}
                    style={{
                      display: "inline-block",
                      cursor: "pointer",
                      marginRight: "2rem",
                      textTransform: "none",
                      padding: "1rem",
                      fontSize: "1rem",
                      borderBottom:
                        this.state.activeTab === item.value
                          ? "3px solid #0e7ceb"
                          : "none",
                      opacity: this.state.activeTab === item.value ? 1 : 0.5,
                    }}
                  >
                    {item.title}
                  </span>
                  {index !== SUBTABS.length - 1 && (
                    <Icon name="chevron right" style={{ opacity: 0.5 }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          }
        />
        <div className="organization-setting">
          <div className="wrapper">
            <Grid>
              <Grid.Row>
                <Grid.Column width={5}>
                  <Input
                    fluid
                    style={{ height: "100%" }}
                    type="text"
                    icon="search"
                    iconPosition="left"
                    input={
                      <input
                        type="text"
                        style={{
                          borderRadius: 20,
                          backgroundColor: "#d4e0ed",
                        }}
                      />
                    }
                    placeholder="Search users"
                    value={this.state.search}
                    onChange={(e, { value }) => this.onSearchChange(value)}
                  />
                </Grid.Column>
                <Grid.Column width={11}>
                  <div
                    className="pull-right"
                    style={{ marginRight: "-1.5rem" }}
                  >
                    <ClearPagination
                      activePage={this.props.organizationUsersCurrentPage}
                      onPageChange={this.onPageChange}
                      totalPages={this.props.organizationUsersTotalPages}
                    />
                  </div>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={14}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {this.state.permissions.map((p) => (
                      <div style={{ marginRight: 20, marginBottom: 10 }}>
                        <Label
                          size="large"
                          circular
                          basic
                          style={{
                            fontWeight: 200,
                            backgroundColor: "white",
                          }}
                        >
                          <span
                            style={{
                              padding: 5,
                              paddingRight: 0,
                            }}
                          >
                            {USER_ROLES_TITLE_MAP[p]}
                          </span>
                          <span
                            onClick={() => this.onPermissionClick(p)}
                            style={{
                              cursor: "pointer",
                              padding: 5,
                              fontSize: "1rem",
                              fontWeight: "bold",
                            }}
                          >
                            x
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </Grid.Column>
                <Grid.Column
                  width={2}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Dropdown text="Showing all users" pointing="top right">
                    <Dropdown.Menu>
                      {Object.keys(USER_ROLES_TITLE_MAP).map((key) => (
                        <Dropdown.Item
                          key={`user-filter-role-${key}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            this.onPermissionClick(key);
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Checkbox
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                this.onPermissionClick(key);
                              }}
                              checked={
                                this.state.permissions.indexOf(key) !== -1
                              }
                            />
                            <span style={{ marginLeft: 10 }}>
                              {USER_ROLES_TITLE_MAP[key]}
                            </span>
                          </div>
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}>
                  <div className="ui fluid card">
                    <div className="content">
                      <UserTable />
                    </div>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ organization }) => ({
  organization: organization.organization,
  usersCounts: organization.usersCounts,
  organizationUsersCurrentPage: organization.organizationUsersCurrentPage,
  organizationUsersTotalPages: organization.organizationUsersTotalPages,
});
const mapDispatchToProps = (dispatch) => ({
  searchUsers: (organizationId, params) =>
    dispatch(searchUsers(organizationId, params)),
  fetchUsersCounts: (organizationId) =>
    dispatch(fetchUsersCounts(organizationId)),
  setOrganizationUsersCurrentPage: (page) =>
    dispatch(setOrganizationUsersCurrentPage(page)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationUsers);
