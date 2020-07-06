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

            this.setState({ textTranslators: nextProps.article.textTranslators.map((t) => t.user).filter(t => t) })
        } else if (!this.props.article && nextProps.article && nextProps.article.textTranslators) {
            this.setState({ textTranslators: nextProps.article.textTranslators.map((t) => t.user).filter(t => t) });
        } else if (nextProps.article && this.state.textTranslators.length === 0 && nextProps.article.textTranslators.length > 0) {
            this.setState({ textTranslators: nextProps.article.textTranslators.map((t) => t.user).filter(t => t) });
        }
    }
    
    render() {
        const { article, users } = this.props;
        
        const dropdownOptions = !users ? [] : users.map((user) => ({ value: user._id, text: `${user.firstname} ${user.lastname} (${user.email})` }));

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
                                            value={this.state.textTranslators.length > 0 ? this.state.textTranslators[0] : null}
                                            onChange={(e, { value }) => {
                                                this.setState({ textTranslators: [value]})
                                            }}
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
                        onClick={() => this.props.onSave(this.state.translators, this.state.textTranslators)}
                    >
                        Save
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}