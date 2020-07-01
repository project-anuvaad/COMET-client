import React from "react";
import { Modal, Button, List } from "semantic-ui-react";
import PermissionsEditor from "../../../shared/components/PermissionsEditor";
import { getUserName } from "../../../shared/utils/helpers";
import UserInfo from "./UserInfo";

export default class EditUserPermissionsModal extends React.Component {
  state = {
    permissions: [],
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.permissions !== this.props.permissions) {
      this.setState({ permissions: nextProps.permissions });
    }
  };

  onPermissionsChange = ({ permissions }) => {
    this.setState({ permissions });
  };

  render() {
    const {
      user,
      organization,
      permissions,
      open,
      onClose,
      onCofirm,
    } = this.props;
    if (!user) return null;

    return (
      <Modal size="tiny" open={open} onClose={onClose}>
        <Modal.Header>
          <h3>Edit Roles</h3>
        </Modal.Header>
        <Modal.Content>
          <List divided relaxed>
            <List.Item style={{ marginBottom: 10 }}>
              <List.Content>
                <UserInfo user={user} organization={organization} />
              </List.Content>
            </List.Item>
            <List.Item></List.Item>
          </List>
          <div>
            <div style={{ marginRight: 20, marginBottom: 10, fontSize: '1.2rem', color: '#333333' }}>Assigned Roles:</div>
            <PermissionsEditor
              permissions={permissions}
              onChange={this.onPermissionsChange}
            />
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={onClose} circular>
            Cancel
          </Button>
          <Button
            primary
            circular
            onClick={() =>
              onCofirm({ user, permissions: this.state.permissions })
            }
          >
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
