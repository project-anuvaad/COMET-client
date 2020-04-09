import React from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import { Grid, Card, Icon, Button, Popup } from 'semantic-ui-react';

import * as videoActions from '../../modules/actions';

import routes from '../../../../../shared/routes';
import LoaderComponent from '../../../../../shared/components/LoaderComponent';
import websockets from '../../../../../websockets';
import NotificationService from '../../../../../shared/utils/NotificationService';
import VideoCard from '../../../../../shared/components/VideoCard';

import * as organizationActions from '../../../../../actions/organization';
import { getUsersByRoles, getUserNamePreview } from '../../../../../shared/utils/helpers';
import AssignReviewUsers from '../../../../../shared/components/AssignReviewUsers';
import ReactAvatar from 'react-avatar';

const videoSTATUS = ['uploaded', 'uploading', 'transcriping', 'cutting'];

class Transcribe extends React.Component {
    state = {
        selectedVideo: null,
        assignUsersModalOpen: false,
    }

    componentWillMount = () => {
        this.props.setVideoStatusFilter(videoSTATUS);
        this.props.fetchVideos({ organization: this.props.organization._id });
        this.props.fetchUsers(this.props.organization._id);

        this.videoUploadedSub = websockets.subscribeToEvent(websockets.websocketsEvents.VIDEO_UPLOADED, (data) => {
            this.props.fetchVideos();
        })
        this.videoTranscribedSub = websockets.subscribeToEvent(websockets.websocketsEvents.VIDEO_TRANSCRIBED, (video) => {
            if (this.props.videos.map((video) => video._id).indexOf(video._id) !== -1) {
                this.props.fetchVideos();
                NotificationService.info(`${video.title} Has finished transcribing and ready for Proofreading`);
            }
        })
    }

    componentWillUnmount = () => {
        websockets.unsubscribeFromEvent(websockets.websocketsEvents.VIDEO_UPLOADED)
        websockets.unsubscribeFromEvent(websockets.websocketsEvents.VIDEO_TRANSCRIBED);
    }


    onTranscribeVideo = video => {
        console.log('on review', video);
        this.props.transcribeVideo(video);
    }
    onSkipTranscribe = video => {
        console.log('skip ', video);
        this.props.skipTranscribe(video);
    }

    onSaveAssignedUsers = (users) => {
        this.props.updateVideoReviewers(this.state.selectedVideo._id, users);
        this.setState({ selectedVideo: null, assignUsersModalOpen: false });
    }

    onAddClick = (video) => {
        this.setState({ assignUsersModalOpen: true, selectedVideo: video });
    }

    renderAssignUsers = () => (
        <AssignReviewUsers
            open={this.state.assignUsersModalOpen}
            value={this.state.selectedVideo ? this.state.selectedVideo.reviewers.map(r => r._id) : []}
            users={getUsersByRoles(this.props.organizationUsers, this.props.organization, ['admin', 'owner', 'review'])}
            onClose={() => this.setState({ assignUsersModalOpen: false, selectedVideo: null })}
            onSave={this.onSaveAssignedUsers}
        />
    )

    render() {
        return (

            <LoaderComponent active={this.props.videosLoading}>
                {this.renderAssignUsers()}
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Button
                            className="pull-right"
                            color="blue"
                            disabled={this.props.videos.length === 0}
                            onClick={() => this.onTranscribeVideo({ _id: 'all' })}
                        >Transcribe All</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    {this.props.videos && this.props.videos.length === 0 ? (
                        <div style={{ margin: 50 }}>No videos requires preview</div>
                    ) : this.props.videos && this.props.videos.map((video) => {
                        const loading = ['uploading', 'transcriping', 'cutting'].indexOf(video.status) !== -1;
                        return (
                            <Grid.Column key={video._id} width={4} style={{ marginBottom: 30 }}>
                                <VideoCard
                                    showOptions
                                    url={video.url}
                                    thumbnailUrl={video.thumbnailUrl}
                                    title={video.title}
                                    buttonTitle="AI Transcribe"
                                    loading={loading}
                                    disabled={loading}
                                    onButtonClick={() => this.onTranscribeVideo(video)}
                                    onDeleteVideoClick={() => this.props.onDeleteVideoClick(video)}
                                    onAddClick={() => this.onAddClick(video)}
                                    extra={
                                        !loading ? (
                                            <Card.Content>
                                                {video.reviewers && video.reviewers.length > 0 ? (
                                                    <div style={{ margin: 20 }}>
                                                        Review Assiged to: {video.reviewers.map((reviewer) => (
                                                            <Popup
                                                                trigger={
                                                                    <span>
                                                                        <ReactAvatar
                                                                            name={getUserNamePreview(reviewer)}
                                                                            style={{ margin: '0 10px', display: 'inline-block' }}
                                                                            size={30}
                                                                            round
                                                                        />
                                                                    </span>
                                                                }
                                                                content={getUserNamePreview(reviewer)}
                                                            />
                                                        ))}</div>
                                                ) : null}
                                                <div className="pull-right">
                                                    <Popup
                                                        content="Skip AI transcribe and proofread directly"
                                                        trigger={
                                                            <a href="javascript:void(0)" onClick={() => this.onSkipTranscribe(video)} >Skip</a>
                                                        }
                                                    />
                                                </div>
                                            </Card.Content>
                                        ) : null}
                                />
                            </Grid.Column>
                        )
                    })}

                </Grid.Row>
            </LoaderComponent>
        )
    }
}

const mapStateToProps = ({ organization, authentication, organizationVideos }) => ({
    organization: organization.organization,
    user: authentication.user,
    organizationUsers: organization.users,
    videos: organizationVideos.videos,
    languageFilter: organizationVideos.languageFilter,
    videosLoading: organizationVideos.videosLoading,
    totalPagesCount: organizationVideos.totalPagesCount,
    currentPageNumber: organizationVideos.currentPageNumber,
    selectedVideo: organizationVideos.selectedVideo,
})

const mapDispatchToProps = (dispatch) => ({
    fetchVideos: (params) => dispatch(videoActions.fetchVideos(params)),
    transcribeVideo: video => dispatch(videoActions.transcribeVideo(video)),
    skipTranscribe: video => dispatch(videoActions.skipTranscribe(video)),
    setLanguageFilter: (langCode) => dispatch(videoActions.setLanguageFilter(langCode)),
    setCurrentPageNumber: pageNumber => dispatch(videoActions.setCurrentPageNumber(pageNumber)),
    setSelectedVideo: video => dispatch(videoActions.setSelectedVideo(video)),
    updateVideoReviewers: (videoId, users) => dispatch(videoActions.updateVideoReviewers(videoId, users)),
    fetchUsers: (organizationId) => dispatch(organizationActions.fetchUsers(organizationId)),
    setVideoStatusFilter: filter => dispatch(videoActions.setVideoStatusFilter(filter)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Transcribe);