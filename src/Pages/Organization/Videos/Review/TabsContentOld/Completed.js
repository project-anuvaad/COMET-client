import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Grid, Icon, Card, Button, Modal, Popup } from 'semantic-ui-react';
import routes from '../../../../../shared/routes';
import LoaderComponent from '../../../../../shared/components/LoaderComponent';
import * as videoActions from '../../modules/actions';
import websockets from '../../../../../websockets';
import NotificationService from '../../../../../shared/utils/NotificationService';
import VideoCard from '../../../../../shared/components/VideoCard';

import * as organizationActions from '../../../../../actions/organization';
import { getUsersByRoles, getUserNamePreview } from '../../../../../shared/utils/helpers';
import AssignReviewUsers from '../../../../../shared/components/AssignReviewUsers';
import ReactAvatar from 'react-avatar';

const videoSTATUS = ['done'];

class Completed extends React.Component {
    state = {
        confirmReviewModalVisible: false,
        selectedVideo: null,
        assignUsersModalOpen: false,
    }

    componentWillMount = () => {
        this.props.setCurrentPageNumber(1);
        this.props.setVideoStatusFilter(videoSTATUS);
        this.props.fetchUsers(this.props.organization._id);

        this.props.fetchVideos();
        this.videoDoneSub = websockets.subscribeToEvent(websockets.websocketsEvents.VIDEO_DONE, (video) => {
            this.props.fetchVideos();
            NotificationService.success(`The video "${video.title}" has been converted successfully!`);
        })
    }

    componentWillUnmount = () => {
        websockets.unsubscribeFromEvent(websockets.websocketsEvents.VIDEO_DONE);
    }

    onTranscribeVideo = video => {
        console.log('on review', video);
        this.props.transcribeVideo(video);
    }

    onTranscribeVideoClick = video => {
        this.props.setSelectedVideo(video);
        this.setState({ confirmReviewModalVisible: true });
    }


    renderConfirmReviewModal = () => (
        <Modal open={this.state.confirmReviewModalVisible} size="tiny">
            <Modal.Header>Re-Review Video</Modal.Header>
            <Modal.Content>
                <p>Are you sure you want to re-review this video? <small><strong>( All current translations will be archived )</strong></small></p>

            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => {
                    this.setState({ confirmReviewModalVisible: false });
                    this.props.setSelectedVideo(null);
                }}>
                    Cancel
                </Button>
                <Button color="blue" onClick={() => {
                    this.setState({ confirmReviewModalVisible: false });
                    this.onTranscribeVideo(this.props.selectedVideo);
                    this.props.setSelectedVideo(null);
                }}>
                    Yes
                </Button>
            </Modal.Actions>
        </Modal>
    )


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
            users={getUsersByRoles(this.props.organizationUsers, this.props.organization, ['owner', 'admin', 'review'])}
            onClose={() => this.setState({ assignUsersModalOpen: false, selectedVideo: null })}
            onSave={this.onSaveAssignedUsers}
        />
    )


    render() {
        return (
            <LoaderComponent active={this.props.videosLoading}>
                {this.renderAssignUsers()}

                <Grid.Row>
                    {this.props.videos && this.props.videos.length === 0 ? (
                        <div style={{ margin: 50 }}>No videos completed yet</div>
                    ) : this.props.videos && this.props.videos.map((video) => {
                        return (
                            <Grid.Column key={video._id} width={4}>
                                <VideoCard
                                    showOptions
                                    url={video.url}
                                    thumbnailUrl={video.thumbnailUrl}
                                    title={video.title}
                                    buttonTitle="Re-review"
                                    onButtonClick={() => this.onTranscribeVideoClick(video)}
                                    onDeleteVideoClick={() => this.props.onDeleteVideoClick(video)}
                                    onAddClick={() => this.onAddClick(video)}
                                    extra={video.reviewers && video.reviewers.length > 0 ? (
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
                                />
                            </Grid.Column>
                        )
                    })}
                    {this.renderConfirmReviewModal()}
                </Grid.Row>
            </LoaderComponent>
        )
    }
}

const mapStateToProps = ({ organization, authentication, organizationVideos }) => ({
    organization: organization.organization,
    user: authentication.user,
    videos: organizationVideos.videos,
    organizationUsers: organization.users,
    languageFilter: organizationVideos.languageFilter,
    videosLoading: organizationVideos.videosLoading,
    totalPagesCount: organizationVideos.totalPagesCount,
    currentPageNumber: organizationVideos.currentPageNumber,
    selectedVideo: organizationVideos.selectedVideo,
})

const mapDispatchToProps = (dispatch) => ({
    fetchVideos: (params) => dispatch(videoActions.fetchVideos(params)),
    transcribeVideo: video => dispatch(videoActions.transcribeVideo(video)),
    setLanguageFilter: (langCode) => dispatch(videoActions.setLanguageFilter(langCode)),
    setCurrentPageNumber: pageNumber => dispatch(videoActions.setCurrentPageNumber(pageNumber)),
    setSelectedVideo: video => dispatch(videoActions.setSelectedVideo(video)),
    fetchUsers: (organizationId) => dispatch(organizationActions.fetchUsers(organizationId)),
    updateVideoReviewers: (videoId, users) => dispatch(videoActions.updateVideoReviewers(videoId, users)),
    setVideoStatusFilter: filter => dispatch(videoActions.setVideoStatusFilter(filter)),
});



export default connect(mapStateToProps, mapDispatchToProps)(Completed);