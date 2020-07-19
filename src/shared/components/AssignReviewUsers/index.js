import React from "react";
import PropTypes from "prop-types";
import { Modal, Dropdown, Button } from "semantic-ui-react";
import { getUserName } from "../../utils/helpers";
import "./style.scss";
// function getUserName(user) {
//     return user.firstname && user.lastname ? `${user.firstname} ${user.lastname} (${user.email})` : user.email;
// }

export default class AssignReviewUsers extends React.Component {
  state = {
    value: [],
    defaultValue: [],
    defaultValueCached: false,
  };

  componentDidMount = () => {
        const newValue = this.props.value.map((v) =>
          this.props.users.find((u) => u._id === v)
        ).filter(a => a);
        this.setState({
          value: newValue,
          defaultValue: newValue,
          defaultValueCached: true,
        });

  }
  // componentWillReceiveProps = (nextProps) => {
  //   if (!this.state.defaultValueCached) {
  //     if (
  //       JSON.stringify(nextProps.value) !==
  //       JSON.stringify(this.state.value.map((v) => v._id))
  //     ) {
  //       const newValue = nextProps.value.map((v) =>
  //         nextProps.users.find((u) => u._id === v)
  //       ).filter(a => a);
  //       this.setState({
  //         value: newValue,
  //         defaultValue: newValue,
  //         defaultValueCached: true,
  //       });
  //     } else {
  //       // this.setState({ defaultValueCached: true })
  //     }
  //   }
  // };

  onChange = (_, { value }) => {
    if (this.props.single) {
      const userObj = this.props.users.find(
        (u) => u._id === value[value.length - 1]
      );
      this.setState({ value: value.length === 0 ? [] : [userObj] });
    } else {
      let userObjects = [];
      value.forEach((v) => {
        const userObj =
          this.props.users.find((u) => u._id === v) ||
          this.state.value.find((u) => u._id === v);
        if (userObj) userObjects.push(userObj);
      });
      this.setState({ value: userObjects });
    }
  };

  render() {
    const { users } = this.props;
    const usersIds = users.map((u) => u._id);
    const options = this.state.value
      .filter((v) => !usersIds.includes(v._id))
      .map((v) => ({
        text: getUserName(v),
        value: v._id,
        key: `user-list-${v._id}`,
      }))
      .concat(
        !users
          ? []
          : users.map((u) => ({
              text: getUserName(u),
              value: u._id,
              key: `user-list-${u._id}`,
            }))
      );

    return (
      <Modal open={this.props.open} size="tiny" onClose={this.props.onClose}>
        <Modal.Header>
          {this.props.title || "Assign Users"}
          <Button
            // basic
            onClick={this.props.onClose}
            className="pull-right"
            color="white"
            circular
            icon="close"
          />
        </Modal.Header>
        <Modal.Content>
          {this.props.showResendEmail && (
            <div className={"assign-review-users__user-list"}>
              {this.state.defaultValue
                .map((v) => v._id)
                .map((userId, index) => (
                  <div
                    className={"assign-review-users__user-item"}
                    key={`assign-user-modal-user-${index}`}
                  >
                    <span>
                      {getUserName(
                        this.state.defaultValue.find((u) => u._id === userId)
                      )}
                    </span>
                    <Button
                      basic
                      circular
                      primary
                      onClick={() => this.props.onResendEmail(userId)}
                    >
                      Resend email
                    </Button>
                  </div>
                ))}
            </div>
          )}
          <Dropdown
            className="review-users-dropdown"
            clearable
            fluid
            multiple
            search
            selection
            options={options}
            value={this.state.value.map((v) => v._id)}
            onChange={this.onChange}
            placeholder="Select users"
            onSearchChange={(e, { searchQuery }) => {
              this.props.onSearchUsersChange(searchQuery);
            }}
            onBlur={() => {
              this.props.onBlur();
            }}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button circular onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button
            circular
            primary
            onClick={() => this.props.onSave(this.state.value)}
          >
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

AssignReviewUsers.propTypes = {
  value: PropTypes.array,
  users: PropTypes.array,
  onResendEmail: PropTypes.func,
  onSave: PropTypes.func,
};

AssignReviewUsers.defaultProps = {
  value: [],
  users: [],
  onResendEmail: () => {},
  onSave: () => {},
};
