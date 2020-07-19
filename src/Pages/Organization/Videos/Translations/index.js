import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Grid, Button, Input, Icon } from 'semantic-ui-react';
import querystring from 'query-string';

import LoaderComponent from '../../../../shared/components/LoaderComponent';
import { isoLangs, supportedLangs } from '../../../../shared/constants/langs';
import routes from '../../../../shared/routes';

import * as videoActions from '../modules/actions';
import * as organizationActions from '../../../../actions/organization';
import AddMultipleHumanVoiceModal from '../../../../shared/components/AddMultipleHumanVoiceModal/index';
import SelectMultipleLanguagesModal from '../../../../shared/components/SelectMultipleLanguagesModal/index';
import ExportMultipleVideosModal from "./ExportMultipleVideosModal";
import VideosTabs from '../VideosTabs';
import RoleRenderer from '../../../../shared/containers/RoleRenderer';
import { debounce, getUsersByRoles, displayArticleLanguage, getUserOrganziationRole, canUserAccess } from '../../../../shared/utils/helpers';
import ClearPagination from '../../../../shared/components/ClearPagination';
import VideoCard from '../../../../shared/components/VideoCard';
import TranslateOnWhatsappDropdown from './TranslateOnWhatsappDropdown';
import AssignReviewUsers from '../../../../shared/components/AssignReviewUsers';

function Separator() {
    return (
        <span style={{ display: 'inline-block', margin: '0 10px', color: 'gray' }} >|</span>
    )
}

class Translated extends React.Component {
    state = {
        selectedVideo: null,
        isAssignProjectLeaderModalOpen: false,
        selectMultipleLanguagesModalOpen: false,
        addUsersToMultipleVideosModalOpen: false,
        exportMultipleVideosModalOpen: false,
        searchUsersFilter: '',
    }

    constructor(props) {
        super(props);
        this.debouncedSearch = debounce((searchTerm) => {
            this.props.setCurrentPageNumber(1);
            this.props.fetchTranslatedArticles();
        }, 500)
        this.debouncedUsersSearch = debounce(() => {
            this.props.searchUsers(this.props.organization._id, { search: this.state.searchUsersFilter });
        }, 500);
    }
    componentWillMount = () => {
        this.props.setSearchFilter('');
        this.props.setCurrentPageNumber(1);
        this.props.fetchTranslatedArticles();
        this.props.searchUsers(this.props.organization._id, { search: '' });
    }

    isVideoFocused = (video) => {
        const videoId = querystring.parse(window.location.search).video;
        return videoId && videoId === video._id;
    }

    getLanguage = langCode => {
        const fromOthers = isoLangs[langCode];
        if (fromOthers) return fromOthers.name;
        const fromSupported = supportedLangs.find(l => l.code === langCode);
        if (fromSupported) return fromSupported.name;
        return langCode
    }

    onPageChange = (e, { activePage }) => {
        this.props.setCurrentPageNumber(activePage);
        this.props.fetchTranslatedArticles(this.props.organization._id, activePage);
    }

    onSearchChange = (searchTerm) => {
        this.props.setSearchFilter(searchTerm);
        this.debouncedSearch()
    }

    onSearchUsersChange = (searchTerm) => {
        this.setState({ searchUsersFilter: searchTerm });
        this.debouncedUsersSearch();
    }

    onAddHumanVoice = (data) => {
        const { video } = this.props.selectedVideo;
        this.props.setAddMultipleHumanVoiceModalVisible(false);
        this.props.generateTranslatableArticles(video._id, video.article, data);
    }

    onAddUsersToMultipleVideos = (data) => {
        this.setState({ addUsersToMultipleVideosModalOpen: false });
        this.props.addUsersToMultipleVideos(data);
    }

    onAssignProjectLeader = (video) => {
        this.setState({ selectedVideo: video, isAssignProjectLeaderModalOpen: true });
    }

    onSaveProjectLeaders = (projectLeaders) => {
        const { selectedVideo } = this.state;
        this.setState({ selectedVideo: null, isAssignProjectLeaderModalOpen: false });
        this.props.updateVideoProjectLeaders(selectedVideo._id, projectLeaders);
    }
    
    onSelectMultipleLanguages = (codes) => {
        this.setState({ selectMultipleLanguagesModalOpen: false });
        this.props.submitMultipleLanguages(codes)
    }

    onMultiExport = (voiceVolume, normalizeAudio, downloadZip) => {
        this.setState({exportMultipleVideosModalOpen: false});
        this.props.exportMultipleVideos(voiceVolume, normalizeAudio, downloadZip);
    }

    onSelectChange = (video, selected) => {
        this.props.setTranslatedArticleVideoSelected(video._id, selected);
    }

    onAssignUsersBlur = () => {
        this.setState({ searchUsersFilter: '' });
        this.props.searchUsers(this.props.organization._id, { search: '' });
    }

    getTranslators = () => {
        const roles = [
            'translate',
            'voice_over_artist',
            'translate_text',
            'approve_translations',
            'admin',
            'project_leader',
            'owner'
        ]
        return getUsersByRoles(this.props.organizationUsers, this.props.organization, roles);
    }

    getVerifiers = () => {
        const roles = [
            'translate',
            'voice_over_artist',
            'translate_text',
            'approve_translations',

            'review',
            'break_videos',
            'transcribe_text',
            'approve_transcriptions',

            'admin',
            'project_leader',
            'owner'
        ];
        return getUsersByRoles(this.props.organizationUsers, this.props.organization, roles);
    }

    getWhatsappButtonTitle = () => {
        const { organization, user } = this.props;
        const userRole = getUserOrganziationRole(user, organization)
        let title = 'Add voiceover on WhatsApp'
        let voiceover = false;
        let text = false;
        if (userRole && userRole.permissions && userRole.permissions.length > 0) {
            if (canUserAccess(user, organization, ['admin', 'project_leader', 'translate'])) {
                voiceover = true;
                text = true;
            }
            if (canUserAccess(user, organization, ['translate_text'])) {
                text = true;
            }
            if (canUserAccess(user, organization, ['voice_over_artist'])) {
                voiceover = true;
            }
        }
        if (voiceover) return title;
        if (text) {
            return 'Translate Text on WhatsApp';
        }
        return title;
    }

    getButtonTitle = () => {
        const { organization, user } = this.props;
        const userRole = getUserOrganziationRole(user, organization)
        let title = 'Add voiceover'
        let voiceover = false;
        let text = false;
        if (userRole && userRole.permissions && userRole.permissions.length > 0) {
            if (canUserAccess(user, organization, ['admin', 'project_leader', 'translate'])) {
                voiceover = true;
                text = true;
            }
            if (canUserAccess(user, organization, ['translate_text'])) {
                text = true;
            }
            if (canUserAccess(user, organization, ['voice_over_artist'])) {
                voiceover = true;
            }
        }
        if (voiceover) return title;
        if (text) {
            return 'Translate Text';
        }
        return title;
    }

    renderPagination = () => (
        <ClearPagination
            style={{ marginLeft: 20 }}
            activePage={this.props.currentPageNumber}
            onPageChange={this.onPageChange}
            totalPages={this.props.totalPagesCount}
        />
    )


    _renderAddHumanVoiceModal() {
        const users = this.getTranslators();
        const verifiers = this.getVerifiers();
        const { selectedVideo } = this.props;
        if (!selectedVideo) return null;
        const disabledLanguages = this.props.selectedVideo && this.props.selectedVideo.articles ? this.props.selectedVideo.articles.map(a => a.langCode) : [];
        return (
            <AddMultipleHumanVoiceModal
                title={this.getButtonTitle() + ' In:'}
                open={this.props.addMultipleHumanVoiceModalVisible}
                onClose={() => {
                    this.onAssignUsersBlur();
                    this.props.setAddMultipleHumanVoiceModalVisible(false);
                }}
                users={users}
                verifiers={verifiers}
                speakersProfile={selectedVideo && selectedVideo.originalArticle ? selectedVideo.originalArticle.speakersProfile : []}
                disabledLanguages={disabledLanguages}
                skippable={false}
                onSearchUsersChange={(searchTerm) => {
                    this.onSearchUsersChange(searchTerm);
                }}
                onSubmit={(data) => this.onAddHumanVoice(data)}
                onBlur={this.onAssignUsersBlur}
            />
        )
    }

    _renderSelectMultipleLanguagesModal() {
        return (
            <SelectMultipleLanguagesModal
                open={this.state.selectMultipleLanguagesModalOpen}
                onClose={() => this.setState({ selectMultipleLanguagesModalOpen: false })}
                onSubmit={(codes) => this.onSelectMultipleLanguages(codes)}
            />
        )
    }

    _renderAddUsersToMultipleVideosModal() {
        const users = this.getTranslators();
        const verifiers = this.getVerifiers();
        const selectedTranslatedArticles = this.props.translatedArticles.filter(ta => ta.video.selected);
        if (selectedTranslatedArticles.length === 0) return null;
        let disabledLanguages = [];
        selectedTranslatedArticles.forEach((ta) => {
            ta.articles.forEach((a) => {
                disabledLanguages.push(a.langCode);
            });
        });
        disabledLanguages = Array.from(new Set(disabledLanguages.map(JSON.stringify))).map(
            JSON.parse
        );

        return (
            <AddMultipleHumanVoiceModal
                open={this.state.addUsersToMultipleVideosModalOpen}
                onClose={() => {
                    this.onAssignUsersBlur();
                    this.setState({ addUsersToMultipleVideosModalOpen: false });
                }}
                users={users}
                verifiers={verifiers}
                disabledLanguages={disabledLanguages}
                skippable={false}
                onSubmit={(data) => this.onAddUsersToMultipleVideos(data)}
                multiVideos={true}
                selectedTranslatedArticles={selectedTranslatedArticles}
                onSearchUsersChange={(searchTerm) => {
                    this.onSearchUsersChange(searchTerm);
                }}
                onBlur={this.onAssignUsersBlur}
            />
        )
    }

    _renderAssignProjectLeader = () => (
        <AssignReviewUsers
            title="Assign Project Leaders"
            single
            open={this.state.isAssignProjectLeaderModalOpen}
            value={
                this.state.selectedVideo && this.state.selectedVideo.projectLeaders
                ? this.state.selectedVideo.projectLeaders
                : []
            }
            users={this.props.organizationUsers}
            onClose={() => {
                this.onAssignUsersBlur();
                this.setState({
                    isAssignProjectLeaderModalOpen: false,
                    selectedVideo: null,
                });
            }}
            onSave={this.onSaveProjectLeaders}
            onSearchUsersChange={(searchTerm) => {
                this.onSearchUsersChange(searchTerm);
            }}
            onBlur={this.onAssignUsersBlur}
        />
    );

    _renderExportMultipleVideosModal() {
        return (
            <ExportMultipleVideosModal
                open={this.state.exportMultipleVideosModalOpen}
                onClose={() => this.setState({exportMultipleVideosModalOpen: false})}
                onSubmit={(voiceVolume, normalizeAudio, downloadZip) => this.onMultiExport(voiceVolume, normalizeAudio, downloadZip)}
            />
        )
    }

    render() {
        const allSelected = this.props.translatedArticles && this.props.translatedArticles.length > 0 && this.props.selectedCount === this.props.translatedArticles.length;
        const whatsappButtonTitle = this.getWhatsappButtonTitle();
        const buttonTitle = this.getButtonTitle()

        return (
            <div>
                <VideosTabs />
                <Grid style={{ margin: '1rem' }}>
                    <RoleRenderer roles={[
                        'admin',
                        'project_leader',
                        'translate',
                        'voice_over_artist',
                        'translate_text',
                        'approve_translations',
                    ]}>
                        <Grid.Row style={{ marginBottom: 20 }}>
                            <Grid.Column width={5}>

                                <Input
                                    fluid
                                    style={{ height: '100%' }}
                                    type="text"
                                    icon="search"
                                    iconPosition="left"
                                    input={<input
                                        type="text"
                                        style={{ borderRadius: 20, color: '#999999', backgroundColor: '#d4e0ed' }}
                                    />}
                                    placeholder="Search by file name, video name, etc"
                                    value={this.props.searchFilter}
                                    onChange={(e, { value }) => this.onSearchChange(value)}
                                />
                            </Grid.Column>
                            <Grid.Column width={11}>
                                <div className="pull-right">
                                    {this.renderPagination()}
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={13}>
                                <div
                                    style={{ display: 'flex', alignItems: 'center', color: '#999999' }}
                                >
                                    <label>
                                        <input type="checkbox" style={{ marginRight: 5 }} checked={allSelected} onClick={() => this.props.setAllTranslatedArticleVideoSelected(!allSelected)} />
                                        Select all videos
                                    </label>
                                    {this.props.selectedCount > 0 && (
                                        <React.Fragment>
                                            <Separator />
                                            <span href="javascript:void(0);" style={{ cursor: 'pointer' }} onClick={() => this.setState({ selectMultipleLanguagesModalOpen: true })}>
                                                <Icon name="add" size="small" color="blue" /> Assign multiple languages to selected videos
                                            </span>
                                        </React.Fragment>
                                    )}
                                    {this.props.selectedCount > 0 && (
                                        <React.Fragment>
                                            <Separator />
                                            <span href="javascript:void(0);" style={{ cursor: 'pointer' }} onClick={() => this.setState({ addUsersToMultipleVideosModalOpen: true })}>
                                                <Icon name="add" size="small" color="blue" /> Add translators / approvers to selected videos
                                            </span>
                                        </React.Fragment>
                                    )}
                                    {this.props.selectedCount > 0 && (
                                        <React.Fragment>
                                            <Separator />
                                            <span href="javascript:void(0);" style={{ cursor: 'pointer' }} onClick={() => this.setState({ exportMultipleVideosModalOpen: true })}>
                                                <Icon name="add" size="small" color="blue" /> Export selected videos
                                            </span>
                                        </React.Fragment>
                                    )}
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                        <LoaderComponent active={this.props.videosLoading}>
                            <Grid.Row>
                                {this.props.translatedArticles.map((translatedArticle) => (
                                    <Grid.Column width={4} key={`translated-article-container-${translatedArticle.video._id}`}>
                                        <VideoCard
                                            showOptions
                                            options={[
                                                {
                                                    content: <div>
                                                        <Icon name="plus" color="green" /> Assign Project Leader
                                                    </div>,
                                                    onClick: () => {
                                                        this.onAssignProjectLeader(translatedArticle.video);
                                                    }
                                                }
                                            ]}
                                            selectable={true}
                                            selected={translatedArticle.video.selected}
                                            onSelectChange={(selected) => this.onSelectChange(translatedArticle.video, selected)}
                                            rounded
                                            url={
                                                translatedArticle.video.compressedVideoUrl ||
                                                translatedArticle.video.url
                                            }
                                            thumbnailUrl={translatedArticle.video.thumbnailUrl}
                                            duration={translatedArticle.video.duration}
                                            title={translatedArticle.video.title}
                                            titleRoute={routes.organziationTranslationMetrics(translatedArticle.video._id)}
                                            buttonTitle={buttonTitle}
                                            onButtonClick={() => {
                                                this.props.setSelectedVideo(translatedArticle);
                                                this.props.setAddMultipleHumanVoiceModalVisible(true);
                                            }}
                                            showWhatsappIcon
                                            whatsappIconContent={(
                                                <TranslateOnWhatsappDropdown
                                                    buttonTitle={whatsappButtonTitle}
                                                    videoId={translatedArticle.video._id}
                                                />
                                            )}
                                            focused={this.isVideoFocused(translatedArticle.video)}
                                            extra={(
                                                <div style={{ marginLeft: 15, marginTop: 0, color: '#999999', fontSize: 10 }}>
                                                    <p>
                                                        Edit translated versions:
                                                    </p>
                                                    <p
                                                        style={{ wordBreak: 'break-word' }}
                                                    >
                                                        {/* routes.translationArticle(singleTranslatedArticle.video.article) + `?lang=${article.langCode}` */}
                                                        {translatedArticle.articles.map((article, index) => (
                                                            <a key={`translated-article-adadad-${article._id}`} href={routes.translationArticle(article._id)} style={{ color: '#999999' }}>
                                                                <Button
                                                                    size='mini'
                                                                    circular
                                                                    style={{ marginRight: 10, marginBottom: 10 }}
                                                                >
                                                                    {displayArticleLanguage(article)}
                                                                </Button>
                                                            </a>
                                                        ))}
                                                    </p>
                                                </div>
                                            )}
                                        />
                                    </Grid.Column>
                                ))}
                            </Grid.Row>

                            {this._renderAddHumanVoiceModal()}
                            {this._renderSelectMultipleLanguagesModal()}
                            {this._renderAddUsersToMultipleVideosModal()}
                            {this._renderExportMultipleVideosModal()}
                            {this._renderAssignProjectLeader()}
                        </LoaderComponent>
                    </RoleRenderer>
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = ({ organization, authentication, organizationVideos }) => ({
    organization: organization.organization,
    user: authentication.user,
    translatedArticles: organizationVideos.translatedArticles,
    videos: organizationVideos.videos,
    languageFilter: organizationVideos.languageFilter,
    videosLoading: organizationVideos.videosLoading,
    totalPagesCount: organizationVideos.totalPagesCount,
    selectedVideo: organizationVideos.selectedVideo,
    addHumanVoiceModalVisible: organizationVideos.addHumanVoiceModalVisible,
    addMultipleHumanVoiceModalVisible: organizationVideos.addMultipleHumanVoiceModalVisible,
    currentPageNumber: organizationVideos.currentPageNumber,
    searchFilter: organizationVideos.searchFilter,
    organizationUsers: organization.users,
    selectedCount: organizationVideos.selectedCount,
})
const mapDispatchToProps = (dispatch) => ({
    setSelectedVideo: video => dispatch(videoActions.setSelectedVideo(video)),
    setAddHumanVoiceModalVisible: visible => dispatch(videoActions.setAddHumanVoiceModalVisible(visible)),
    setAddMultipleHumanVoiceModalVisible: visible => dispatch(videoActions.setAddMultipleHumanVoiceModalVisible(visible)),
    setCurrentPageNumber: pageNumber => dispatch(videoActions.setCurrentPageNumber(pageNumber)),
    fetchTranslatedArticles: () => dispatch(videoActions.fetchTranslatedArticles()),
    deleteArticle: (articleId) => dispatch(videoActions.deleteArticle(articleId)),
    generateTranslatableArticles: (videoId, originalArticleId, data) => dispatch(videoActions.generateTranslatableArticles(videoId, originalArticleId, data, 'multi')),
    addUsersToMultipleVideos: (data) => dispatch(videoActions.addUsersToMultipleVideos(data)),
    submitMultipleLanguages: (codes) => dispatch(videoActions.submitMultipleLanguages(codes)),
    updateVideoProjectLeaders: (videoId, projectLeaders) => dispatch(videoActions.updateVideoProjectLeaders(videoId, projectLeaders)),
    searchUsers: (organizationId, query) => dispatch(organizationActions.searchUsers(organizationId, query)),
    setSearchFilter: filter => dispatch(videoActions.setSearchFilter(filter)),
    setAllTranslatedArticleVideoSelected: (selected) => dispatch(videoActions.setAllTranslatedArticleVideoSelected(selected)),
    setTranslatedArticleVideoSelected: (videoId, selected) => dispatch(videoActions.setTranslatedArticleVideoSelected(videoId, selected)),
    exportMultipleVideos: (voiceVolume, normalizeAudio, downloadZip) => dispatch(videoActions.exportMultipleVideos(voiceVolume, normalizeAudio, downloadZip))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Translated));
