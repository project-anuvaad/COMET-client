import React from 'react';
import { Modal, Button, Grid, Dropdown } from 'semantic-ui-react';
import AssignTranslateUsersForm from './AssignTranslateUsersForm';

export default class AssignUsersSpeakersModal extends React.Component {

    state = {
        translators: [],
        textTranslators: [],
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.article && nextProps.article && this.props.article.translators !== nextProps.article.translators) {
            this.setState({ translators: nextProps.article.translators })
        } else if (!this.props.article && nextProps.article && nextProps.article.translators) {
            this.setState({ translators: nextProps.article.translators });
        } else if (nextProps.article && this.state.translators.length === 0 && nextProps.article.translators.length > 0) {
            this.setState({ translators: nextProps.article.translators });
        }

        if (this.props.article && nextProps.article && this.props.article.textTranslators !== nextProps.article.textTranslators) {
            const textTranslators = nextProps.article.textTranslators.map((t) => t.user).filter(t => t).map(t => this.props.users.find(u => u._id === t));
            this.setState({ textTranslators: textTranslators });
        } else if (!this.props.article && nextProps.article && nextProps.article.textTranslators) {
            const textTranslators = nextProps.article.textTranslators.map((t) => t.user).filter(t => t).map(t => this.props.users.find(u => u._id === t));
            this.setState({ textTranslators: textTranslators });
        } else if (nextProps.article && this.state.textTranslators.length === 0 && nextProps.article.textTranslators.length > 0) {
            const textTranslators = nextProps.article.textTranslators.map((t) => t.user).filter(t => t).map(t => this.props.users.find(u => u._id === t));
            this.setState({ textTranslators: textTranslators });
        }
    }
    
    render() {
        const { article, users } = this.props;
        const usersIds = users.map((u) => u._id);
        
        // const dropdownOptions = !users ? [] : users.map((user) => ({ value: user._id, text: `${user.firstname} ${user.lastname} (${user.email})` }));

        const dropdownOptions = this.state.textTranslators
            .filter((t) => !usersIds.includes(t._id))
            .map((t) => ({
                value: t._id, text: `${t.firstname} ${t.lastname} (${t.email})`
            }))
            .concat(
                !users ? [] : users.map((user) => ({ value: user._id, text: `${user.firstname} ${user.lastname} (${user.email})` }))
            );

        return (
            <Modal open={this.props.open} onClose={this.props.onClose} size="small">
                <Modal.Header>
                    Assign Users
                </Modal.Header>
                {article && ( 
                    <Modal.Content>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={4}>
                                    Text Translator:
                                </Grid.Column>
                                <Grid.Column width={12}>
                                    <div>
                                        <Dropdown
                                            fluid
                                            search
                                            selection
                                            clearable
                                            options={dropdownOptions}
                                            className="translate-users-dropdown"
                                            placeholder="Text Translator"
                                            value={this.state.textTranslators.length > 0 ? this.state.textTranslators[0]._id : null}
                                            onChange={(e, { value }) => {
                                                const userObj = this.props.users.find(u => u._id === value);
                                                this.setState({ textTranslators: [userObj]})
                                            }}
                                            onSearchChange={(e, { searchQuery }) => {
                                                this.props.onSearchUsersChange(searchQuery);
                                            }}
                                            onBlur={this.props.onBlur}
                                        />
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        {!article.tts && (
                            <AssignTranslateUsersForm
                            users={users}
                            article={article}
                            speakersProfile={article.speakersProfile}
                            tts={article.tts}
                            translators={this.state.translators}
                            onChange={(translators) => this.setState({ translators })}
                            onSearchUsersChange={(searchQuery) => {
                                this.props.onSearchUsersChange(searchQuery);
                            }}
                            onBlur={this.props.onBlur}
                            hasDefaultTranslators
                            />
                        )}
                    </Modal.Content>
                )}
                <Modal.Actions>
                    <Button
                        circular
                        onClick={this.props.onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        primary
                        circular
                        onClick={() => this.props.onSave(this.state.translators, this.state.textTranslators.map(t => t._id))}
                    >
                        Save
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}