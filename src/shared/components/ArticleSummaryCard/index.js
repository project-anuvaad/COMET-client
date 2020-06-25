import React from 'react';
import { Card, Button, Progress, Icon, Grid, Popup, Label, Dropdown } from 'semantic-ui-react';
import './style.scss';
import RoleRenderer from '../../containers/RoleRenderer';
import ReactPlayer from 'react-player';
import Avatar from 'react-avatar';
import moment from 'moment';

export default class ArticleSummaryCard extends React.Component {

    renderUserAvatar = (translator) => {
        const { users } = this.props;
        if (!translator || !users) return null;
        if (typeof translator === 'string') {
            translator = users.find((u) => u._id === translator);
        } else {
            translator = users.find((u) => (u._id === translator.user));
        }
        if (!translator) return null;
        const translatorName = translator.firstname ? `${translator.firstname} ${translator.lastname || ''}` : translator.email;


        return <Popup
            content={translatorName}
            trigger={
                <span>
                    <Avatar
                        round
                        size={30}
                        name={translatorName}
                        style={{ margin: '0 10px', display: 'inline-block' }}
                    />
                </span>
            }
        />
    }

    renderInvitationLabel = (invitationStatus) => {
        let statusColor = 'green';
        if (invitationStatus === 'pending') {
            statusColor = 'orange';
        } else if (invitationStatus === 'accepted') {
            statusColor = 'green'
        } else {
            statusColor = 'red'
        }

        return (
            <Label color={statusColor} className="stage-badge">
                Invitation: {invitationStatus}
            </Label>
        )
    }

    renderTranslationStatus = (progress) => {
        return (

            <Label color={progress === 100 ? 'green' : 'blue'} className="stage-badge">
                {progress === 100 ? (
                    <span>Completed</span>
                ) : <span>Pending</span>}
            </Label>
        )
    }

    getTextPercentage = () => {
        const { article } = this.props;
        if (!article.stage) {
            return article.metrics.completed.text;
        }
        if (article.stage === 'text_translation') {
            return 0;
        }
        return 100;
    }
    render() {
        const {
            article,
            lang,
            onTitleClick,
            onDeleteClick,
            onAddClick,
            onAddVerifiersClick
        } = this.props;

        return (
            <div className='article-summary-card'>
                {this.props.showOptions && (

                    <RoleRenderer roles={['admin']}>
                        <div
                            className="article-summary-card__options"
                        >
                            <Dropdown
                                direction="left"
                                icon={<Icon name="ellipsis vertical" />}
                            >
                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        onClick={onAddClick}
                                    >
                                        <Icon name="user" color="blue" />
                                        Add Translators
                                    </Dropdown.Item>

                                    <Dropdown.Item
                                        onClick={onAddVerifiersClick}
                                    >
                                        <Icon
                                            color="green"
                                            name="check"
                                        // size="small"
                                        /> Add Approvers
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={onDeleteClick}
                                    >
                                        <Icon name="trash alternate outline" style={{ color: 'red' }} />
                                        Delete Video
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </RoleRenderer>
                )}
                <Card fluid>
                    <Card.Header className="article-summary-card__card_header" onClick={onTitleClick}>
                        {this.props.title || lang}
                        {!this.props.title && article.tts && '< TTS >'}
                        {!this.props.title && article.langName && `< ${article.langName} >`}
                    </Card.Header>
                    <Card.Content
                        style={{ borderTop: 'none' }}
                    >
                        {this.props.videoUrl && (
                            <Grid>
                                <Grid.Row style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                                    <Grid.Column width={18}>
                                        <ReactPlayer
                                            url={this.props.videoUrl}
                                            light={this.props.thumbnailUrl || false}
                                            playing={this.props.thumbnailUrl ? true : false}
                                            width="100%"
                                            height="auto"
                                            controls
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        )}
                        <Button color="blue" onClick={onTitleClick}>
                            {article.metrics.completed.total}% Completed
                        </Button>
                        <h3 style={{ marginTop: '1rem' }}>Voice translations</h3>
                        {article.metrics.speakersMetrics.map(speakerMetric => {
                            let translator = article.translators.find((t) => t.speakerNumber === speakerMetric.speaker.speakerNumber)
                            return (
                                <div key={`speaker-voice-metric-${speakerMetric.speaker.speakerNumber}`}>
                                    <div className="label-container">
                                        {this.renderUserAvatar(translator)}
                                        Speaker {speakerMetric.speaker.speakerNumber} ( {speakerMetric.speaker.speakerGender} )
                                    </div>
                                    {translator && speakerMetric.progress !== 100 ? (
                                        <div>
                                            <div className="label-container">
                                                {translator.invitationStatus === 'accepted' ?
                                                    this.renderTranslationStatus(speakerMetric.progress)
                                                    : this.renderInvitationLabel(translator ? translator.invitationStatus : 'pending')}
                                            </div>
                                            {translator.invitationStatus === 'accepted' && speakerMetric.progress !== 100 && (
                                                <React.Fragment>
                                                    <p>
                                                        Will complete on:
                                                    </p>
                                                    <p>
                                                        {translator && translator.finishDate ? moment(translator.finishDate).format('YYYY-MM-DD') : 'Unkown yet'}
                                                    </p>
                                                </React.Fragment>
                                            )}
                                        </div>
                                    ) : (
                                            <Label color={speakerMetric.progress === 100 ? 'green' : 'purple'}>
                                                {speakerMetric.progress === 100 ? 'Completed' : 'Unassiged'}
                                            </Label>
                                        )}
                                    {speakerMetric.progres === 100 && (
                                        <Label color={speakerMetric.progress === 100 ? 'green' : 'purple'}>
                                            {speakerMetric.progress === 100 ? 'Completed' : 'Unassiged'}
                                        </Label>
                                    )}
                                    <Progress progress indicating percent={speakerMetric.progress} style={{ marginTop: '0.5rem' }} />
                                </div>
                            )
                        })}

                        <h3 style={{ marginTop: '1rem' }}>Text translations</h3>
                        <div className="label-container">
                            {article.textTranslators.length > 0 ? this.renderUserAvatar(article.textTranslators[0]) : null}
                        </div>
                        <Progress progress indicating percent={this.getTextPercentage()} style={{ marginTop: '0.5rem' }} />

                        {article.verifiers && article.verifiers.length > 0 && (
                            <React.Fragment>
                                <h3 style={{ marginTop: '1rem' }}>Approvers</h3>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {article.verifiers.map(this.renderUserAvatar)}
                                </div>
                            </React.Fragment>
                        )}
                    </Card.Content>
                </Card>
            </div>
        )
    }
}

ArticleSummaryCard.defaultProps = {
    onDeleteClick: () => { },
    onTitleClick: () => { },
    onAddClick: () => { },
}