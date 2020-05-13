import React from 'react';
import { Grid, Modal, Button } from 'semantic-ui-react';
import VideoCard from '../../../../../shared/components/VideoCard';

class Completed extends React.Component {
    state = {
        selectedVideo: null,
        confirmReviewModalVisible: false
    }

    onRereviewVideo = video => {
        console.log('on review', video);
        this.props.onRereviewVideo(video);
    }


    onRereviewVideoClick = video => {
        this.setState({ selectedVideo: video });
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
                    this.setState({ confirmReviewModalVisible: false, selectedVideo: null });
                }}>
                    Cancel
                </Button>
                <Button color="blue" onClick={() => {
                    this.onRereviewVideo(this.state.selectedVideo);
                    this.setState({ confirmReviewModalVisible: false, selectedVideo: null });
                }}>
                    Yes
                </Button>
            </Modal.Actions>
        </Modal>
    )


    render() {
        return (
            <Grid.Row>
                {this.props.videos && this.props.videos.length === 0 ? (
                    <div style={{ margin: 50 }}>No videos completed yet</div>
                ) : this.props.videos && this.props.videos.map((video) => {
                    return (
                        <Grid.Column key={video._id} width={4}>
                            <VideoCard
                                showOptions
                                subTitle={video.organization && video.organization.name ? `Orgnization: ${video.organization.name}` : ''}
                                url={video.url}
                                thumbnailUrl={video.thumbnailUrl}
                                title={video.title}
                                buttonTitle="Re-review"
                                onButtonClick={() => this.onRereviewVideoClick(video)}
                            />
                        </Grid.Column>
                    )
                })}
                {this.renderConfirmReviewModal()}
            </Grid.Row>
        )
    }
}

export default Completed;