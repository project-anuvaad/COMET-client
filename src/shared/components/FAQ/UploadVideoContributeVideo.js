import React from 'react';
import { Grid, Input, Button, Card, Modal, Progress, Tab } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import requestAgent from '../../../shared/utils/requestAgent';
import api from '../../../shared/api';
import NotificationService from '../../../shared/utils/NotificationService';


const INITIAL_STATE = {
    loading: false,
    uploadFormOpen: false,
    fileContent: null,
    video: null,
    title: '',
}

class UploadVideoContributeVideo extends React.Component {
    state = {
        ...INITIAL_STATE

    }

    isFormValid = () => {
        return this.state.title && this.state.video && !this.state.loading
    }

    onUploadVideo = () => {
        const { title, video, } = this.state;
        const req = requestAgent.post(api.videoTutorialContribution.uploadVideo())
        req.field('title', title);
        req.attach('video', video);
        this.setState({ loading: true });
        req.then((res) => {
            NotificationService.success('Video uploaded successfuly and under review!');
            this.setState({ ...INITIAL_STATE });
            // this.loadVideos();            
        })
        .catch(err => {
            console.log(err);
            this.setState({ loading: false });            
            NotificationService.responseError(err);
        })
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

    renderDropzone = () => {
        return (
            <Dropzone
                multiple={false}
                // disablePreview={true}
                accept="video/*"
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
                                        You can choose another video or drag it here
                                    </Button>
                                ) : 'Choose a video or drag it here.'}
                            </p>
                        </div>
                    </section>
                )}
            </Dropzone>
        )
    }

    render() {
        return (
            <Modal
                open={this.state.uploadFormOpen}
                onClose={() => this.setState({ uploadFormOpen: false })}
                size="small"
                trigger={(
                    <Button primary circular size="huge" content="Contribute video tutorial" onClick={() => this.setState({ uploadFormOpen: true })} />
                )}
            >
                <Modal.Header>
                    Upload Video
                </Modal.Header>
                <Modal.Content>
                    <Grid>

                        <Grid.Row className="form-group">
                            <Grid.Column width={3} className="label">
                                Title
                            </Grid.Column>
                            <Grid.Column width={13}>
                                <Input fluid type="text" value={this.state.title} onChange={(e) => this.setState({ title: e.target.value })} name="title" />
                            </Grid.Column>
                        </Grid.Row>
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
                    </Grid>

                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => this.setState({ uploadFormOpen: false })}>Cancel</Button>
                    <Button
                        primary
                        onClick={this.onUploadVideo}
                        loading={this.state.loading}
                        disabled={!this.isFormValid()}
                    >
                        Upload
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

export default UploadVideoContributeVideo;