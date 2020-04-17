import React from 'react';
import { List, Select, Button, Icon } from 'semantic-ui-react';

function getUserRoleValue(permissions) {
    let role = 'l1';
    if (permissions.length === 1) {
        if (permissions[0] === 'admin') {
            role = 'l0';
        } else if (permissions[0] === 'review') {
            role = 'l1';
        } else if (permissions[0] === 'translate') {
            role = 'l2'
        }
    } else {
        role = 'l3';
    }
    return role;
}

export default class ApiKeyItem extends React.Component {
    state = {
        visible: false,
        secretVisible: false,
    }

    render() {
        const {
            apiKey,
            rolesOptions,
            onRoleChange,
            canModify,
            onDelete,
        } = this.props;
        const orgRole = apiKey.user.organizationRoles.find((r) => r.organization === apiKey.organization);
        if (!orgRole) return null;
        const isOrganizationOwner = orgRole.organizationOwner;

        return (
            <List.Item>

                <List.Icon name='key' size='large' verticalAlign='middle' />

                <List.Content>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <p>
                                Type: <strong style={{ textTransform: 'capitalize' }} >{apiKey.keyType || 'Platform'}</strong>
                            </p>
                            {apiKey.keyType !== 'service' && (
                                <p>
                                    Origins: {apiKey.origins.join(', ')}
                                </p>
                            )}
                            <p>
                                Key: {this.state.visible ? (
                                    <strong>{apiKey.key}</strong>
                                ) : null}
                                <Button
                                    style={{ marginLeft: 10, borderBox: 'none' }}
                                    size="tiny"
                                    basic
                                    circular
                                    icon={this.state.visible ? 'eye' : 'eye slash'}
                                    onClick={() => this.setState({ visible: !this.state.visible })}
                                />
                            </p>
                            {apiKey.secret && (
                                <p>
                                    Secret: {this.state.secretVisible ? (
                                        <strong>{apiKey.secret}</strong>
                                    ) : null}

                                    <Button
                                        style={{ marginLeft: 10, borderBox: 'none' }}
                                        size="tiny"
                                        basic
                                        circular
                                        icon={this.state.secretVisible ? 'eye' : 'eye slash'}
                                        onClick={() => this.setState({ secretVisible: !this.state.secretVisible })}
                                    />
                                </p>
                            )}

                        </div>
                        {!isOrganizationOwner && (
                            <span>
                                <Select
                                    style={{ marginRight: 10 }}
                                    name="role"
                                    onChange={onRoleChange}
                                    value={getUserRoleValue(orgRole.permissions)}
                                    options={rolesOptions}
                                    disabled={!canModify}
                                />
                                {canModify && (
                                    <Button onClick={onDelete} icon color="red">
                                        <Icon name='trash' />
                                    </Button>
                                )}
                            </span>
                        )}

                    </div>

                </List.Content>

            </List.Item>
        )
    }
}