import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PermissionsEditor from '../../../shared/components/PermissionsEditor';
import { getUserName } from '../../../shared/utils/helpers';

export default class EditUserPermissionsModal extends React.Component {
    state = {
        permissions: [],
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.permissions !== this.props.permissions) {
            this.setState({ permissions: nextProps.permissions });
        }
    }

    onPermissionsChange = ({ permissions }) => {
        this.setState({ permissions });
        console.log(permissions)
    }

    render() {
        const { user, permissions, open, onClose, onCofirm } = this.props;
        if (!user) return null;

        return (
            <Modal
                size="tiny"
                open={open}
                onClose={onClose}
            >
                <Modal.Header>
                    <h3>Edit Roles</h3>
                </Modal.Header>
                <Modal.Content>
                    <p>
                        <strong>User:</strong> {getUserName(user)}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div style={{ marginRight: 20 }}>
                            Roles:
                        </div>
                        <PermissionsEditor permissions={permissions} onChange={this.onPermissionsChange} />
                    </div>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        onClick={onClose}
                        circular
                    >
                        Cancel
                    </Button>
                    <Button
                        primary
                        circular
                        onClick={() => onCofirm({ user, permissions: this.state.permissions })}
                    >
                        Save
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}