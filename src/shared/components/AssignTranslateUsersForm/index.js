import React from 'react';
import { Grid, Dropdown } from 'semantic-ui-react';
import './style.scss';

export default class AssignTranslateUsersForm extends React.Component {
    state = {
        translators: [],
        selectedTranslators: [],
        defaultTranslatorsCached: false,
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.hasDefaultTranslators && nextProps.translators && nextProps.translators.length > 0 && !this.state.defaultTranslatorsCached) {
            const selectedTranslators = this.state.selectedTranslators.slice();
            nextProps.translators.forEach(t => {
                const userObj = nextProps.users.find((u) => u._id === t.user);
                if (userObj) {
                    const selectedTranslatorsIds = selectedTranslators.map(t => t._id);
                    if (!selectedTranslatorsIds.includes(userObj._id)) {
                        selectedTranslators.push(userObj);
                    }
                }
            })
            this.setState({ selectedTranslators });
        }
    }

    onTranslatorChange = (speakerNumber, userId) => {
        const { translators, users } = this.props;
        if (translators.find((t) => t.speakerNumber === speakerNumber)) {
            translators.find((t) => t.speakerNumber === speakerNumber).user = userId;
        } else {
            translators.push({ speakerNumber, user: userId });
        }
        this.props.onChange(translators);

        if (userId) {
            const userObj = users.find((u) => u._id === userId);
            if (userObj) {
                const selectedTranslators = this.state.selectedTranslators.slice();
                const selectedTranslatorsIds = selectedTranslators.map(t => t._id);
                if (!selectedTranslatorsIds.includes(userObj._id)) {
                    selectedTranslators.push(userObj);
                    this.setState({ selectedTranslators });
                }
            }
        }
    }

    render() {
        const { tts, speakersProfile, users } = this.props;
        const usersIds = users.map((u) => u._id);
        // const dropdownOptions = !users ? [] : users.map((user) => ({ value: user._id, text: `${user.firstname} ${user.lastname} (${user.email})` }))
     
        const dropdownOptions = this.state.selectedTranslators
            .filter((t) => !usersIds.includes(t._id))
            .map((t) => ({
                value: t._id,
                text: `${t.firstname} ${t.lastname} (${t.email})`,
            }))
            .concat(
            !users
                ? []
                : users.map((u) => ({
                    value: u._id,
                    text: `${u.firstname} ${u.lastname} (${u.email})`,
                }))
            );
        return (
            <Grid style={{}}>
                {tts && (
                    <Grid.Row key={`assign-speaker-text`}>
                        <Grid.Column width={4}>
                            Text
                        </Grid.Column>
                        <Grid.Column width={12} style={{ textAlign: 'left' }}>
                            <div>
                                <Dropdown
                                    fluid
                                    search
                                    selection
                                    clearable
                                    options={dropdownOptions}
                                    className="translate-users-dropdown"
                                    placeholder="Translator"
                                    value={this.props.translators && this.props.translators[0] ? this.props.translators[0].user : null}
                                    onChange={(e, { value }) => {
                                        let newTranslators = [];
                                        speakersProfile.forEach((s) => {
                                            newTranslators.push({
                                                user: value,
                                                speakerNumber: s.speakerNumber,
                                            })
                                        })
                                        this.props.onChange(newTranslators)
                                        // this.setState({ translators: newTranslators });
                                    }}
                                    onSearchChange={(e, { searchQuery }) => {
                                        this.props.onSearchUsersChange(searchQuery);
                                    }}
                                    onBlur={this.props.onBlur}
                                />
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                )}
                {!tts && speakersProfile && speakersProfile.filter((s) => s.speakerNumber !== -1).map((speaker) => {
                    const assignedTranslator = this.props.translators.find((t) => speaker.speakerNumber === t.speakerNumber);
                    return (
                        <Grid.Row key={`assign-speaker-${speaker.speakerNumber}`}>
                            <Grid.Column width={4}>
                                Speaker {speaker.speakerNumber} ({speaker.speakerGender})
                            </Grid.Column>
                            <Grid.Column width={12} style={{ textAlign: 'left' }}>
                                <div>
                                    <Dropdown
                                        fluid
                                        search
                                        selection
                                        clearable
                                        className="translate-users-dropdown"
                                        options={dropdownOptions}
                                        placeholder="Translator"
                                        value={assignedTranslator ? assignedTranslator.user : null}
                                        onChange={(e, { value }) => this.onTranslatorChange(speaker.speakerNumber, value)}
                                        onSearchChange={(e, { searchQuery }) => {
                                            this.props.onSearchUsersChange(searchQuery);
                                        }}
                                        onBlur={this.props.onBlur}
                                    />
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    )
                })}
            </Grid>
        )
    }
}