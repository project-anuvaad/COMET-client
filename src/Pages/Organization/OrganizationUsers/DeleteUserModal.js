import React, { Component } from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { removeUser } from "../../../actions/organization";
import UserInfo from "./UserInfo";

class DeleteUserModal extends Component {
  state = {
    open: false,
  };

  close = () => this.setState({ open: false });

  open = () => this.setState({ open: true });

  componentWillReceiveProps(nextProps) {
    if (nextProps.removeUserSuccess) {
      this.close();
    }
  }

  removeUser = () => {
    this.props.removeUser(this.props.organization._id, this.props.user._id);
  };

  render() {
    return (
      <Modal
        trigger={
          <Button circular onClick={this.open} basic icon>
            <Icon name="trash alternate outline" color="red" />
          </Button>
        }
        size="tiny"
        open={this.state.open}
        onClose={this.close}
      >
        <Modal.Header>
          <h3
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            CONFIRM REMOVE <Button onClick={this.close} circular icon="close" />
          </h3>
        </Modal.Header>
        <Modal.Content>
          <p>
            Are you sure you want to remove this user from your organization?
          </p>
          <UserInfo
            user={this.props.user}
            organization={this.props.organization}
          />
        </Modal.Content>

        <Modal.Actions>
          <Button circular onClick={this.close}>
            Cancel
          </Button>
          <Button primary circular onClick={this.removeUser}>
            Yes, Remove
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = ({ organization }) => ({
  ...organization,
});

const mapDispatchToProps = (dispatch) => ({
  removeUser: (organization, userId) =>
    dispatch(removeUser(organization, userId)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DeleteUserModal)
);
