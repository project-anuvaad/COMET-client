import React from 'react';
import { connect } from 'react-redux';
import { Card, Button, Grid, Progress, Modal, Icon } from 'semantic-ui-react';
import './style.scss';
import * as videoActions from '../../../actions/video';
import * as organizationVideosActions from '../../../Pages/Organization/Videos/modules/actions';
import MinizableComponent from '../../components/MinizableComponent';
import VideoUploadProgressCard from './VideoUploadProgressCard';
import VideoTranscribeCard from './VideoTranscribeCard';
import VideoProofreadCard from './VideoProofreadCard';
import VideoCompletedCard from './VideoCompletedCard';
import websockets from '../../../websockets';
import routes from '../../routes';

class UploadProgressBox extends React.Component {
    state = {
        open: true,
        minimized: false,
        closeModalOpen: false,
    }

    componentDidMount = () => {
        this.videoTranscribedSub = websockets.subscribeToEvent(websockets.websocketsEvents.VIDEO_TRANSCRIBED, this.onVideoTranscribed)
        this.videoDoneSub = websockets.subscribeToEvent(websockets.websocketsEvents.VIDEO_DONE, this.onVideoCompleted)
        this.props.fetchUploadedVideos();
    }

    componentWillUnmount = () => {
        websockets.unsubscribeFromEvent(websockets.websocketsEvents.VIDEO_TRANSCRIBED, this.onVideoTranscribed);
        websockets.unsubscribeFromEvent(websockets.websocketsEvents.VIDEO_DONE, this.onVideoCompleted);
    }

    onVideoTranscribed = (video) => {
        this.updateUploadedVideos(video)
    }

    onVideoCompleted = (video) => {
        this.updateUploadedVideos(video)
    }

    updateUploadedVideos = video => {
        const { uploadedVideos } = this.props;
        const oldVideoIndex = uploadedVideos.findIndex(v => v._id === video._id);
        if (oldVideoIndex !== -1) {
            const newVideos = uploadedVideos;
            newVideos[oldVideoIndex] = video;
            this.props.setUploadedVideos(newVideos.slice());
        }
    }

    toggleMinimize = () => {
        this.setState({ minimized: !this.state.minimized });
    }

    onCloseModal = () => {
        this.setState({ closeModalOpen: false });
    }

    onCancelUpload = () => {
        const { uploadProgressingCount } = this.getVideosCounts();
        if (uploadProgressingCount > 0) {
            this.props.abortAllVideoUploads();
        } else {
            //  Clear form
            this.props.setUploadVideoForm({ ...this.props.uploadVideoForm, videos: [] });
        }
        this.props.setUploadedVideos([]);
        this.onCloseModal();
    }


    onTranscribeVideo = (video) => {
        if (video.status === 'cutting') {
            window.location.href = routes.convertProgressV2(video._id)
        } else {
            this.props.skipTranscribe(video, 'self')
        }
        this.props.transcribeVideo(video);
        video.status = 'cutting';
        this.updateUploadedVideos({ ...video });
    }

    getVideos = () => {
        return this.props.uploadVideoForm.videos.filter(v => v.started).concat(this.props.uploadedVideos);
        // if (this.props.uploadVideoForm.videos.length > 0) return this.props.uploadVideoForm.videos;
        // return this.props.uploadedVideos
    }

    getVideosCounts = () => {
        const videos = this.getVideos();
        let uploadProgressingCount = 0;
        let uploadedCount = 0;
        let transcribedCount = 0;
        let completedCount = 0;
        let transcribingCount = 0;
        let totalCount = videos.length;
        videos.forEach(v => {
            if (v.progress && v.progress >= 0 && v.progress < 100) {
                uploadProgressingCount += 1;
            } else if (!v._id && v.progress === 100) {
                uploadedCount += 1;
            } else if (v.status === 'uploaded') {
                uploadedCount += 1;
            } else if (v.status === 'transcriping') {
                transcribingCount += 1
            } else if (v._id && ['proofreading', 'converting'].indexOf(v.status) !== -1) {
                transcribedCount += 1;
            } else if (v._id && v.status === 'done') {
                completedCount += 1;
            }
        })
        return { uploadedCount, transcribedCount, transcribingCount, completedCount, uploadProgressingCount, totalCount };
    }

    getTitle = () => {
        const { uploadedCount, transcribingCount, transcribedCount, completedCount, totalCount } = this.getVideosCounts();
        if (completedCount > 0) {
            return (
                <span>Completed {completedCount} of {totalCount} videos</span>
            )
        }

        if (transcribedCount > 0) {
            return (
                <span> Transcribed {transcribedCount} of {totalCount} videos</span>
            )
        }

        if (transcribingCount > 0) {
            return (
                <span> Transcribing {transcribingCount} video</span>
            )
        }

        return uploadedCount === 0 ? (
            <span>
                Uploading {totalCount} videos
            </span>
        ) : (
                <span>
                    Uploaded {uploadedCount} of {totalCount}
                </span>
            )
    }

    renderCancelAllUpload = () => (
        <Modal
            size="tiny"
            open={this.state.closeModalOpen}
            onClose={this.onCloseModal}
        >
            <Modal.Header>
                CLOSE WINDOW
                <Button
                    onClick={this.onCloseModal}
                    className="pull-right"
                    color="white"
                    color="gray"
                    circular
                    icon="close"
                />
            </Modal.Header>
            <Modal.Content>
                <p>
                    Are you sure you want to close this window? {this.getVideosCounts().uploadProgressingCount > 0 && (
                        <small>(any pending uploads will be cancelled)</small>
                    )}
                </p>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    circular
                    onClick={this.onCloseModal}
                    primary
                >
                    No
                </Button>
                <Button
                    circular
                    onClick={this.onCancelUpload}
                >
                    Yes
                </Button>
            </Modal.Actions>
        </Modal>
    )

    render() {
        const { className } = this.props;
        const videos = this.getVideos();
        if (videos.length === 0) return null;
        // if (this.props.uploadState !== 'loading') return null;
        const title = this.getTitle();

        return (
            <div
                className={`${className ? className : ''} upload-progress-box`}
            >
                <MinizableComponent
                    onClose={() => this.setState({ closeModalOpen: true })}
                    title={title}
                    className={className}
                >
                    <Grid>
                        {videos.map((video, index) => {
                            if (!video._id) {
                                return (
                                    <VideoUploadProgressCard
                                        key={`upload-video-list-items-${video.name}`}
                                        video={video}
                                        animating={index === 0}
                                        abortVideoUpload={() => this.props.abortVideoUpload(index)}
                                    />
                                )
                            }
                            if (['uploaded', 'transcriping', 'cutting'].indexOf(video.status) !== -1) {
                                return <VideoTranscribeCard
                                    video={video}
                                    animating={index === 0}
                                    index={index}
                                    key={`upload-video-list-items-${video._id}`}
                                    onTranscribe={() => this.onTranscribeVideo(video)}
                                />
                            }
                            if (['proofreading', 'converting'].indexOf(video.status) !== -1) {
                                return (
                                    <VideoProofreadCard
                                        video={video}
                                        animating={index === 0}
                                        index={index}
                                        key={`upload-video-list-items-${video._id}`}
                                    />
                                )
                            }
                            if (['done'].indexOf(video.status) !== -1) {
                                return (
                                    <VideoCompletedCard index={index} key={`upload-video-list-items-${video._id}`} video={video} />
                                )
                            }
                        }
                        )}
                    </Grid>
                </MinizableComponent>
                {this.renderCancelAllUpload()}
            </div>
        )
    }
}

const mapStateToProps = ({ video }) => ({
    uploadVideoForm: video.uploadVideoForm,
    uploadState: video.uploadState,
    uploadedVideos: video.uploadedVideos,
})

const mapDispatchToProps = (dispatch) => ({
    abortVideoUpload: videoIndex => dispatch(videoActions.abortVideoUpload(videoIndex)),
    abortAllVideoUploads: () => dispatch(videoActions.abortAllVideoUploads()),
    transcribeVideo: video => dispatch(organizationVideosActions.transcribeVideo(video)),
    skipTranscribe: (video, cuttingBy) => dispatch(organizationVideosActions.skipTranscribe(video, cuttingBy)),
    setUploadVideoForm: form => dispatch(videoActions.setUploadVideoForm(form)),
    setUploadedVideos: videos => dispatch(videoActions.setUploadedVideos(videos)),
    fetchUploadedVideos: () => dispatch(videoActions.fetchUploadedVideos())
})

export default connect(mapStateToProps, mapDispatchToProps)(UploadProgressBox);