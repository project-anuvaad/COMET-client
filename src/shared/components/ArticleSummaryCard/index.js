import React from "react";
import {
  Card,
  Button,
  Progress,
  Icon,
  Grid,
  Popup,
  Label,
  Dropdown,
} from "semantic-ui-react";
import "./style.scss";
import RoleRenderer from "../../containers/RoleRenderer";
import ReactPlayer from "react-player";
import Avatar from "react-avatar";
import moment from "moment";
import { ARTICLE_STAGES, ARTICLE_STAGES_TITLES } from "../../constants";
import { getUserName, getUserNamePreview } from "../../utils/helpers";
import StagesProcess from "./StagesProcess";

export default class ArticleSummaryCard extends React.Component {
  hasContributors = () => {
    const { article, users } = this.props;
    if (!article || !users) return false;
    if (
      (article.textTranslators && article.textTranslators.length > 0) ||
      (article.translators && article.translators.length > 0) ||
      (article.verifiers && article.verifiers.length > 0)
    ) {
      return true;
    }
    return false;
  };

  renderUserAvatar = (translator, extra) => {
    const { users } = this.props;
    if (!translator || !users) return null;
    if (typeof translator === "string") {
      translator = users.find((u) => u._id === translator);
    } else {
      translator = users.find((u) => u._id === translator.user);
    }
    if (!translator) return null;
    const translatorName = translator.firstname
      ? `${translator.firstname} ${translator.lastname || ""}`
      : translator.email;

    return (
      <Popup
        content={
          <div>
            <div style={{ color: "#333333", fontSize: 12 }}>
              {translatorName}
            </div>
            <small style={{ color: "#666666", fontSize: 10 }}>{extra}</small>
          </div>
        }
        trigger={
          <span>
            <Avatar
              round
              size={25}
              name={translatorName}
              style={{ margin: "5px 5px", display: "inline-block" }}
            />
          </span>
        }
      />
    );
  };

  renderInvitationLabel = (invitationStatus) => {
    let statusColor = "green";
    if (invitationStatus === "pending") {
      statusColor = "orange";
    } else if (invitationStatus === "accepted") {
      statusColor = "green";
    } else {
      statusColor = "red";
    }

    return (
      <Label color={statusColor} className="stage-badge">
        Invitation: {invitationStatus}
      </Label>
    );
  };

  renderTranslationStatus = (progress) => {
    return (
      <Label
        color={progress === 100 ? "green" : "blue"}
        className="stage-badge"
      >
        {progress === 100 ? <span>Completed</span> : <span>Pending</span>}
      </Label>
    );
  };

  getTextPercentage = () => {
    const { article } = this.props;
    if (!article.stage) {
      return article.metrics.completed.text;
    }
    if (article.stage === "text_translation") {
      return 0;
    }
    return 100;
  };
  render() {
    const {
      article,
      lang,
      onTitleClick,
      onDeleteClick,
      onAddClick,
      onAddVerifiersClick,
      users,
    } = this.props;

    return (
      <div className="article-summary-card">
        <Card fluid>
          <Card.Header
            className="article-summary-card__card_header"
            onClick={onTitleClick}
          >
            <h4>
              {this.props.title || lang}
              {!this.props.title && article.tts && "< TTS >"}
              {!this.props.title &&
                article.langName &&
                `< ${article.langName} >`}
              {this.props.showOptions && (
                <RoleRenderer roles={["admin"]}>
                  <div className="article-summary-card__options">
                    <Dropdown
                      direction="left"
                      icon={
                        <Icon
                          color="black"
                          size="small"
                          name="ellipsis vertical"
                        />
                      }
                    >
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={onDeleteClick}>
                          <Icon
                            name="trash alternate outline"
                            style={{ color: "red" }}
                          />
                          Delete Video
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </RoleRenderer>
              )}
            </h4>
            {article.createdBy &&
              users &&
              (function () {
                const user = users.find((u) => u._id === article.createdBy);
                if (!user) return null;
                return (
                  <p style={{ color: "#666666", fontSize: 12 }}>
                    By {getUserNamePreview(user)}{" "}
                    <small style={{ color: "#999999" }}>(Owner)</small>
                  </p>
                );
              })()}
          </Card.Header>
          <Card.Content style={{ borderTop: "none" }}>
            {this.props.videoUrl && (
              <Grid>
                <Grid.Row
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <Grid.Column width={18}>
                    <ReactPlayer
                      url={this.props.videoUrl}
                      light={this.props.thumbnailUrl || false}
                      playing={this.props.thumbnailUrl ? true : false}
                      width="100%"
                      height="300px"
                      controls
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            )}
            {article.stage && (
              <React.Fragment>
                <div>
                  {article.stage === ARTICLE_STAGES.DONE ? (
                    <Progress
                      progress
                      size="small"
                      indicating
                      percent={100}
                      style={{ marginTop: "0.5rem", marginBottom: 5 }}
                    />
                  ) : null}
                  {article.stage === ARTICLE_STAGES.TEXT_TRANSLATION ||
                  article.stage === ARTICLE_STAGES.TEXT_TRANSLATION_DONE ? (
                    <Progress
                      progress
                      size="small"
                      indicating
                      percent={this.getTextPercentage()}
                      style={{ marginTop: "0.5rem", marginBottom: 5 }}
                    />
                  ) : null}
                  {article.stage === ARTICLE_STAGES.VOICE_OVER_TRANSLATION ||
                  article.stage ===
                    ARTICLE_STAGES.VOICE_OVER_TRANSLATION_DONE ? (
                    <div>
                      <Progress
                        progress
                        size="small"
                        indicating
                        percent={parseInt(
                          article.metrics.speakersMetrics.reduce(
                            (a, m) => a + m.progress,
                            0
                          ) / article.metrics.speakersMetrics.length
                        )}
                        style={{ marginTop: "0.5rem", marginBottom: 5 }}
                      />
                      {/* {article.metrics.speakersMetrics.map((speakerMetric) => {
                        let translator = article.translators.find(
                          (t) =>
                            t.speakerNumber ===
                            speakerMetric.speaker.speakerNumber
                        );
                        return (
                          <div
                            key={`speaker-voice-metric-${speakerMetric.speaker.speakerNumber}`}
                          >
                            <div className="label-container">
                              {this.renderUserAvatar(translator)}
                              Speaker {
                                speakerMetric.speaker.speakerNumber
                              } ( {speakerMetric.speaker.speakerGender} )
                            </div>
                            {translator && speakerMetric.progress !== 100 ? (
                              <div>
                                <div className="label-container">
                                  {translator.invitationStatus === "accepted"
                                    ? this.renderTranslationStatus(
                                        speakerMetric.progress
                                      )
                                    : this.renderInvitationLabel(
                                        translator
                                          ? translator.invitationStatus
                                          : "pending"
                                      )}
                                </div>
                                {translator.invitationStatus === "accepted" &&
                                  speakerMetric.progress !== 100 && (
                                    <React.Fragment>
                                      <p>Will complete on:</p>
                                      <p>
                                        {translator && translator.finishDate
                                          ? moment(
                                              translator.finishDate
                                            ).format("YYYY-MM-DD")
                                          : "Unkown yet"}
                                      </p>
                                    </React.Fragment>
                                  )}
                              </div>
                            ) : (
                              <Label
                                color={
                                  speakerMetric.progress === 100
                                    ? "green"
                                    : "purple"
                                }
                              >
                                {speakerMetric.progress === 100
                                  ? "Completed"
                                  : "Unassiged"}
                              </Label>
                            )}
                            {speakerMetric.progres === 100 && (
                              <Label
                                color={
                                  speakerMetric.progress === 100
                                    ? "green"
                                    : "purple"
                                }
                              >
                                {speakerMetric.progress === 100
                                  ? "Completed"
                                  : "Unassiged"}
                              </Label>
                            )}
                            <Progress
                              progress
                              indicating
                              percent={speakerMetric.progress}
                              style={{ marginTop: "0.5rem" }}
                            />
                          </div>
                        );
                      })} */}
                    </div>
                  ) : null}
                  <div style={{ marginBottom: 10 }}>
                    {article.stage === ARTICLE_STAGES.DONE ? (
                      <span>Completed</span>
                    ) : (
                      <React.Fragment>
                        <span style={{ marginRight: 5 }}>Next step:</span>
                        <span style={{ marginRight: 5 }}>
                          {ARTICLE_STAGES_TITLES[article.stage]}
                        </span>
                        <Popup
                          position="bottom right"
                          trigger={<Icon name="question circle outline" />}
                          content={
                            <StagesProcess
                              stages={ARTICLE_STAGES}
                              activeStage={article.stage}
                            />
                          }
                        />
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </React.Fragment>
            )}
            {this.hasContributors() ? (
              <div>
                <div style={{ marginBottom: 10 }}>Contributors:</div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Text Translators */}
                  {article.textTranslators &&
                    article.textTranslators.length > 0 &&
                    article.textTranslators.map((translator, index) => (
                      <span key={`translator-${translator.user}`}>
                        {this.renderUserAvatar(translator, "Translator")}
                      </span>
                    ))}
                  {article.textTranslators &&
                    article.textTranslators.length > 0 &&
                    ((article.translators && article.translators.length > 0) ||
                      (article.verifiers && article.verifiers.length > 0)) && (
                      <span
                        style={{
                          width: 1,
                          height: "2rem",
                          border: "1px solid #979797",
                          opacity: 0.3,
                        }}
                      ></span>
                    )}
                  {article.translators &&
                    article.translators.length > 0 &&
                    article.translators.map((translator) => (
                      <span key={`voice-over-artist-${translator.user}`}>
                        {this.renderUserAvatar(
                          translator,
                          <span>
                            Voice-over artist
                            {/* <div>Invitation: {translator.invitationStatus || 'pending'}</div> */}
                          </span>
                        )}
                      </span>
                    ))}
                  {article.translators &&
                    article.translators.length > 0 &&
                    article.verifiers &&
                    article.verifiers.length > 0 && (
                      <span
                        style={{
                          width: 1,
                          height: "2rem",
                          border: "1px solid #979797",
                          opacity: 0.3,
                        }}
                      ></span>
                    )}
                  {article.verifiers &&
                    article.verifiers.length > 0 &&
                    article.verifiers.map((verifier) => (
                      <span key={`approver-${verifier}`}>
                        {this.renderUserAvatar(verifier, "Approver")}
                      </span>
                    ))}
                  {/* Separator if there's text translators and  */}
                </div>
              </div>
            ) : (
              <span style={{ color: "red" }}>
                No contributor has been assgined yet.
              </span>
            )}

            {this.props.showOptions && (
              <RoleRenderer roles={["admin"]}>
                <div style={{ marginTop: 20 }}>
                  <Dropdown
                    style={{ zIndex: 1 }}
                    // direction="left"
                    pointing="bottom right"
                    icon=""
                    trigger={
                      <Button circular basic primary>
                        Assign Contributors <Icon name="chevron down" style={{ marginLeft: 10 }} />
                      </Button>
                    }
                  >
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={onAddClick}>
                        <Icon name="user" color="blue" />
                        Assign Translators
                      </Dropdown.Item>

                      <Dropdown.Item onClick={onAddVerifiersClick}>
                        <Icon
                          color="green"
                          name="check"
                          // size="small"
                        />{" "}
                        Assign Approvers
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </RoleRenderer>
            )}
          </Card.Content>
        </Card>
      </div>
    );
  }
}

ArticleSummaryCard.defaultProps = {
  onDeleteClick: () => {},
  onTitleClick: () => {},
  onAddClick: () => {},
};
