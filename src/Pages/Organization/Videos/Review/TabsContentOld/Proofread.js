import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Grid, Icon, Card, Button, Popup } from 'semantic-ui-react';
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

const videoSTATUS = ['proofreading', 'converting'];

class Proofread extends React.Component {

    state = {
        selectedVideo: null,
        assignUsersModalOpen: false,
    }

    componentWillMount = () => {
        this.props.setVideoStatusFilter(videoSTATUS);
        this.props.fetchVideos();
        this.props.fetchUsers(this.props.organization._id);
        this.videoDoneSub = websockets.subscribeToEvent(websockets.websocketsEvents.VIDEO_DONE, (video) => {
            this.props.fetchVideos();
            NotificationService.success(`The video "${video.title}" has been converted successfully!`);
        })
    }

    componentWillUnmount = () => {
        websockets.unsubscribeFromEvent(websockets.websocketsEvents.VIDEO_DONE);
    }

    navigateToConvertProgresss = videoId => {
        // this.props.history.push();
        window.location.href  = routes.convertProgressV2(videoId)
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
                    {this.props.videos && this.props.videos.length === 0 ? (
                        <div style={{ margin: 50 }}>No videos requires proofreading</div>
                    ) : this.props.videos && this.props.videos.map((video) => {
                        return (
                            <Grid.Column key={video._id} width={4}>
                                <VideoCard
                                    showOptions
                                    url={video.url}
                                    thumbnailUrl={video.thumbnailUrl}
                                    title={video.title}
                                    buttonTitle="Proofread"
                                    loading={video.status === 'converting'}
                                    disabled={video.status === 'converting'}
                                    onButtonClick={() => this.navigateToConvertProgresss(video._id)}
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
    setLanguageFilter: (langCode) => dispatch(videoActions.setLanguageFilter(langCode)),
    setCurrentPageNumber: pageNumber => dispatch(videoActions.setCurrentPageNumber(pageNumber)),
    setSelectedVideo: video => dispatch(videoActions.setSelectedVideo(video)),
    setVideoStatusFilter: filter => dispatch(videoActions.setVideoStatusFilter(filter)),
    updateVideoReviewers: (videoId, users) => dispatch(videoActions.updateVideoReviewers(videoId, users)),
    fetchUsers: (organizationId) => dispatch(organizationActions.fetchUsers(organizationId)),
});



export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Proofread));