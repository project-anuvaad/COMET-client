import React, { Component } from "react";
import { List, Label, Button, Icon } from "semantic-ui-react";
import DeleteUserModal from "./DeleteUserModal";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { fetchUsers, editPermissions } from "../../../actions/organization";
import EditUserPermissionsModal from "./EditUserPermissionsModal";
import UserInfo from "./UserInfo";
import { USER_ROLES_TITLE_MAP } from "../../../shared/constants";

class UserTable extends Component {
  state = {
    isEditPermissionsModalVisible: false,
    selectedUser: null,
    selectedUserPermissions: [],
  };

  onRoleChange = (user, permissions) => {
    this.props.editPermissions(
      this.props.organization._id,
      user._id,
      permissions
    );
  };

  render() {
    const userRole = this.props.user.organizationRoles.find(
      (r) => r.organization._id === this.props.organization._id
    );
    const canModify =
      userRole.organizationOwner ||
      userRole.permissions.indexOf("admin") !== -1;

    const template = this.props.users.length ? (
      this.props.users.map((user) => {
        const orgRole = user.organizationRoles.find(
          (r) => r.organization === this.props.organization._id
        );
        if (!orgRole) return null;

        return (
          <List.Item key={`user-list-${user.email}`}>
            <List.Content>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem",
                }}
              >
                <UserInfo user={user} organization={this.props.organization} />
                <div style={{ display: "flex", alignItems: "center" }}>
                  {canModify && !orgRole.organizationOwner && (
                    <React.Fragment>
                      <Button
                        basic
                        circular
                        style={{ paddingRight: "0.5rem", width: 150, marginRight: 20 }}
                        onClick={() => {
                          this.setState({
                            isEditPermissionsModalVisible: true,
                            selectedUser: user,
                            selectedUserPermissions: orgRole.permissions,
                          });
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span style={{ marginRight: 10 }}>
                            {orgRole.permissions.length === 1
                              ? USER_ROLES_TITLE_MAP[orgRole.permissions[0]]
                              : `${orgRole.permissions.length} roles`}
                          </span>
                          <Icon name="chevron down" />
                        </div>
                      </Button>
                      <DeleteUserModal
                        user={user}
                        organization={this.props.organization}
                      />
                    </React.Fragment>
                  )}
                </div>
              </div>
            </List.Content>
          </List.Item>
        );
      })
    ) : (
      <List.Item>
        <List.Content>
          <p>Looks empty here...</p>
        </List.Content>
      </List.Item>
    );

    return (
      <List divided relaxed>
        {template}
        {canModify && (
          <EditUserPermissionsModal
            open={this.state.isEditPermissionsModalVisible}
            user={this.state.selectedUser}
            organization={this.props.organization}
            permissions={this.state.selectedUserPermissions}
            onClose={() =>
              this.setState({ isEditPermissionsModalVisible: false })
            }
            onCofirm={({ user, permissions }) => {
              console.log(user, permissions);
              this.setState({ isEditPermissionsModalVisible: false });
              this.onRoleChange(user, permissions);
            }}
          />
        )}
      </List>
    );
  }
}

const mapStateToProps = ({ organization, authentication }) => ({
  ...organization,
  user: authentication.user,
});

const mapDispatchToProps = (dispatch) => ({
  editPermissions: (organizationId, userId, permissions) =>
    dispatch(editPermissions(organizationId, userId, permissions)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(UserTable)
);
