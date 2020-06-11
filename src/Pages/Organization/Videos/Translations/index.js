import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Grid, Button, Input, Icon } from "semantic-ui-react";
import querystring from "query-string";

import LoaderComponent from "../../../../shared/components/LoaderComponent";
import { isoLangs, supportedLangs } from "../../../../shared/constants/langs";
import routes from "../../../../shared/routes";

import * as videoActions from "../modules/actions";
import * as organizationActions from "../../../../actions/organization";
import AddHumanVoiceModal from "../../../../shared/components/AddHumanVoiceModal";
import VideosTabs from "../VideosTabs";
import RoleRenderer from "../../../../shared/containers/RoleRenderer";
import {
  debounce,
  getUsersByRoles,
  displayArticleLanguage,
} from "../../../../shared/utils/helpers";
import ClearPagination from "../../../../shared/components/ClearPagination";
import VideoCard from "../../../../shared/components/VideoCard";
import TranslateOnWhatsappDropdown from "./TranslateOnWhatsappDropdown";

function Separator() {
    return (
        <span style={{ display: 'inline-block', margin: '0 10px', color: 'gray' }} >|</span>
    )
}

class Translated extends React.Component {
  constructor(props) {
    super(props);
    this.debouncedSearch = debounce((searchTerm) => {
      this.props.setCurrentPageNumber(1);
      this.props.fetchTranslatedArticles();
    }, 500);
  }
  componentWillMount = () => {
    this.props.setSearchFilter("");
    this.props.setCurrentPageNumber(1);
    this.props.fetchTranslatedArticles();
    this.props.fetchUsers(this.props.organization._id);
  };

  isVideoFocused = (video) => {
    const videoId = querystring.parse(window.location.search).video;
    return videoId && videoId === video._id;
  };

  getLanguage = (langCode) => {
    const fromOthers = isoLangs[langCode];
    if (fromOthers) return fromOthers.name;
    const fromSupported = supportedLangs.find((l) => l.code === langCode);
    if (fromSupported) return fromSupported.name;
    return langCode;
  };

  onPageChange = (e, { activePage }) => {
    this.props.setCurrentPageNumber(activePage);
    this.props.fetchTranslatedArticles(this.props.organization._id, activePage);
  };

  onSearchChange = (searchTerm) => {
    this.props.setSearchFilter(searchTerm);
    this.debouncedSearch();
  };

  onAddHumanVoice = (langCode, langName, translators, verifiers) => {
    const { video } = this.props.selectedVideo;
    this.props.setAddHumanVoiceModalVisible(false);
    this.props.generateTranslatableArticle(
      video.article,
      langCode,
      langName,
      translators,
      verifiers
    );
  };

  getTranslators = () => {
    return getUsersByRoles(
      this.props.organizationUsers,
      this.props.organization,
      ["translate", "admin", "owner"]
    );
  };

  getVerifiers = () => {
    return getUsersByRoles(
      this.props.organizationUsers,
      this.props.organization,
      ["translate", "review", "admin", "owner"]
    );
  };

  renderPagination = () => (
    <ClearPagination
      style={{ marginLeft: 20 }}
      activePage={this.props.currentPageNumber}
      onPageChange={this.onPageChange}
      totalPages={this.props.totalPagesCount}
    />
  );

  _renderAddHumanVoiceModal() {
    const users = this.getTranslators();
    const verifiers = this.getVerifiers();
    const { selectedVideo } = this.props;
    if (!selectedVideo) return null;
    const disabledLanguages =
      this.props.selectedVideo && this.props.selectedVideo.articles
        ? this.props.selectedVideo.articles.map((a) => a.langCode)
        : [];
    console.log("disabled are", disabledLanguages);
    return (
      <AddHumanVoiceModal
        open={this.props.addHumanVoiceModalVisible}
        onClose={() => this.props.setAddHumanVoiceModalVisible(false)}
        users={users}
        verifiers={verifiers}
        speakersProfile={
          selectedVideo && selectedVideo.originalArticle
            ? selectedVideo.originalArticle.speakersProfile
            : []
        }
        disabledLanguages={disabledLanguages}
        skippable={false}
        onSubmit={(langCode, langName, translators, verifiers) =>
          this.onAddHumanVoice(langCode, langName, translators, verifiers)
        }
      />
    );
  }

  render() {
    return (
      <div>
        <VideosTabs />
        <Grid style={{ margin: "1rem" }}>
          <RoleRenderer roles={["admin", "translate"]}>
            <Grid.Row style={{ marginBottom: 20 }}>
              <Grid.Column width={5}>
                <Input
                  fluid
                  style={{ height: "100%" }}
                  type="text"
                  icon="search"
                  iconPosition="left"
                  input={
                    <input
                      type="text"
                      style={{
                        borderRadius: 20,
                        color: "#999999",
                        backgroundColor: "#d4e0ed",
                      }}
                    />
                  }
                  placeholder="Search by file name, video name, etc"
                  value={this.props.searchFilter}
                  onChange={(e, { value }) => this.onSearchChange(value)}
                />
              </Grid.Column>
              <Grid.Column width={11}>
                <div className="pull-right">{this.renderPagination()}</div>
              </Grid.Column>
            </Grid.Row>
            <LoaderComponent active={this.props.videosLoading}>
              <Grid.Row>
                {this.props.translatedArticles.map((translatedArticle) => (
                  <Grid.Column
                    width={4}
                    key={`translated-article-container-${translatedArticle.video._id}`}
                  >
                    <VideoCard
                      rounded
                      url={
                        translatedArticle.video.compressedVideoUrl ||
                        translatedArticle.video.url
                      }
                      thumbnailUrl={translatedArticle.video.thumbnailUrl}
                      duration={translatedArticle.video.duration}
                      title={translatedArticle.video.title}
                      titleRoute={routes.organziationTranslationMetrics(
                        translatedArticle.video._id
                      )}
                      buttonTitle="Add Voiceover"
                      onButtonClick={() => {
                        this.props.setSelectedVideo(translatedArticle);
                        this.props.setAddHumanVoiceModalVisible(true);
                      }}
                      showWhatsappIcon
                      whatsappIconContent={
                        <TranslateOnWhatsappDropdown
                          videoId={translatedArticle.video._id}
                        />
                      }
                      focused={this.isVideoFocused(translatedArticle.video)}
                      extra={
                        <div
                          style={{
                            marginLeft: 15,
                            marginTop: 0,
                            color: "#999999",
                            fontSize: 10,
                          }}
                        >
                          <p>Edit translated versions:</p>
                          <p style={{ wordBreak: "break-word" }}>
                            {/* routes.translationArticle(singleTranslatedArticle.video.article) + `?lang=${article.langCode}` */}
                            {translatedArticle.articles.map(
                              (article, index) => (
                                <a
                                  key={`translated-article-adadad-${article._id}`}
                                  href={routes.translationArticle(article._id)}
                                  style={{ color: "#999999" }}
                                >
                                  <Button
                                    size="mini"
                                    circular
                                    style={{
                                      marginRight: 10,
                                      marginBottom: 10,
                                    }}
                                  >
                                    {displayArticleLanguage(article)}
                                  </Button>
                                </a>
                              )
                            )}
                          </p>
                        </div>
                      }
                    />
                  </Grid.Column>
                ))}
              </Grid.Row>

              {this._renderAddHumanVoiceModal()}
            </LoaderComponent>
          </RoleRenderer>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = ({
  organization,
  authentication,
  organizationVideos,
}) => ({
  organization: organization.organization,
  user: authentication.user,
  translatedArticles: organizationVideos.translatedArticles,
  videos: organizationVideos.videos,
  languageFilter: organizationVideos.languageFilter,
  videosLoading: organizationVideos.videosLoading,
  totalPagesCount: organizationVideos.totalPagesCount,
  selectedVideo: organizationVideos.selectedVideo,
  addHumanVoiceModalVisible: organizationVideos.addHumanVoiceModalVisible,
  currentPageNumber: organizationVideos.currentPageNumber,
  searchFilter: organizationVideos.searchFilter,
  organizationUsers: organization.users,
});
const mapDispatchToProps = (dispatch) => ({
  setSelectedVideo: (video) => dispatch(videoActions.setSelectedVideo(video)),
  setAddHumanVoiceModalVisible: (visible) =>
    dispatch(videoActions.setAddHumanVoiceModalVisible(visible)),
  setCurrentPageNumber: (pageNumber) =>
    dispatch(videoActions.setCurrentPageNumber(pageNumber)),
  fetchTranslatedArticles: () =>
    dispatch(videoActions.fetchTranslatedArticles()),
  deleteArticle: (articleId) => dispatch(videoActions.deleteArticle(articleId)),
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
        "multi"
      )
    ),
  fetchUsers: (organizationId) =>
    dispatch(organizationActions.fetchUsers(organizationId)),
  setSearchFilter: (filter) => dispatch(videoActions.setSearchFilter(filter)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Translated));
