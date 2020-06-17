import React, { Component } from 'react'
import { List, Label, Button, Icon } from 'semantic-ui-react'
import DeleteUserModal from './DeleteUserModal';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { fetchUsers, editPermissions } from '../../../actions/organization';
import EditUserPermissionsModal from './EditUserPermissionsModal';
import { USER_ROLES_TITLE_MAP } from '../../../shared/constants';
import PermissionLabel from '../../../shared/components/PermissionLabel';


class UserTable extends Component {

    state = {
        isEditPermissionsModalVisible: false,
        selectedUser: null,
        selectedUserPermissions: [],
    }

    componentDidMount() {
        this.props.fetchUsers(this.props.organization._id)
    }

    onRoleChange = (user, permissions) => {
        this.props.editPermissions(this.props.organization._id, user._id, permissions);
    }

    render() {
        const userRole = this.props.user.organizationRoles.find(r => r.organization._id === this.props.organization._id);
        const canModify = userRole.organizationOwner || (userRole.permissions.indexOf('admin') !== -1);

        const template = this.props.users.length ? this.props.users.map((user) => {
            const orgRole = user.organizationRoles.find((r) => r.organization === this.props.organization._id);
            if (!orgRole) return null;
            const isOrganizationOwner = orgRole.organizationOwner;

            return (
                <List.Item key={`user-list-${user.email}`}>

                    <List.Icon name='user' size='large' verticalAlign='middle' />

                    <List.Content>

                        <div>
                            <span className="invite-name bold-text">{user.firstname} {user.lastname}</span> <br /> {user.email}

                            {!isOrganizationOwner && (
                                <div className="pull-right">
                                    {orgRole.permissions && orgRole.permissions.map((permission, index) => (
                                        <PermissionLabel
                                            permission={permission}
                                            key={`permission-${permission}-${index}`}
                                        />
                                    ))}
                                    {canModify && (
                                        <React.Fragment>
                                            <Button
                                                icon
                                                onClick={() => {
                                                    this.setState({ isEditPermissionsModalVisible: true, selectedUser: user, selectedUserPermissions: orgRole.permissions })
                                                }}
                                            >
                                                <Icon name="edit" />
                                            </Button>
                                            <DeleteUserModal userId={user._id} />
                                        </React.Fragment>
                                    )}
                                </div>
                            )}

                        </div>

                        <div>
                            {
                                isOrganizationOwner ? (<div className="ui blue horizontal label">Organization Owner</div>) : null
                            }

                            {
                                user.emailVerified ? (
                                    <div className="ui green horizontal label">Activated</div>
                                ) : (
                                        <div className="ui red horizontal label">Not Activated</div>
                                    )
                            }
                        </div>

                    </List.Content>

                </List.Item>
            )
        }) : (
                <List.Item>

                    <List.Icon name='user' size='large' verticalAlign='middle' />

                    <List.Content>
                        <p> No invited users yet </p>
                    </List.Content>

                </List.Item>
            )

        return (
            <List divided relaxed>
                {template}
                {canModify && (
                    <EditUserPermissionsModal
                        open={this.state.isEditPermissionsModalVisible}
                        user={this.state.selectedUser}
                        permissions={this.state.selectedUserPermissions}
                        onClose={() => this.setState({ isEditPermissionsModalVisible: false })}
                        onCofirm={({ user, permissions }) => {
                            console.log(user, permissions);
                            this.setState({ isEditPermissionsModalVisible: false });
                            this.onRoleChange(user, permissions);
                        }}
                    />
                )}
            </List >
        );
    }
}

const mapStateToProps = ({ organization, authentication }) => ({
    ...organization,
    user: authentication.user,
})

const mapDispatchToProps = (dispatch) => ({
    fetchUsers: (params) => dispatch(fetchUsers(params)),
    editPermissions: (organizationId, userId, permissions) => dispatch(editPermissions(organizationId, userId, permissions))
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(UserTable)
);