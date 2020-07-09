import React from "react";
import { connect } from "react-redux";

import { Link, withRouter } from "react-router-dom";
import { Grid, Button, Icon, Popup, Label } from "semantic-ui-react";

import routes from "../../../../shared/routes";

import ArticleSummaryCard from "../../../../shared/components/ArticleSummaryCard";
import LoaderComponent from "../../../../shared/components/LoaderComponent";
import DeleteTranslationModal from "./DeleteTranslationModal";
import AssignUsersSpeakersModal from "../../../../shared/components/AssignUsersSpeakersModal";

import * as videoActions from "../modules/actions";
import * as organizationActions from "../../../../actions/organization";

import {
  getUsersByRoles,
  displayArticleLanguage,
} from "../../../../shared/utils/helpers";
import AddMultipleHumanVoiceModal from "../../../../shared/components/AddMultipleHumanVoiceModal/index";
import DeleteBackgroundMusicModal from "./DeleteBackgroundMusicModal";
import RoleRenderer from "../../../../shared/containers/RoleRenderer";
import websockets from "../../../../websockets";
import AssignReviewUsers from "../../../../shared/components/AssignReviewUsers";
import VideoCard from "../../../../shared/components/VideoCard";
import { ARTICLE_STAGES } from "../../../../shared/constants";

function countGender(speakers, gender) {
  return speakers.filter(
    (s) => s.speakerGender.toLowerCase() === gender.toLowerCase()
  ).length;
}

class Translation extends React.Component {
  state = {
    selectedArticle: null,
    assignVideoProjectLeaderModalVisible: false,
    deleteArticleModalVisible: false,
    deleteBackgroundMusicModalVisible: false,
    assignUsersModalVisible: false,
    assignVerifiersModalVisible: false,
    assignProjectLeaderModelVisible: false,
  };

  componentWillMount = () => {
    const { videoId } = this.props.match.params;
    this.props.fetchUsers(this.props.organization._id);
    this.props.fetchSigleTranslatedArticle(videoId, {
      stage: this.state.activeFilter,
    });
    this.props.fetchTranslationsCount(videoId);
    this.initSocketSub();
  };

  componentWillUnmount = () => {
    websockets.unsubscribeFromEvent(
      websockets.websocketsEvents.EXTRACT_VIDEO_BACKGROUND_MUSIC_FINISH
    );
  };

  initSocketSub = () => {
    this.socketSub = websockets.subscribeToEvent(
      websockets.websocketsEvents.EXTRACT_VIDEO_BACKGROUND_MUSIC_FINISH,
      (data) => {
        console.log("got socket data", data);
        const { videoId } = this.props.match.params;
        this.props.fetchSigleTranslatedArticle(videoId);
      }
    );
  };

  getTranslators = () => {
    return getUsersByRoles(
      this.props.organizationUsers,
      this.props.organization,
      [
        "admin",
        "project_leader",
        "owner",
        "translate",
        "voice_over_artist",
        "translate_text",
        "approve_translations",
      ]
    );
  };

  getVerifiers = () => {
    return getUsersByRoles(
      this.props.organizationUsers,
      this.props.organization,
      [
        "admin",
        "project_leader",
        "owner",
        "translate",
        "voice_over_artist",
        "translate_text",
        "approve_translations",
      ]
    );
  };

  getProjectLeaders = () => {
    const { organizationUsers } = this.props;
    const { selectedArticle } = this.state;
    if (
      !selectedArticle ||
      !selectedArticle.projectLeaders ||
      !organizationUsers
    )
      return null;

    return organizationUsers.filter(
      (u) => selectedArticle.projectLeaders.indexOf(u._id) !== -1
    );
  };

  isAdmin = () => {};

  deleteSelectedArticle = () => {
    const { videoId } = this.props.match.params;
    this.props.deleteArticle(this.state.selectedArticle._id, videoId);
    this.setState({ deleteArticle: null, deleteArticleModalVisible: false });
  };

  onUploadBackgroundMusic = (e, data) => {
    const file = e.target.files[0];
    const { singleTranslatedArticle } = this.props;
    this.props.uploadBackgroundMusic(singleTranslatedArticle.video._id, file);
  };

  onSaveTranslators = (translators, textTranslators) => {
    this.setState({ assignUsersModalVisible: false });
    this.props.updateTranslatorsV2(
      this.state.selectedArticle._id,
      translators.filter((t) => t.user),
      textTranslators.filter((t) => t)
    );
  };

  onSaveVerifiers = (verifiers) => {
    this.setState({ assignVerifiersModalVisible: false });
    this.props.updateVerifiers(this.state.selectedArticle._id, verifiers);
  };

  onSaveProjectLeaders = (projectLeaders) => {
    this.setState({ assignProjectLeaderModelVisible: false });
    this.props.updateProjectLeaders(
      this.state.selectedArticle._id,
      projectLeaders
    );
  };

  onSaveVideoProjectLeaders = (projectLeaders) => {
    const { selectedVideo } = this.state;
    this.setState({ assignVideoProjectLeaderModalVisible: false, selectedVideo: null });
    this.props.updateVideoProjectLeaders(selectedVideo._id, projectLeaders)
  };

  onDeleteArticleClick = (article) => {
    this.setState({
      selectedArticle: article,
      deleteArticleModalVisible: true,
    });
  };

  onAddClick = (article) => {
    this.props.fetchUsers(this.props.organization._id);
    this.setState({ selectedArticle: article, assignUsersModalVisible: true });
  };

  onAddProjectLeaderClick = (article) => {
    this.props.fetchUsers(this.props.organization._id);
    this.setState({
      selectedArticle: article,
      assignProjectLeaderModelVisible: true,
    });
  };

  onAddVerifiersClick = (article) => {
    this.props.fetchUsers(this.props.organization._id);
    this.setState({
      selectedArticle: article,
      assignVerifiersModalVisible: true,
    });
  };

  onDeleteBackgroundMusic = () => {
    this.setState({ deleteBackgroundMusicModalVisible: false });
    this.props.deleteVideoBackgroundMusic(
      this.props.singleTranslatedArticle.video._id
    );
  };

  onDeleteBackgroundMusicClick = () => {
    this.setState({ deleteBackgroundMusicModalVisible: true });
  };

  onResendEmail = (userRole, articleId, userId) => {
    if (userRole === "verifier") {
      this.props.resendEmailToArticleVerifiers(articleId, userId);
    } else if (userRole === "reviewer") {
      // this.props.resendEmailToReviewer(articleId, userId);
    }
  };

  getTranslationArticleUrl = (articleId, langCode, langName) => {
    const parts = [];
    if (langCode) {
      parts.push(`lang=${langCode}`);
    }
    if (langName) {
      parts.push(`langName=${langName}`);
    }

    const url = `${routes.translationArticle(articleId)}?${parts.join("&")}`;
    return url;
  };

  onAddHumanVoice = (data) => {
    const { video } = this.props.singleTranslatedArticle;
    this.props.setAddMultipleHumanVoiceModalVisible(false);
    this.props.generateTranslatableArticles(video._id, video.article, data);
  };

  onTabChange = (tab) => {
    this.props.setTranslatedArticleActiveTab(tab.value);
    this.props.setTranslatedArticleStageFilter(tab.filters);
    setTimeout(() => {
      const { videoId } = this.props.match.params;
      this.props.fetchSigleTranslatedArticle(videoId, { softLoad: true });
    });
  };
  renderDeleteArticleModal = () => (
    <DeleteTranslationModal
      open={this.state.deleteArticleModalVisible}
      onClose={() =>
        this.setState({
          deleteArticleModalVisible: false,
          selectedArticle: null,
        })
      }
      onConfirm={this.deleteSelectedArticle}
    />
  );

  renderDeleteBackgroundMusic = () => (
    <DeleteBackgroundMusicModal
      open={this.state.deleteBackgroundMusicModalVisible}
      onClose={() =>
        this.setState({ deleteBackgroundMusicModalVisible: false })
      }
      onConfirm={this.onDeleteBackgroundMusic}
    />
  );

  _renderAddHumanVoiceModal() {
    const users = this.getTranslators();
    const verifiers = this.getVerifiers();
    const { singleTranslatedArticle } = this.props;
    if (!singleTranslatedArticle) return null;
    const disabledLanguages =
      this.props.singleTranslatedArticle &&
      this.props.singleTranslatedArticle.articles
        ? this.props.singleTranslatedArticle.articles.map((a) => a.langCode)
        : [];
    console.log("disabled are", disabledLanguages);
    return (
      <AddMultipleHumanVoiceModal
        open={this.props.addMultipleHumanVoiceModalVisible}
        onClose={() => this.props.setAddMultipleHumanVoiceModalVisible(false)}
        users={users}
        verifiers={verifiers}
        speakersProfile={
          singleTranslatedArticle && singleTranslatedArticle.originalArticle
            ? singleTranslatedArticle.originalArticle.speakersProfile
            : []
        }
        disabledLanguages={disabledLanguages}
        skippable={false}
        onSubmit={(data) => this.onAddHumanVoice(data)}
      />
    );
  }

  renderAssignUsersModal = () => {
    const users = this.getTranslators();

    return (
      <AssignUsersSpeakersModal
        open={this.state.assignUsersModalVisible}
        article={this.state.selectedArticle}
        users={users}
        onClose={() => this.setState({ assignUsersModalVisible: false })}
        onSave={this.onSaveTranslators}
      />
    );
  };

  renderAssignVerifiers = () => (
    <AssignReviewUsers
      showResendEmail
      title="Assign Approvers"
      open={this.state.assignVerifiersModalVisible}
      value={
        this.state.selectedArticle && this.state.selectedArticle.verifiers
          ? this.state.selectedArticle.verifiers
          : []
      }
      users={this.getVerifiers()}
      onClose={() =>
        this.setState({
          assignVerifiersModalVisible: false,
          selectedArticle: null,
        })
      }
      onSave={this.onSaveVerifiers}
      onResendEmail={(userId) =>
        this.onResendEmail("verifier", this.state.selectedArticle._id, userId)
      }
    />
  );

  renderAssignProjectLeader = () => (
    <AssignReviewUsers
      title="Assign Project Leader"
      single
      open={this.state.assignProjectLeaderModelVisible}
      value={
        this.state.selectedArticle && this.state.selectedArticle.projectLeaders
          ? this.state.selectedArticle.projectLeaders.map((l) => l.user)
          : []
      }
      users={this.props.organizationUsers}
      onClose={() =>
        this.setState({
          assignProjectLeaderModelVisible: false,
          selectedArticle: null,
        })
      }
      onSave={this.onSaveProjectLeaders}
      // onResendEmail={(userId) =>
      //   this.onResendEmail("verifier", this.state.selectedArticle._id, userId)
      // }
    />
  );

  renderAssignVideoProjectLeader = () => (
    <AssignReviewUsers
      title="Assign Project Leader"
      single
      open={this.state.assignVideoProjectLeaderModalVisible}
      value={
        this.state.selectedVideo && this.state.selectedVideo.projectLeaders
          ? this.state.selectedVideo.projectLeaders
          : []
      }
      users={this.props.organizationUsers}
      onClose={() =>
        this.setState({
          assignVideoProjectLeaderModalVisible: false,
          selectedVideo: null,
        })
      }
      onSave={this.onSaveVideoProjectLeaders}
    />
  );

  render() {
    const { singleTranslatedArticle, translationsCount } = this.props;
    const organizationUsers = this.props.organizationUsers;
    const tabs = [
      {
        title: "All",
        value: "all",
        filters: [],
      },
      {
        title: `Text Translation (${translationsCount.text_translation})`,
        value: "text_translation",
        filters: [ARTICLE_STAGES.TEXT_TRANSLATION],
      },
      {
        title: `Voice-over (${translationsCount.voice_over_translation})`,
        value: "voice-over",
        filters: [ARTICLE_STAGES.VOICE_OVER_TRANSLATION],
      },
      {
        title: `Approvals (${
          (translationsCount.text_translation_done || 0) +
          (translationsCount.voice_over_translation_done || 0)
        })`,
        value: "approvals",
        filters: [
          ARTICLE_STAGES.TEXT_TRANSLATION_DONE,
          ARTICLE_STAGES.VOICE_OVER_TRANSLATION_DONE,
        ],
      },
      {
        title: `Completed (${translationsCount.done})`,
        value: "completed",
        filters: [ARTICLE_STAGES.DONE],
      },
    ];

    return (
      <div>
        <div
          style={{
            color: "white",
            fontSize: "1.5rem",
            fontWeight: "bold",
            textTransform: "capitalize",
            backgroundColor: "#12181f",
            padding: "3rem",
            paddingBottom: this.props.extraContent ? 0 : "3rem",
            paddingTop: "4rem",
            marginLeft: "-1rem",
            marginRight: "-1rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Link to={routes.organziationTranslations()}>
            <Button
              basic
              circular
              inverted
              icon="arrow left"
              style={{ marginRight: 10 }}
            />
          </Link>

          {(singleTranslatedArticle && singleTranslatedArticle.video.title) ||
            ""}
        </div>
        <Grid
          style={{
            padding: "2rem",
            marginTop: "1rem",
          }}
        >
          <LoaderComponent
            active={this.props.videosLoading && singleTranslatedArticle}
          >
            {singleTranslatedArticle && (
              <Grid.Row
                key={`translated-article-container-${singleTranslatedArticle.video._id}`}
              >
                <Grid.Column width={4}>
                  <VideoCard
                    showOptions
                    options={[
                      {
                        content: (
                          <div>
                            <Icon name="plus" color="green" /> Assign Project Leader
                          </div>
                        ),
                        onClick: () => {
                          this.setState({
                            selectedVideo: singleTranslatedArticle.video,
                            assignVideoProjectLeaderModalVisible: true,
                          });
                        },
                      },
                    ]}
                    buttonTitle="Add Voiceover"
                    thumbnailUrl={singleTranslatedArticle.video.thumbnailUrl}
                    title={singleTranslatedArticle.video.title}
                    titleRoute={routes.organizationArticle(
                      singleTranslatedArticle.video.article
                    )}
                    url={singleTranslatedArticle.video.url}
                    onButtonClick={() => {
                      this.props.setAddMultipleHumanVoiceModalVisible(true);
                    }}
                  />

                  <div style={{ fontSize: 10 }}>
                    <p style={{ marginTop: "2rem", color: "#666666" }}>
                      Translated in:
                    </p>
                    <div>
                      {singleTranslatedArticle.articles.map((a) => (
                        <Label
                          circular
                          key={`translation-label-${a._id}`}
                          style={{
                            marginRight: 10,
                            marginBottom: 10,
                            fontSize: 10,
                            backgroundColor: "#d4e0ed",
                          }}
                        >
                          {displayArticleLanguage(a)}
                        </Label>
                      ))}
                    </div>

                    <p style={{ marginTop: "2rem", color: "#666666" }}>
                      No. of speakers:
                    </p>
                    <div>
                      <span style={{ marginRight: 10 }}>
                        <Icon name="user" style={{ opacity: 0.2 }} />{" "}
                        {countGender(
                          singleTranslatedArticle.originalArticle
                            .speakersProfile,
                          "female"
                        )}{" "}
                        Female
                      </span>

                      <span>
                        <Icon name="user" style={{ opacity: 0.2 }} />{" "}
                        {countGender(
                          singleTranslatedArticle.originalArticle
                            .speakersProfile,
                          "male"
                        )}{" "}
                        Male
                      </span>
                    </div>
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <RoleRenderer roles={["admin", "project_leader"]}>
                      <div style={{ fontSize: "0.7rem" }}>
                        <div>Background Music:</div>
                        {singleTranslatedArticle.video.backgroundMusicUrl && (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: 20,
                            }}
                          >
                            <React.Fragment>
                              <audio controls>
                                <source
                                  src={
                                    singleTranslatedArticle.video
                                      .backgroundMusicUrl
                                  }
                                />
                              </audio>
                              <Popup
                                content="Delete background music file"
                                trigger={
                                  <Icon
                                    name="delete"
                                    color="red"
                                    style={{
                                      marginLeft: 10,
                                      cursor: "pointer",
                                    }}
                                    // size="large"
                                    onClick={this.onDeleteBackgroundMusicClick}
                                  />
                                }
                              />
                            </React.Fragment>
                          </div>
                        )}
                        <input
                          accept="audio/*"
                          ref={(ref) => (this.backgroundMusicRef = ref)}
                          style={{ visibility: "hidden" }}
                          type="file"
                          onChange={this.onUploadBackgroundMusic}
                        />
                        <div
                          style={{
                            marginTop: 10,
                            width: "80%",
                            margin: "0 auto",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Popup
                            content="Upload background music audio"
                            trigger={
                              <Button
                                basic
                                circular
                                size="tiny"
                                icon="upload"
                                content="Upload"
                                labelPosition="right"
                                style={{ fontSize: "0.7rem" }}
                                onClick={() => this.backgroundMusicRef.click()}
                              />
                            }
                          />
                          <span>Or</span>
                          <Popup
                            content="Automatically extract background music from the video"
                            trigger={
                              <Button
                                primary
                                circular
                                loading={
                                  singleTranslatedArticle.video
                                    .extractBackgroundMusicLoading
                                }
                                disabled={
                                  singleTranslatedArticle.video
                                    .extractBackgroundMusicLoading
                                }
                                size="tiny"
                                // fluid
                                style={{ fontSize: "0.7rem" }}
                                onClick={() =>
                                  this.props.extractVideoBackgroundMusic(
                                    this.props.singleTranslatedArticle.video._id
                                  )
                                }
                              >
                                Automatically Import
                              </Button>
                            }
                          />
                        </div>
                      </div>
                    </RoleRenderer>
                  </div>
                </Grid.Column>
                <Grid.Column width={1}>
                  <div
                    style={{
                      border: "1px solid black",
                      opacity: 0.3,
                      height: "100%",
                      position: "absolute",
                      left: "60%",
                    }}
                  ></div>
                </Grid.Column>
                <Grid.Column width={11} style={{ marginTop: "-1.2rem" }}>
                  <Grid>
                    <Grid.Row style={{ padding: 20, paddingBottom: 0 }}>
                      <Grid.Column width={16}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          {tabs.map((tab) => (
                            <Button
                              key={`tab-item-${tab.value}`}
                              circular
                              style={{
                                fontWeight: "300",
                                padding: "0.5rem 1rem",
                                backgroundColor:
                                  this.props
                                    .singleTranslatedArticleActiveTab ===
                                  tab.value
                                    ? "#0e7ceb"
                                    : "transparent",
                                color:
                                  this.props
                                    .singleTranslatedArticleActiveTab ===
                                  tab.value
                                    ? "white"
                                    : "#666666",
                              }}
                              onClick={() => this.onTabChange(tab)}
                            >
                              {tab.title}
                            </Button>
                          ))}
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                    {singleTranslatedArticle.articles &&
                      singleTranslatedArticle.articles.length > 0 && (
                        <Grid.Row style={{ padding: 20 }}>
                          {singleTranslatedArticle.articles.map((article) => (
                            <Grid.Column
                              width={5}
                              key={`translated-article-article-${article._id}`}
                              style={{ marginBottom: 20 }}
                            >
                              <ArticleSummaryCard
                                showOptions
                                showTranslators
                                users={organizationUsers}
                                article={article}
                                title={displayArticleLanguage(article)}
                                // lang={isoLangs[article.langCode] ? isoLangs[article.langCode].name : article.langCode}
                                onAddClick={() => this.onAddClick(article)}
                                onTitleClick={() =>
                                  (window.location.href = routes.translationArticle(
                                    article._id
                                  ))
                                }
                                onDeleteClick={() =>
                                  this.onDeleteArticleClick(article)
                                }
                                onAddVerifiersClick={() =>
                                  this.onAddVerifiersClick(article)
                                }
                                onAddProjectLeaderClick={() =>
                                  this.onAddProjectLeaderClick(article)
                                }
                              />
                            </Grid.Column>
                          ))}
                        </Grid.Row>
                      )}
                  </Grid>
                </Grid.Column>
              </Grid.Row>
            )}
            {this.renderDeleteArticleModal()}
            {this.renderAssignUsersModal()}
            {this.renderAssignVerifiers()}
            {this._renderAddHumanVoiceModal()}
            {this.renderAssignProjectLeader()}
            {this.renderAssignVideoProjectLeader()}
            {this.renderDeleteBackgroundMusic()}
          </LoaderComponent>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = ({ organizationVideos, organization }) => ({
  singleTranslatedArticle: organizationVideos.singleTranslatedArticle,
  translationsCount: organizationVideos.translationsCount,
  singleTranslatedArticleActiveTab:
    organizationVideos.singleTranslatedArticleActiveTab,
  videosLoading: organizationVideos.videosLoading,
  organization: organization.organization,
  addHumanVoiceModalVisible: organizationVideos.addHumanVoiceModalVisible,
  organizationUsers: organization.users,
  addMultipleHumanVoiceModalVisible:
    organizationVideos.addMultipleHumanVoiceModalVisible,
});
const mapDispatchToProps = (dispatch) => ({
  setSelectedVideo: (video) => dispatch(videoActions.setSelectedVideo(video)),
  setTranslatedArticleStageFilter: (stages) =>
    dispatch(videoActions.setTranslatedArticleStageFilter(stages)),
  setTranslatedArticleActiveTab: (tab) =>
    dispatch(videoActions.setTranslatedArticleActiveTab(tab)),
  setAddHumanVoiceModalVisible: (visible) =>
    dispatch(videoActions.setAddHumanVoiceModalVisible(visible)),
  setAddMultipleHumanVoiceModalVisible: (visible) =>
    dispatch(videoActions.setAddMultipleHumanVoiceModalVisible(visible)),
  setCurrentPageNumber: (pageNumber) =>
    dispatch(videoActions.setCurrentPageNumber(pageNumber)),
  fetchTranslationsCount: (videoId) =>
    dispatch(videoActions.fetchTranslationsCount(videoId)),
  fetchSigleTranslatedArticle: (videoId, params) =>
    dispatch(videoActions.fetchSigleTranslatedArticle(videoId, params)),
  uploadBackgroundMusic: (videoId, blob) =>
    dispatch(videoActions.uploadBackgroundMusic(videoId, blob)),
  deleteArticle: (articleId, videoId) =>
    dispatch(videoActions.deleteArticle(articleId, videoId)),
  setSearchFilter: (filter) => dispatch(videoActions.setSearchFilter(filter)),
  fetchUsers: (organizationId) =>
    dispatch(organizationActions.fetchUsers(organizationId)),
  updateTranslators: (articleId, translators) =>
    dispatch(videoActions.updateTranslators(articleId, translators)),
  updateVerifiers: (articleId, verifiers) =>
    dispatch(videoActions.updateVerifiers(articleId, verifiers)),
  updateVideoProjectLeaders: (videoId, projectLeaders) =>
    dispatch(videoActions.updateVideoProjectLeaders(videoId, projectLeaders)),
  updateProjectLeaders: (articleId, projectLeaders) =>
    dispatch(videoActions.updateProjectLeaders(articleId, projectLeaders)),
  updateTranslatorsV2: (articleId, translators, textTranslators) =>
    dispatch(
      videoActions.updateTranslatorsV2(articleId, translators, textTranslators)
    ),
  resendEmailToArticleVerifiers: (articleId, userId) =>
    dispatch(videoActions.resendEmailToArticleVerifiers(articleId, userId)),
  generateTranslatableArticle: (
    originalArticleId,
    langCode,
    langName,
    translators,
    verifiers
  ) =>
    dispatch(
      videoActions.generateTranslatableArticle(
        originalArticleId,
        langCode,
        langName,
        translators,
        verifiers,
        "single"
      )
    ),
  deleteVideoBackgroundMusic: (videoId) =>
    dispatch(videoActions.deleteVideoBackgroundMusic(videoId)),
  extractVideoBackgroundMusic: (videoId) =>
    dispatch(videoActions.extractVideoBackgroundMusic(videoId)),
  generateTranslatableArticles: (videoId, originalArticleId, data) =>
    dispatch(
      videoActions.generateTranslatableArticles(
        videoId,
        originalArticleId,
        data,
        "multi"
      )
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Translation));
