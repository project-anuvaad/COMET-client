import React from 'react';
import { Modal, Dropdown, Button } from 'semantic-ui-react';
import { getUserName } from '../../utils/helpers';
import './style.scss';
// function getUserName(user) {
//     return user.firstname && user.lastname ? `${user.firstname} ${user.lastname} (${user.email})` : user.email;
// }

export default class AssignReviewUsers extends React.Component {

    state = {
        value: [],
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.value !== this.state.value) {
            this.setState({ value: nextProps.value });
        }
    }

    onChange = (_, { value }) => {
        this.setState({ value });
    }

    render() {
        const options = this.props.users ? this.props.users.map((user) => ({ text: getUserName(user), value: user._id, key: `user-list-${user._id}` })) : [];

        return (
            <Modal open={this.props.open} size="tiny" onClose={this.props.onClose}>
                <Modal.Header>
                    {this.props.title || 'Assign Users'}
                    <Button
                        // basic
                        onClick={this.props.onClose}
                        className="pull-right"
                        color="white"
                        color="gray"
                        circular
                        icon="close"
                    />
                </Modal.Header>
                <Modal.Content>
                    <Dropdown
                        className="review-users-dropdown"
                        clearable
                        fluid
                        multiple
                        search
                        selection
                        options={options}
                        value={this.state.value}
                        onChange={this.onChange}
                        placeholder='Select users'
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
        )
    }
}