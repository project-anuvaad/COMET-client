import React from 'react';
import { Modal, Dropdown, Grid, Popup, Icon, Button, Radio } from 'semantic-ui-react';
import NotificationService from '../../../../shared/utils/NotificationService';
import PermissionsEditor from '../../../../shared/components/PermissionsEditor';

function cleanOrigin(origin) {
    let newOrg = origin;
    if (newOrg.indexOf('https://') !== -1) {
        newOrg = newOrg.replace('https://', '')
    } else if (newOrg.indexOf('http://') !== -1) {
        newOrg = newOrg.replace('http://', '');
    }
    if (newOrg.split('/').length > 1) {
        newOrg = newOrg.split('/')[0];
    }
    return newOrg.toLowerCase();
}

function isOriginValid(origin) {
    return origin.split('.').length >= 2;
}

export default class ApiKeyFormModal extends React.Component {

    canCreate = () => {
        const { permissions, origins, keyType } = this.props;
        if (keyType === 'service') return true;
        return permissions.length > 0 && origins.length > 0;
    }

    onOriginsChange = (e, { value }) => {
        let origins = [];
        console.log('on origins change', value)
        value.forEach(origin => {
            const cleanedOrigin = cleanOrigin(origin)
            if (isOriginValid(cleanedOrigin)) {
                if (origins.indexOf(cleanedOrigin) === -1) {
                    origins.push(cleanedOrigin)
                }
            } else {
                NotificationService.error('Invalid origin format');
            }
        })
        console.log(origins)
        this.props.onChange({ origins });
    }
    onSubmit = () => {
        const { origins, permissions } = this.props;
        this.props.onSubmit({ origins, permissions });
    }

    render() {
        const {
            open,
            onClose,
            origins,
            permissions,
            originOptions,
            title,
            keyType,
        } = this.props;
        return (
            <Modal
                size="tiny"
                open={open}
                onClose={onClose}
            >
                <Modal.Header>
                    {title || 'Create an API Key'}
                </Modal.Header>
                <Modal.Content>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={4}>
                                Key type:
                            </Grid.Column>
                            <Grid.Column width={12}>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column width={16}>
                                            <Radio checked={keyType === 'platform'} label="Platform key" onClick={() => this.props.onChange({ keyType: 'platform' })} />
                                        </Grid.Column>

                                        <Grid.Column width={16}>
                                            <Radio type="radio" checked={keyType === 'service'} label="Service key" onClick={() => this.props.onChange({ keyType: 'service' })} />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    {keyType === 'platform' && (
                        <Grid>
                            <Grid.Row
                                style={{ alignItems: 'center' }}
                            >
                                <Grid.Column width={6}>
                                    Allowed Origins
                                <Popup
                                        trigger={(
                                            <Icon name="info circle" style={{ marginLeft: 10 }} />
                                        )}
                                        content="List of websites that the API key will be used in."
                                    />
                                </Grid.Column>
                                <Grid.Column width={10}>

                                    <Dropdown
                                        placeholder="example.com"
                                        fluid
                                        selection
                                        value={origins}
                                        search
                                        multiple
                                        noResultsMessage="Type to add new websites"
                                        options={(originOptions || []).map((o, i) => ({ key: `origin-item-${o}-${i}`, value: o, text: o }))}
                                        allowAdditions
                                        onChange={this.onOriginsChange}
                                        additionLabel={(
                                            <span
                                                className="pull-right"
                                            >
                                                <Icon name="plus" color="green" />
                                                Add
                                            </span>
                                        )}
                                    />
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row
                                style={{ alignItems: 'center' }}
                            >
                                <Grid.Column width={6}>
                                    Permissions
                                <Popup
                                        trigger={(
                                            <Icon name="info circle" style={{ marginLeft: 10 }} />
                                        )}
                                        content="The permissions to be assigned for the API key"
                                    />
                                </Grid.Column>
                                <Grid.Column width={10}>
                                    {/* <Select
                                        name="role"
                                        onChange={this.onRoleChange}
                                        value={getUserRoleValue(permissions)}
                                        options={this.roles} /> */}
                                    <PermissionsEditor
                                        permissions={this.props.permissions}
                                        onChange={({ permissions }) => this.props.onChange({ permissions })}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    )}

                </Modal.Content>

                <Modal.Actions>
                    <Button
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        primary
                        onClick={this.onSubmit}
                        disabled={!this.canCreate()}
                    >
                        Create
                    </Button>
                </Modal.Actions>

            </Modal>
        )
    }
}