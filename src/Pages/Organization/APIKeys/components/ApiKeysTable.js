import React, { Component } from 'react'
import { List, Modal, Button, Icon } from 'semantic-ui-react'
// import DeleteUserModal from './DeleteUserModal';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { editPermissions, deleteApiKey } from '../modules/actions';
import ApiKeyItem from './ApiKeyItem';


class ApiKeysTable extends Component {
    roles = [
        {
            key: 'l0',
            value: 'l0',
            text: 'Admin',
        },
        {
            key: 'l1',
            value: 'l1',
            text: 'Review'
        }, {
            key: 'l2',
            value: 'l2',
            text: 'Translate'
        }, {
            key: 'l3',
            value: 'l3',
            text: 'Review and Translate'
        }
    ]

    state = {
        deleteModalOpen: false,
        selectedApiKey: null,
    }

    onDeleteApiKeyClick = apiKey => {
        this.setState({ selectedApiKey: apiKey, deleteModalOpen: true });
    }

    onDeleteSelectedApiKey = () => {
        const { selectedApiKey } = this.state;
        this.props.deleteApiKey(selectedApiKey._id);
        this.setState({ selectedApiKey: null, deleteModalOpen: false });
    }

    onRoleChange = (role, apiKey) => {
        let permissions;
        if (role === 'l0') {
            permissions = ['admin']
        } else if (role === 'l1') {
            permissions = ['review'];
        } else if (role === 'l2') {
            permissions = ['translate'];
        } else if (role === 'l3') {
            permissions = ['review', 'translate'];
        }
        this.props.editPermissions(this.props.organization._id, apiKey._id, permissions);
    }

    renderDeleteKeyModal = () => (
        <Modal
            size="tiny"
            open={this.state.deleteModalOpen}
        >
            <Modal.Header>
                Delete API Key
            </Modal.Header>
            {this.state.selectedApiKey && (
                <Modal.Content>
                    <p>
                        Are you sure you want to delete this api key?
                    </p>
                    <div>
                        <small><strong>{this.state.selectedApiKey && this.state.selectedApiKey.key}</strong></small>
                    </div>
                    <div>
                        <small>All current websites using this key ({this.state.selectedApiKey.origins.join(',')}) wont be able to interact with the API properly using this key</small>
                    </div>
                </Modal.Content>
            )}
            <Modal.Actions>
                <Button
                    onClick={() => this.setState({ deleteModalOpen: false, selectedApiKey: null })}
                >
                    Cancel
                </Button>
                <Button
                    onClick={this.onDeleteSelectedApiKey}
                    primary
                >
                    Yes, delete
                </Button>
            </Modal.Actions>


        </Modal>
    )

    render() {
        const userRole = this.props.user.organizationRoles.find(r => r.organization._id === this.props.organization._id);
        const canModify = userRole.organizationOwner || (userRole.permissions.indexOf('admin') !== -1);

        const template = this.props.apiKeys && this.props.apiKeys.length ? this.props.apiKeys.map((apiKey) => {

            return (
                <ApiKeyItem
                    key={apiKey._id}
                    apiKey={apiKey}
                    organization={this.props.organization}
                    onDelete={() => this.onDeleteApiKeyClick(apiKey)}
                    canModify={canModify}
                    onRoleChange={(e, { value }) => this.onRoleChange(value, apiKey)}
                    rolesOptions={this.roles}
                />
            )
        }) : (
                <List.Item>

                    <List.Icon name='key' size='large' verticalAlign='middle' />

                    <List.Content>
                        <p> No API keys yet </p>
                    </List.Content>

                </List.Item>
            )

        return (
            <List divided relaxed>
                {template}
                {this.renderDeleteKeyModal()}
            </List >
        );
    }
}

const mapStateToProps = ({ organization, authentication, apiKeys }) => ({
    ...organization,
    ...apiKeys,
    user: authentication.user,
})

const mapDispatchToProps = (dispatch) => ({
    editPermissions: (organizationId, keyId, permissions) => dispatch(editPermissions(organizationId, keyId, permissions)),
    deleteApiKey: (id) => dispatch(deleteApiKey(id)),
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ApiKeysTable)
);