import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Grid, Dropdown, Input, Modal, Button, Icon } from 'semantic-ui-react';
import ClearPagination from '../../../../shared/components/ClearPagination';

import * as videoActions from '../modules/actions';
import VideosTabs from '../VideosTabs';

import queryString from 'query-string';
import * as organizationActions from '../../../../actions/organization';

import LoaderComponent from '../../../../shared/components/LoaderComponent';
import websockets from '../../../../websockets';
import NotificationService from '../../../../shared/utils/NotificationService';
import VideoCard from '../../../../shared/components/VideoCard';

import { supportedLangs, isoLangsArray } from '../../../../shared/constants/langs';
import {
    debounce,
    getUserNamePreview,
    getUsersByRoles,
    formatTime,
    generateWhatsappTranscribeLink,
    generateWhatsappProofreadLink,
    getWhatsappNotifyOnProofreadingReady
} from '../../../../shared/utils/helpers';
import RoleRenderer from '../../../../shared/containers/RoleRenderer';
import AssignReviewUsers from '../../../../shared/components/AssignReviewUsers';
import routes from '../../../../shared/routes';
import EditVideoModal from '../../../../shared/components/EditVideoModal';

import './style.scss';
import LanguageDropdown from '../../../../shared/components/LanguageDropdown';
import { setUploadVideoForm } from '../../../../actions/video';

let langsToUse = supportedLangs.map((l) => ({ ...l, supported: true }));
langsToUse = langsToUse.concat(isoLangsArray.filter((l) => supportedLangs.every((l2) => l2.code.indexOf(l.code) === -1)));
const langsOptions = langsToUse.map((lang) => ({ key: lang.code, value: lang.code, text: `${lang.name} ( ${lang.code} )` }));


const TABS = {
    CUT_VIDEO: 'cut_video',
    PROOFREAD: 'proofread',
    COMPLETED: 'completed'
}

const videoStatusMap = {
    [TABS.CUT_VIDEO]: ['uploaded', 'uploading', 'cutting'],
    [TABS.PROOFREAD]: ['proofreading', 'converting'],
    [TABS.COMPLETED]: ['done'],
}

function formatCount(number) {
    if (number >= 10) return number;
    if (number === 0) return 0;
    return `0${number}`;
}

function Separator() {
    return (
        <span style={{ display: 'inline-block', margin: '0 10px', color: 'gray' }} >|</span>
    )
}

class Review extends React.Component {
    state = {
        activeTab: TABS.CUT_VIDEO,
        deletedVideo: null,
        deleteVideoModalVisible: false,
        selectedVideo: null,
        assignUsersModalOpen: false,
        assignUsersToMultipleVideosModalOpen: false,
        assignVerifiersModalOpen: false,
        assignVerifiersToMultipleVideosModalOpen: false,
        confirmReviewModalVisible: false,
        isSelectCutterModalOpen: false,
        editVideoModalOpen: false,
        tmpEditVideo: null,
        isNotifyWithWhatsappModalOpen: false,
    }

    constructor(props) {
        super(props);

        this.debouncedSearch = debounce((searchTerm) => {
            this.props.setCurrentPageNumber(1);
            this.props.fetchVideos();
            this.props.fetchVideosCount(this.props.organization._id);
        }, 500)
    }

    componentDidMount = () => {
        const { activeTab } = queryString.parse(this.props.location.search);
        if (activeTab) {
            switch (activeTab) {
                case 'transcribe':
                    this.setState({ activeTab: 'transcribe' }); break;
                case 'proofread':
                    this.setState({ activeTab: 'proofread' }); break;
                case 'completed':
                    this.setState({ activeTab: 'completed' }); break;
                default:
                    this.setState({ activeTab: 'transcribe' }); break;
            }
        }
        this.props.setSearchFilter('');
        this.props.fetchUsers(this.props.organization._id);
        this.props.setCurrentPageNumber(1);
        this.props.setVideoStatusFilter(videoStatusMap[activeTab || TABS.CUT_VIDEO]);
        this.props.fetchVideos();
        this.props.fetchVideosCount(this.props.organization._id);
        this.videoUploadedSub = websockets.subscribeToEvent(websockets.websocketsEvents.VIDEO_UPLOADED, (data) => {
            this.props.fetchVideos();
            this.props.fetchVideosCount(this.props.organization._id);
        })

        this.videoTranscribedSub = websockets.subscribeToEvent(websockets.websocketsEvents.VIDEO_TRANSCRIBED, this.onVideoTranscribed)
        this.videoDoneSub = websockets.subscribeToEvent(websockets.websocketsEvents.VIDEO_DONE, this.onVideoCompleted)
    }

    componentWillUnmount = () => {
        websockets.unsubscribeFromEvent(websockets.websocketsEvents.VIDEO_UPLOADED)
        websockets.unsubscribeFromEvent(websockets.websocketsEvents.VIDEO_TRANSCRIBED, this.onVideoTranscribed);

        websockets.unsubscribeFromEvent(websockets.websocketsEvents.VIDEO_DONE, this.onVideoCompleted);
    }

    onVideoTranscribed = (video) => {
        if (this.props.videos.map((video) => video._id).indexOf(video._id) !== -1) {
            this.props.fetchVideos();
            this.props.fetchVideosCount(this.props.organization._id);
            NotificationService.info(`${video.title} available in the "Proofread" stage`);
        }
    }

    onVideoCompleted = (video) => {
        this.props.fetchVideos();
        this.props.fetchVideosCount(this.props.organization._id);
        NotificationService.success(`The video "${video.title}" has been converted successfully!`);
    }

    onTabChange = tab => {
        this.setState({ activeTab: tab });
        this.props.setSearchFilter('');
        this.props.setVideoStatusFilter(videoStatusMap[tab]);
        this.props.setCurrentPageNumber(1);
        this.props.fetchVideos();
        this.props.fetchVideosCount(this.props.organization._id);
    }

    onPageChange = (e, { activePage }) => {
        this.props.setCurrentPageNumber(activePage);
        this.props.fetchVideos({ organization: this.props.organization._id });
        this.props.fetchVideosCount(this.props.organization._id);
    }

    onSearchChange = (searchTerm) => {
        this.props.setSearchFilter(searchTerm);
        this.debouncedSearch()
    }

    onLanguageFilterChange = (value) => {
        this.props.setLanguageFilter(value);
        this.props.setCurrentPageNumber(1)
        this.props.fetchVideos({ organization: this.props.organization._id })
        this.props.fetchVideosCount(this.props.organization._id);
    }

    onDeleteVideoClick = (video) => {
        this.setState({ deleteVideoModalVisible: true, deletedVideo: video });
        this.props.setVideoSelected(video._id, true);
    }

    deleteSelectedVideo = () => {
        this.props.deleteVideo(this.state.deletedVideo._id);
        this.setState({ deletedVideo: null, deleteVideoModalVisible: false });
    }

    deleteSelectedVideos = () => {
        this.props.deleteSelectedVideos();
        this.setState({ deletedVideo: null, deleteVideoModalVisible: false });
    }

    onTranscribeVideo = video => {
        console.log('on review', video);
        this.props.transcribeVideo(video);
    }

    onReReviewVideo = video => {
        this.props.setSelectedVideo(video);
        this.setState({ confirmReviewModalVisible: true });
    }

    navigateToConvertProgresss = videoId => {
        window.location.href = routes.convertProgressV2(videoId)
    }

    onTranscribeVideoClick = video => {
        this.setState({ isSelectCutterModalOpen: false });
        if (video.canAITranscribe) {
            this.props.transcribeVideo(video);
        } else {
            this.onSkipTranscribeClick(video)
        }
    }

    onSkipTranscribeClick = video => {
        this.props.setSelectedVideo(video);
        this.setState({ isSelectCutterModalOpen: true });
        // this.props.skipTranscribe(video);
    }

    onSkipTranscribe = (cuttingBy) => {
        const { selectedVideo } = this.props;
        this.setState({ isSelectCutterModalOpen: false });
        this.props.skipTranscribe(selectedVideo, cuttingBy);
        if (cuttingBy === 'videowiki') {
            this.setState({ isNotifyWithWhatsappModalOpen: true })
        }
    }

    onSaveAssignedUsers = (users) => {
        this.props.updateVideoReviewers(this.state.selectedVideo._id, users);
        this.setState({ selectedVideo: null, assignUsersModalOpen: false });
    }

    onMultipleVideosSaveAssignedUsers = (users) => {
        this.props.updateVideosReviewers(users);
        this.setState({ selectedVideo: null, assignUsersToMultipleVideosModalOpen: false });
    }

    onSaveVerifiers = (users) => {
        this.props.updateVideoVerifiers(this.state.selectedVideo._id, users);
        this.setState({ selectedVideo: null, assignVerifiersModalOpen: false });
    }

    onMultipleVideosSaveVerifiers = (users) => {
        this.props.updateVideosVerifiers(users);
        this.setState({ selectedVideo: null, assignVerifiersToMultipleVideosModalOpen: false });
    }

    onSaveEditedVideo = (originalVideo, editedVideo) => {
        const changes = {};
        Object.keys(editedVideo).forEach(key => {
            if (originalVideo[key] !== editedVideo[key]) {
                changes[key] = editedVideo[key];
            }
        })
        if (changes.backgroundMusicUrl !== undefined) {
            changes.backgroundMusic = changes.backgroundMusicUrl;
            delete changes.backgroundMusicUrl;
        }
        console.log('changes', changes)
        this.props.updateVideo(originalVideo._id, changes);
        this.setState({ editVideoModalOpen: false });
    }

    onAddClick = (video) => {
        this.setState({ assignUsersModalOpen: true, selectedVideo: video });
    }

    onAddVerifiersClick = (video) => {
        this.setState({ assignVerifiersModalOpen: true, selectedVideo: video });
    }

    onEditClick = video => {
        this.setState({ editVideoModalOpen: true, selectedVideo: video, tmpEditVideo: { ...video } });
    }

    onSelectChange = (video, selected) => {
        this.props.setVideoSelected(video._id, selected);
    }

    onResendEmail = (userRole, videoId, userId) => {
        if (userRole === 'verifier') {
            this.props.resendEmailToVideoVerifier(videoId, userId)
        } else if (userRole === 'reviewer') {
            this.props.resendEmailToVideoReviewer(videoId, userId);
        }
    }

    renderEditVideoModal = () => (
        <EditVideoModal
            open={this.state.editVideoModalOpen}
            initialValue={this.state.selectedVideo}
            value={this.state.tmpEditVideo}
            onClose={() => this.setState({ editVideoModalOpen: false })}
            onReset={() => this.setState({ tmpEditVideo: { ...this.state.selectedVideo } })}
            onChange={(changes) => {
                const { tmpEditVideo } = this.state;
                Object.keys(changes).forEach((key) => {
                    tmpEditVideo[key] = changes[key];
                })
                this.setState({ tmpEditVideo: { ...tmpEditVideo } });
            }}
            onSave={() => this.onSaveEditedVideo(this.state.selectedVideo, this.state.tmpEditVideo)}
        />
    )

    renderPagination = () => (
        <ClearPagination
            activePage={this.props.currentPageNumber}
            onPageChange={this.onPageChange}
            totalPages={this.props.totalPagesCount}
        />
    )

    renderSelectCutterModal = () => (
        <Modal
            size="tiny"
            open={this.state.isSelectCutterModalOpen}
            onClose={() => this.setState({ isSelectCutterModalOpen: false })}
        >
            <Modal.Header>
                Who should cut the video? <br />
                <small>The video requires to be cut into slides</small>
                <Button
                    circular
                    icon="close"
                    style={{ position: 'absolute', right: '1rem', top: '1rem' }}
                    onClick={() => this.setState({ isSelectCutterModalOpen: false })}
                />
            </Modal.Header>
            <Modal.Content>
                <p>
                    Would you like to do that yourself or let Videowiki's team do it for you?
                </p>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    circular
                    primary
                    onClick={() => this.onSkipTranscribe('videowiki')}
                >
                    Let Videowiki's Team do it
                </Button>
                <Button
                    circular
                    primary
                    onClick={() => this.onSkipTranscribe('self')}

                >
                    I'll do it myself
                </Button>
            </Modal.Actions>
        </Modal>

    )

    renderNotifyWithWhatsappModal = () => (
        <Modal
            size="tiny"
            open={this.state.isNotifyWithWhatsappModalOpen}
            onClose={() => this.setState({ isNotifyWithWhatsappModalOpen: false })}
        >
            <Modal.Header>
                Get notified through whatsapp? <br />
                <Button
                    circular
                    icon="close"
                    style={{ position: 'absolute', right: '1rem', top: '1rem' }}
                    onClick={() => this.setState({ isNotifyWithWhatsappModalOpen: false })}
                />
            </Modal.Header>
            <Modal.Content>
                <p>
                    We'll send you an email once the video is ready for proofreading
                </p>
                <p>
                    Would you like to get a notification through WhatsApp too?
                </p>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    circular
                    onClick={() => this.setState({ isNotifyWithWhatsappModalOpen: false })}
                >
                    No, just send me an email
                </Button>
                {this.props.selectedVideo && (

                    <a
                        href={getWhatsappNotifyOnProofreadingReady(this.props.selectedVideo._id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => this.setState({ isNotifyWithWhatsappModalOpen: false })}
                    >

                        <Button
                            circular
                            primary
                        >
                            Yes, notify me on WhatsApp too
                        </Button>
                    </a>
                )}
            </Modal.Actions>
        </Modal>


    )
    _renderDeleteVideoModal = () => (
        <Modal
            open={this.state.deleteVideoModalVisible}
            size="tiny"
            onClose={() => this.setState({ deleteVideoModalVisible: false, deletedVideo: null })}
        >
            <Modal.Header>
                CONFIRM DELETE
                <Button
                    // basic
                    onClick={() => this.setState({ deleteVideoModalVisible: false, deletedVideo: null })}
                    className="pull-right"
                    color="white"
                    color="gray"
                    circular
                    icon="close"
                />
            </Modal.Header>
            <Modal.Content>
                <div>
                    Are you sure you want to delete these videos? <small>(All associated content/articles will be deleted)</small>
                </div>
                <Grid>
                    {this.props.videos.filter(v => v.selected).map(v => (
                        <Grid.Row key={'delete-video' + v._id} style={{ alignItems: 'center' }}>
                            <Grid.Column width={4}>
                                <img src={v.thumbnailUrl} style={{ width: '100%' }} />
                            </Grid.Column>
                            <Grid.Column width={12} style={{ alignItems: 'center' }}>
                                <h5 style={{ margin: 0 }}>{v.title}</h5>
                                {v.duration && (
                                    <small>{formatTime(v.duration * 1000)}</small>
                                )}
                            </Grid.Column>
                        </Grid.Row>
                    ))}
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    circular
                    onClick={() => this.setState({ deleteVideoModalVisible: false, deletedVideo: null })}
                >
                    Cancel
                </Button>
                <Button
                    circular
                    primary
                    onClick={this.deleteSelectedVideos}
                >
                    Yes, Delete
                </Button>
            </Modal.Actions>
        </Modal>
    )

    renderAssignUsers = () => (
        <AssignReviewUsers
            title="Assign Transcribers"
            open={this.state.assignUsersModalOpen}
            value={this.state.selectedVideo ? this.state.selectedVideo.reviewers.map(r => r._id) : []}
            users={getUsersByRoles(this.props.organizationUsers, this.props.organization, ['admin', 'owner', 'review'])}
            onClose={() => this.setState({ assignUsersModalOpen: false, selectedVideo: null })}
            onSave={this.onSaveAssignedUsers}
            onResendEmail={(userId) => this.onResendEmail('reviewer', this.state.selectedVideo._id, userId)}
        />
    )

    renderAssignUsersToMultipleVideos = () => (
        <AssignReviewUsers
            title="Assign Transcribers To The Selected Videos"
            open={this.state.assignUsersToMultipleVideosModalOpen}
            value={this.state.selectedVideo ? this.state.selectedVideo.reviewers.map(r => r._id) : []}
            users={getUsersByRoles(this.props.organizationUsers, this.props.organization, ['admin', 'owner', 'review'])}
            onClose={() => this.setState({ assignUsersToMultipleVideosModalOpen: false, selectedVideo: null })}
            onSave={this.onMultipleVideosSaveAssignedUsers}
            onResendEmail={(userId) => this.onResendEmail('reviewer', this.state.selectedVideo._id, userId)}
        />
    )

    renderAssignVerifiers = () => (
        <AssignReviewUsers
            title="Assign Approvers"
            open={this.state.assignVerifiersModalOpen}
            value={this.state.selectedVideo && this.state.selectedVideo.verifiers ? this.state.selectedVideo.verifiers.map(r => r._id) : []}
            users={getUsersByRoles(this.props.organizationUsers, this.props.organization, ['admin', 'owner', 'review'])}
            onClose={() => this.setState({ assignVerifiersModalOpen: false, selectedVideo: null })}
            onSave={this.onSaveVerifiers}
            onResendEmail={(userId) => this.onResendEmail('verifier', this.state.selectedVideo._id, userId)}
        />
    )

    renderAssignVerifiersToMultipleVideos = () => (
        <AssignReviewUsers
            title="Assign Approvers To The Selected Videos"
            open={this.state.assignVerifiersToMultipleVideosModalOpen}
            value={this.state.selectedVideo && this.state.selectedVideo.verifiers ? this.state.selectedVideo.verifiers.map(r => r._id) : []}
            users={getUsersByRoles(this.props.organizationUsers, this.props.organization, ['admin', 'owner', 'review'])}
            onClose={() => this.setState({ assignVerifiersToMultipleVideosModalOpen: false, selectedVideo: null })}
            onSave={this.onMultipleVideosSaveVerifiers}
            onResendEmail={(userId) => this.onResendEmail('verifier', this.state.selectedVideo._id, userId)}
        />
    )

    renderConfirmReviewModal = () => (
        <Modal open={this.state.confirmReviewModalVisible} size="tiny">
            <Modal.Header>
                Re-Review Video
                <Button
                    // basic
                    onClick={() => {
                        this.setState({ confirmReviewModalVisible: false });
                        this.props.setSelectedVideo(null);
                    }}
                    className="pull-right"
                    color="white"
                    color="gray"
                    circular
                    icon="close"
                />
            </Modal.Header>
            <Modal.Content>
                <p>Are you sure you want to re-review this video? <small><strong>( All current translations will be archived )</strong></small></p>

            </Modal.Content>
            <Modal.Actions>
                <Button
                    circular
                    onClick={() => {
                        this.setState({ confirmReviewModalVisible: false });
                        this.props.setSelectedVideo(null);
                    }}
                >
                    Cancel
                </Button>
                <Button
                    circular
                    color="blue"
                    onClick={() => {
                        this.setState({ confirmReviewModalVisible: false });
                        this.onTranscribeVideo(this.props.selectedVideo);
                        this.props.setSelectedVideo(null);
                    }}>
                    Yes
                </Button>
            </Modal.Actions>
        </Modal>
    )

    renderVideosCards = () => {

        let renderedComp;
        const commonProps = video => ({
            showOptions: true,
            selectable: true,
            deleteable: true,
            rounded: true,
            url: video.url,
            thumbnailUrl: video.thumbnailUrl,
            title: video.title,
            reviewers: video.reviewers,
            verifiers: video.verifiers,
            onAddClick: () => this.onAddClick(video),
            onEditClick: () => this.onEditClick(video),
            onAddVerifiersClick: () => this.onAddVerifiersClick(video),
            onDeleteVideoClick: () => this.onDeleteVideoClick(video),
            onSelectChange: (selected) => this.onSelectChange(video, selected),

        })
        // if (this.state.activeTab === TABS.TRANSCRIBE) {
        //     renderedComp = (
        //         this.props.videos && this.props.videos.length === 0 ? (
        //             <div style={{ margin: 50 }}>No videos requires preview</div>
        //         ) : this.props.videos && this.props.videos.map((video) => {
        //             const loading = ['uploading', 'transcriping', 'cutting'].indexOf(video.status) !== -1;
        //             const props = commonProps(video);
        //             const animate = !loading && (this.props.videosCounts && this.props.videosCounts.total === 1 && this.props.videosCounts.transcribe === 1);
        //             const whatsappIconTarget = generateWhatsappTranscribeLink(video._id);
        //             return (
        //                 <Grid.Column key={video._id} width={4} style={{ marginBottom: 30 }}>
        //                     <VideoCard
        //                         {...props}
        //                         {...video}
        //                         showSkip={!loading}
        //                         loading={loading}
        //                         disabled={loading}
        //                         buttonTitle="Transcribe"
        //                         onButtonClick={() => this.onSkipTranscribeClick(video)}
        //                         onSkipClick={() => this.onSkipTranscribeClick(video)}
        //                         focused={animate}
        //                         // Animate if it's not loading and there's only 1 video uploaded and it's in AI Transcribe stage
        //                         animateButton={animate}
        //                         showWhatsappIcon={!loading}
        //                         whatsappIconTarget={whatsappIconTarget}
        //                         whatsappIconContent={'Transcribe on WhatsApp'}
        //                     />
        //                 </Grid.Column>
        //             )
        //         })
        //     )
        // } else 
        if (this.state.activeTab === TABS.CUT_VIDEO) {
            renderedComp = (
                this.props.videos && this.props.videos.length === 0 ? (
                    <div style={{ margin: 50 }}>No videos requires proofreading</div>
                ) : this.props.videos && this.props.videos.map((video) => {
                    const props = commonProps(video);
                    const loading = video.status === 'converting'
                    const animate = !loading && (this.props.videosCounts && this.props.videosCounts.total === 1 && this.props.videosCounts.cutting === 1);
                    const whatsappIconTarget = generateWhatsappTranscribeLink(video._id);

                    return (
                        <Grid.Column key={video._id} width={4} style={{ marginBottom: 30 }}>
                            <VideoCard
                                {...props}
                                {...video}
                                loading={loading}
                                disabled={loading}
                                onButtonClick={() => {
                                    if (video.status === 'cutting') {
                                        this.navigateToConvertProgresss(video._id);
                                    } else {
                                        this.onSkipTranscribeClick(video)
                                    }
                                }}
                                buttonTitle="Break Video"
                                focused={animate}
                                animateButton={animate}

                                showWhatsappIcon={!loading}
                                whatsappIconTarget={whatsappIconTarget}
                                whatsappIconContent={'Break video on WhatsApp'}
                            />
                        </Grid.Column>
                    )
                })
            )
        } else if (this.state.activeTab === TABS.PROOFREAD) {
            renderedComp = (
                this.props.videos && this.props.videos.length === 0 ? (
                    <div style={{ margin: 50 }}>No videos requires proofreading</div>
                ) : this.props.videos && this.props.videos.map((video) => {
                    const props = commonProps(video);
                    const loading = video.status === 'converting'
                    const animate = !loading && (this.props.videosCounts && this.props.videosCounts.total === 1 && this.props.videosCounts.proofread === 1);
                    const whatsappIconTarget = generateWhatsappProofreadLink(video._id);

                    return (
                        <Grid.Column key={video._id} width={4} style={{ marginBottom: 30 }}>
                            <VideoCard
                                {...props}
                                {...video}
                                loading={loading}
                                disabled={loading}
                                onButtonClick={() => this.navigateToConvertProgresss(video._id)}
                                buttonTitle="Proofread"
                                focused={animate}
                                animateButton={animate}

                                showWhatsappIcon
                                whatsappIconTarget={whatsappIconTarget}
                                whatsappIconContent={'Proofread on WhatsApp'}
                            />
                        </Grid.Column>
                    )
                })
            )
        } else {
            renderedComp = (
                this.props.videos && this.props.videos.length === 0 ? (
                    <div style={{ margin: 50 }}>No videos completed yet</div>
                ) : this.props.videos && this.props.videos.map((video) => {
                    const props = commonProps(video);
                    return (
                        <Grid.Column key={video._id} width={4} style={{ marginBottom: 30 }}>
                            <VideoCard
                                {...props}
                                {...video}
                                buttonTitle="Re-review"
                                onButtonClick={() => this.onReReviewVideo(video)}
                            />
                        </Grid.Column>
                    )
                })
            )
        }
        return renderedComp
    }

    _renderTabContent = () => {

        return (
            <LoaderComponent active={this.props.videosLoading}>
                {this.renderAssignUsers()}
                {this.renderAssignUsersToMultipleVideos()}
                {this.renderAssignVerifiers()}
                {this.renderAssignVerifiersToMultipleVideos()}
                <Grid.Row>
                    {this.renderVideosCards()}
                </Grid.Row>
            </LoaderComponent>
        )
    }

    render() {
        const SUBTABS = [
            { title: `Break video into slides (${formatCount(this.props.videosCounts.cutting )})`, value: TABS.CUT_VIDEO },
            { title: `Proofread (${formatCount(this.props.videosCounts.proofread)})`, value: TABS.PROOFREAD },
            { title: `Completed (${formatCount(this.props.videosCounts.completed)})`, value: TABS.COMPLETED }
        ];
        const allSelected = this.props.videos && this.props.videos.length > 0 && this.props.selectedCount === this.props.videos.length;

        return (
            <div>
                <VideosTabs
                    extraContent={(
                        <div
                            style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', }}
                        >
                            {SUBTABS.map((item, index) => (
                                <React.Fragment
                                    key={`subtab-item-${item.title}`}
                                >

                                    <span
                                        onClick={() => this.onTabChange(item.value)}
                                        style={{
                                            display: 'inline-block',
                                            cursor: 'pointer',
                                            marginRight: '2rem',
                                            textTransform: 'none',
                                            padding: '1rem',
                                            fontSize: '1rem',
                                            borderBottom: this.state.activeTab === item.value ? '3px solid #0e7ceb' : 'none',
                                            opacity: this.state.activeTab === item.value ? 1 : 0.5,
                                        }}
                                    >
                                        {item.title}
                                    </span>
                                    {index !== 2 && (
                                        <Icon name="chevron right" style={{ opacity: 0.5 }} />
                                    )}
                                </React.Fragment>
                            ))}
                            {/* <Tabs
                                items={[{ title: 'AI Transcribe' }, { title: 'Proofread' }, { title: 'Completed' }]}
                                onActiveIndexChange={(index) => this.onTabChange(index)}
                                activeIndex={this.state.activeTab}
                            /> */}
                        </div>
                    )}

                />

                <div>
                    <Grid style={{ margin: '1rem', }}>

                        <RoleRenderer roles={['admin', 'review']}>
                            <Grid.Row>
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
                                    <div className="pull-right" style={{ marginLeft: '2rem' }}>
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
                                            <input type="checkbox" style={{ marginRight: 5 }} checked={allSelected} onClick={() => this.props.setAllVideoSelected(!allSelected)} />
                                            Select all videos
                                        </label>
                                        {this.state.activeTab === TABS.TRANSCRIBE && (
                                            <React.Fragment>
                                                <Separator />
                                                <Dropdown text='Transcribe'>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item
                                                            text='All videos'
                                                            onClick={() => this.onTranscribeVideo({ _id: 'all' })}
                                                            disabled={this.props.videos.length === 0}
                                                        />
                                                        <Dropdown.Item
                                                            text='Selected videos'
                                                            disabled={this.props.selectedCount === 0}
                                                            onClick={this.props.trancibeSelectedVideos}
                                                        />
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                {/* <Button
                                                    color="blue"
                                                    disabled={this.props.videos.length === 0}
                                                    onClick={() => this.onTranscribeVideo({ _id: 'all' })}
                                                >Transcribe All</Button> */}
                                            </React.Fragment>
                                        )}
                                        {this.props.selectedCount > 0 && (
                                            <React.Fragment>
                                                <Separator />
                                                <span href="javascript:void(0);" style={{ cursor: 'pointer' }} onClick={() => this.setState({ deleteVideoModalVisible: true })}>
                                                    <Icon name="trash alternate outline" color="blue" /> Delete Selected Videos
                                                </span>
                                            </React.Fragment>
                                        )}
                                        {this.props.selectedCount > 0 && (
                                            <React.Fragment>
                                                <Separator />
                                                <span href="javascript:void(0);" style={{ cursor: 'pointer' }} onClick={() => this.setState({ assignUsersToMultipleVideosModalOpen: true })}>
                                                <Icon name="add" size="small" color="blue" /> Add Transcribers To Selected Videos
                                                </span>
                                            </React.Fragment>
                                        )}
                                        {this.props.selectedCount > 0 && (
                                            <React.Fragment>
                                                <Separator />
                                                <span href="javascript:void(0);" style={{ cursor: 'pointer' }} onClick={() => this.setState({ assignVerifiersToMultipleVideosModalOpen: true })}>
                                                <Icon name="add" size="small" color="blue" /> Add Approvers To Selected Videos
                                                </span>
                                            </React.Fragment>
                                        )}
                                    </div>
                                </Grid.Column>
                                <Grid.Column width={3}>
                                    <LanguageDropdown
                                        className="pull-right"
                                        clearable
                                        options={langsOptions}
                                        value={this.props.languageFilter}
                                        onChange={this.onLanguageFilterChange}
                                    />
                                    {/* <Dropdown
                                        className="pull-right"
                                        fluid
                                        search
                                        selection
                                        clearable
                                        placeholder="All Languages"
                                        onChange={this.onLanguageFilterChange}
                                        options={langsOptions}
                                        value={this.props.languageFilter}
                                    /> */}
                                </Grid.Column>
                            </Grid.Row>
                            {this._renderTabContent()}
                            {this._renderDeleteVideoModal()}
                            {this.renderConfirmReviewModal()}
                            {this.renderEditVideoModal()}
                            {this.renderSelectCutterModal()}
                            {this.renderNotifyWithWhatsappModal()}
                        </RoleRenderer>
                    </Grid>
                </div>
            </div>

        )
    }
}


const mapStateToProps = ({ organization, authentication, organizationVideos, video }) => ({
    organization: organization.organization,
    user: authentication.user,
    languageFilter: organizationVideos.languageFilter,
    videosLoading: organizationVideos.videosLoading,
    totalPagesCount: organizationVideos.totalPagesCount,
    currentPageNumber: organizationVideos.currentPageNumber,
    selectedVideo: organizationVideos.selectedVideo,
    searchFilter: organizationVideos.searchFilter,
    organizationUsers: organization.users,
    videos: organizationVideos.videos,
    videosCounts: organizationVideos.videosCounts,
    selectedCount: organizationVideos.selectedCount,
    uploadVideoForm: video.uploadVideoForm,
})

const mapDispatchToProps = (dispatch) => ({
    fetchVideos: (params) => dispatch(videoActions.fetchVideos(params)),
    fetchVideosCount: (params) => dispatch(videoActions.fetchVideosCount(params)),
    updateVideo: (videoId, changes) => dispatch(videoActions.updateVideo(videoId, changes)),
    deleteVideo: videoId => dispatch(videoActions.deleteVideo(videoId)),
    setLanguageFilter: (langCode) => dispatch(videoActions.setLanguageFilter(langCode)),
    setCurrentPageNumber: pageNumber => dispatch(videoActions.setCurrentPageNumber(pageNumber)),
    setSelectedVideo: video => dispatch(videoActions.setSelectedVideo(video)),
    fetchUsers: (organizationId) => dispatch(organizationActions.fetchUsers(organizationId)),
    setVideoStatusFilter: filter => dispatch(videoActions.setVideoStatusFilter(filter)),
    setSearchFilter: filter => dispatch(videoActions.setSearchFilter(filter)),
    transcribeVideo: video => dispatch(videoActions.transcribeVideo(video)),
    skipTranscribe: (video, cuttingBy) => dispatch(videoActions.skipTranscribe(video, cuttingBy)),
    updateVideoReviewers: (videoId, users) => dispatch(videoActions.updateVideoReviewers(videoId, users)),
    updateVideosReviewers: (users) => dispatch(videoActions.updateVideosReviewers(users)),
    resendEmailToVideoReviewer: (videoId, userId) => dispatch(videoActions.resendEmailToVideoReviewer(videoId, userId)),
    updateVideoVerifiers: (videoId, users) => dispatch(videoActions.updateVideoVerifiers(videoId, users)),
    updateVideosVerifiers: (users) => dispatch(videoActions.updateVideosVerifiers(users)),
    resendEmailToVideoVerifier: (videoId, userId) => dispatch(videoActions.resendEmailToVideoVerifier(videoId, userId)),
    setVideoSelected: (videoId, selected) => dispatch(videoActions.setVideoSelected(videoId, selected)),
    setAllVideoSelected: (selected) => dispatch(videoActions.setAllVideoSelected(selected)),
    trancibeSelectedVideos: () => dispatch(videoActions.transcribeSelectedVideos()),
    deleteSelectedVideos: () => dispatch(videoActions.deleteSelectedVideos()),
    setUploadVideoForm: (form) => dispatch(setUploadVideoForm(form)),
});



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Review));