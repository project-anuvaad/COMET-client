import React, { Component } from "react";
import { Button, Modal, Form, Select, Icon, Message } from "semantic-ui-react";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { inviteUser } from "../../../actions/organization";
import PermissionsEditor from "../../../shared/components/PermissionsEditor";

class ModalExampleSize extends Component {
  state = {
    // invite form values
    email: "",
    firstname: "",
    lastname: "",
    permissions: ["admin"],

    errorMessage: null,
  };

  form = null;

  onFormSubmit = (e) => {
    e.preventDefault();

    const { email, firstname, lastname, permissions } = this.state;

    this.props.inviteUser(this.props.organization._id, {
      email,
      firstname,
      lastname,
      permissions,
    });
    this.props.onClose()
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.inviteUserSuccess && nextProps.inviteUserSuccess) {
      this.props.onClose();
    }
  }

  handleChange = (event, data) => {
    if (data) {
      const value = data.value;
      const name = data.name;

      this.setState({
        [name]: value,
      });
    } else {
      const target = event.target;
      const value = target.type === "checkbox" ? target.checked : target.value;
      const name = target.name;

      this.setState({
        [name]: value,
      });
    }
  };

  render() {
    const { open, onClose } = this.props;

    return (
      <div>
        <Modal open={open} onClose={onClose} size="small">
          <Modal.Header className="invite-modal-header">
            Invite New User
          </Modal.Header>

          <Modal.Content>
            <Form onSubmit={this.onFormSubmit}>
              <Form.Field>
                <label>Email</label>
                <input
                  name="email"
                  onChange={this.handleChange}
                  value={this.state.email}
                />
              </Form.Field>

              <Form.Group widths="equal">
                <Form.Input
                  name="firstname"
                  onChange={this.handleChange}
                  value={this.state.firstname}
                  fluid
                  label="First name"
                />
                <Form.Input
                  name="lastname"
                  onChange={this.handleChange}
                  value={this.state.lastname}
                  fluid
                  label="Last name"
                />
              </Form.Group>

              <Form.Field>
                <div>
                  <div
                    style={{
                      marginRight: 20,
                      marginBottom: 10,
                      fontSize: "1.2rem",
                      color: "#333333",
                    }}
                  >
                    Assigned Roles:
                  </div>
                  <PermissionsEditor
                    permissions={this.state.permissions}
                    onChange={({ permissions }) =>
                      this.setState({ permissions })
                    }
                  />
                </div>
              </Form.Field>
            </Form>

            {this.state.errorMessage && (
              <Message color="red">{this.state.errorMessage}</Message>
            )}
          </Modal.Content>

          <Modal.Actions>
            <Button circular onClick={onClose}>
              {" "}
              Cancel{" "}
            </Button>
            <Button circular primary type="submit" onClick={this.onFormSubmit}>
              Invite User
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = ({ organization }) => ({
  ...organization,
});

const mapDispatchToProps = (dispatch) => ({
  inviteUser: (organization, { email, firstname, lastname, permissions }) =>
    dispatch(
      inviteUser(organization, { email, firstname, lastname, permissions })
    ),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ModalExampleSize)
);
