import React from 'react';
import { connect } from 'react-redux';
import { Grid, Input, Button, Card, Modal, Progress, Tab } from 'semantic-ui-react';
import LoaderComponent from '../../../shared/components/LoaderComponent';
import ClearPagination from '../../../shared/components/ClearPagination';
import Dropzone from 'react-dropzone';

import { debounce } from '../../../shared/utils/helpers';
import websockets from '../../../websockets';

import * as actions from './modules/actions';
import NotificationService from '../../../shared/utils/NotificationService';

class NoiseCancellation extends React.Component {

    state = {
        fileContent: null,
        video: null,
        title: '',
    }

    constructor(props) {
        super(props);
        this.initSocketSub()
        this.debouncedSearch = debounce((searchTerm) => {
            this.props.setCurrentPageNumber(1);
            this.props.fetchVideos();
        }, 500)
    }

    componentWillMount = () => {
        this.props.fetchVideos();
    }

    componentWillReceiveProps = nextProps => {
        if (this.props.uploadFormOpen !== nextProps.uploadFormOpen) {
            this.setState({ title: '', video: null, fileContent: null });
        }
    }

    initSocketSub = () => {
        this.socketSub = websockets.subscribeToEvent(`${websockets.websocketsEvents.NOISE_CANCELLATION_VIDEO_FINISH}`, (data) => {
            const { noiseCancellationVideo } = data;
            if (noiseCancellationVideo && this.props.videos.find(v => v._id === noiseCancellationVideo._id)) {
                this.props.fetchVideos();
            } else {
                NotificationService.success(`Processing finished for the video ${noiseCancellationVideo.title}`);
            }
        })
    }

    componentWillUnmount = () => {
        websockets.unsubscribeFromEvent(`${websockets.websocketsEvents.NOISE_CANCELLATION_VIDEO_FINISH}`)
    }

    onSearchChange = (searchTerm) => {
        this.props.setSearchFilter(searchTerm);
        this.debouncedSearch()
    }

    onVideoChange = (file) => {
        const reader = new FileReader()
        console.log('on video change', file)
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {
            this.setState({ fileContent: reader.result });
        }
        reader.readAsDataURL(file)
    }

    onVideoDrop = (accpetedFiles) => {
        if (accpetedFiles.length > 0) {
            this.setState({ video: accpetedFiles[0] });
            this.onVideoChange(accpetedFiles[0]);
        }
    }

    onUploadVideo = () => {
        const { video, title } = this.state;
        if (!video || !title) return;
        this.props.uploadVideo(video, title);
    }

    onPageChange = (e, { activePage }) => {
        this.props.setCurrentPageNumber(activePage);
        this.props.fetchVideos();
    }

    renderPagination = () => (
        <ClearPagination
            activePage={this.props.currentPageNumber}
            onPageChange={this.onPageChange}
            totalPages={this.props.totalPagesCount}
        />
    )

    renderVideoCard = (video) => {
        let color;
        if (video.status === 'done') {
            color = 'green';
        } else if (video.status === 'failed') {
            color = 'red';
        } else {
            color = 'gray';
        }
        const panes = !video.noiseCancelledUrl ? [] : [
            {
                menuItem: 'Original',
                render: () => <Tab.Pane>

                    <h3 style={{ padding: '1rem', fontWeight: 'bold', textAlign: 'center' }} >
                        {video.title}
                    </h3>

                    <video
                        controls
                        width={'100%'}
                        src={video.url}
                    />
                </Tab.Pane>
            },
            {
                menuItem: 'Noise Canceled',
                render: () => <Tab.Pane>

                    <h3 style={{ padding: '1rem', fontWeight: 'bold', textAlign: 'center' }} >
                        {video.title}
                    </h3>
                    <video
                        controls
                        width={'100%'}
                        src={video.noiseCancelledUrl}
                    />
                </Tab.Pane>
            },

        ]
        return (
            <Card>
                {!video.noiseCancelledUrl && (
                    <Card.Header style={{ padding: '1rem', fontWeight: 'bold', textAlign: 'center' }}>
                        <h3>
                            {video.title}
                        </h3>
                    </Card.Header>
                )}
                {/* <Card.Content> */}
                {!video.noiseCancelledUrl ? (

                    <video
                        controls
                        width={'100%'}
                        src={video.url}
                    />
                ) : (
                        <Tab
                            panes={panes}
                        />
                    )}
                {/* </Card.Content> */}
                <Card.Content>
                    <span style={{ color: 'rgba(0,0,0,.4)'}}>status: </span><strong>
                        <span
                            style={{ color, textTransform: 'capitalize' }}
                        >
                            {video.status}
                        </span>
                    </strong>
                    {video.noiseCancelledUrl && (
                        <a className="pull-right" href={video.noiseCancelledUrl} target="_blank">Download</a>
                    )}
                </Card.Content>
            </Card>
        )
    }

    renderDropzone = () => {
        return (
            <Dropzone
                multiple={false}
                // disablePreview={true}
                accept="video/*,audio/*"
                onDrop={this.onVideoDrop}>
                {({ getRootProps, getInputProps }) => (
                    <section>
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            {this.state.fileContent ? (
                                <video src={this.state.fileContent} width={'100%'} controls />
                            ) : (
                                    <div className="dropbox">
                                        <svg className="box__icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43"><path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z" /></svg>
                                    </div>
                                )}
                            <p style={{ textAlign: 'center' }}>
                                {this.state.fileContent ? (
                                    <Button
                                        primary
                                        style={{ margin: '2rem' }}
                                    >
                                        You can choose another video/audio or drag it here
                                    </Button>
                                ) : 'Choose a video or drag it here.'}
                            </p>
                        </div>
                    </section>
                )}
            </Dropzone>
        )
    }


    renderUploadModal = () => {

        return (
            <Modal
                open={this.props.uploadFormOpen}
                onClose={() => this.props.setUploadFormOpen(false)}
                size="small"
            >
                <Modal.Header>
                    Upload Video
                </Modal.Header>
                <Modal.Content>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                {this.renderDropzone()}
                            </Grid.Column>
                            {this.props.uploadProgress ? (
                                <Grid.Column width={16}>
                                    <Progress percent={Math.floor(this.props.uploadProgress)} indicating progress />
                                </Grid.Column>
                            ) : null}
                        </Grid.Row>
                        <Grid.Row className="form-group">
                            <Grid.Column width={3} className="label">
                                Title
                            </Grid.Column>
                            <Grid.Column width={13}>
                                <Input fluid type="text" value={this.state.title} onChange={(e) => this.setState({ title: e.target.value })} name="title" />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => this.props.setUploadFormOpen(false)}>Cancel</Button>
                    <Button
                        primary
                        onClick={this.onUploadVideo}
                        loading={this.props.uploadVideoLoading}
                        disabled={this.props.uploadVideoLoading || (!this.state.video) || !this.state.title}
                    >
                        Upload
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }

    render() {
        return (

            <Grid style={{ padding: '1rem' }}>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Button
                            className="pull-right"
                            primary
                            circular
                            size="large"
                            icon="upload"
                            content="Upload"
                            onClick={() => this.props.setUploadFormOpen(true)}
                        />
                    </Grid.Column>
                </Grid.Row>
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
                    <LoaderComponent active={this.props.loading}>
                        {this.props.videos.length === 0 ? (
                            <Grid.Column width={16}>No videos/Audios uploaded yet</Grid.Column>
                        ) : (
                                this.props.videos.map((video) => (
                                    <Grid.Column width={4} key={video._id} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                                        {this.renderVideoCard(video)}
                                    </Grid.Column>
                                ))
                            )}
                    </LoaderComponent>
                    {this.renderUploadModal()}
                </Grid.Row>
            </Grid >
        )
    }
}

const mapStateToProps = ({ noiseCancellationVideos }) => ({
    ...noiseCancellationVideos,
})

const mapDispatchToProps = (dispatch) => ({
    setCurrentPageNumber: page => dispatch(actions.setCurrentPageNumber(page)),
    setSearchFilter: filter => dispatch(actions.setSearchFilter(filter)),
    fetchVideos: () => dispatch(actions.fetchVideos()),
    uploadVideo: (fileContent, title) => dispatch(actions.uploadVideo(fileContent, title)),
    setUploadFormOpen: open => dispatch(actions.setUploadFormOpen(open)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NoiseCancellation);