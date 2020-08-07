import React from 'react';
import { Grid, Dropdown, Progress, Input, Button, Popup, Icon, Form } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import VideoPlayer from '../VideoPlayer';
import { removeExtension } from '../../utils/helpers';
import SuccessLottie from '../../lottie/success-animation.json';
import Lottie from 'react-lottie';
import MoveVideoModal from '../../../Pages/Organization/Videos/Translations/Folders/MoveVideoModal';
import { connect } from 'react-redux';
import * as videoActions from '../../../Pages/Organization/Videos/modules/actions';
const FILE_PREVIEW_SIZE_LIMIT = 10 * 1024 * 1024;

const INFO_ICON_TEXT = {
    TITLE: 'What is the "Title" of the video?',
    NO_OF_SPEAKERS: 'How many speakers are speaking in the video?',
    LANGUAGE: 'Which language is the video in?',
    TRANCRIPT: 'Do you have a .srt or .vtt subtitle file for this video?',
    BACKGROUND_MUSIC: 'Do you have the background music asset of this video? Your background music file will be automatically added to the translated video.',
    FOLDER: 'What is the "Folder" of the video?'
}

class SingleUpload extends React.Component {

    state = {
        moveVideoModalOpen: false,
    }

    componentWillMount = () => {
        this.props.fetchMoveVideoMainFolders();
    }

    onSubmit = () => {
        this.props.onSubmit(this.props.value);
    }

    onFieldChange = (e, { name, value, checked }) => {
        console.log('on change', name, value, checked)
        this.props.onChange({ [name]: value })
    }

    onSubtitleChange = (file) => {
        if (file) {
            this.props.onChange({ subtitle: file });
        } else {
            this.props.onChange({ withSubtitle: false });
            this.props.onChange({ subtitle: null });
        }
    }

    onFileChange = (fieldName, file) => {
        this.props.onChange({ [fieldName]: file });
    }

    onVideoChange = (file) => {
        const reader = new FileReader()
        console.log('on video change', file)
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {
            this.props.onChange({ base64: reader.result, folderId: null, folderName: null });
        }
        reader.readAsDataURL(file)
    }

    onVideoDrop = (accpetedFiles) => {
        if (accpetedFiles.length > 0) {
            const file = accpetedFiles[0];
            const fileSize = file.size;
            this.props.onChange({ content: file, name: removeExtension(accpetedFiles[0].name) });
            if (fileSize < FILE_PREVIEW_SIZE_LIMIT) {
                this.onVideoChange(accpetedFiles[0]);
            } else {
                this.props.onChange({ base64: '' })
            }
        }
    }

    renderSuccessLottie = () => {
        const defaultOptions = {
            loop: false,
            autoplay: true, 
            animationData: SuccessLottie,
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice'
            }
          }
          return <Lottie width={150} height={150} options={defaultOptions} />
    }

    renderInfoPopup = (text) => {
        return (
            <Popup content={text} trigger={<Icon name="info circle" style={{ paddingLeft: 10, cursor: 'pointer', color: 'gray' }} />} />
        )
    }

    renderRequiredStar = () => {
        return (
            <span style={{ color: 'red' }}>*</span>
        )
    }

    renderDropzone = () => {
        const { content, base64 } = this.props.value;
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
                            {!content && !base64 && (
                                <div className="dropbox">
                                    <img alt="upload cloud" src="/img/upload-cloud.png" />
                                    <p className="description">Drag and drop a video file here to upload</p>
                                    <p className="extra">or just click here to choose a video file</p>
                                </div>
                            )}
                            {base64 && (
                                <VideoPlayer src={base64} width={'100%'} videoProps={{ width: '100%' }} />
                            )}
                            {content && !base64 && (
                                <div
                                    style={{ height: 400, position: 'relative' }}
                                >
                                    <img alt="video thumbnail" style={{ width: '100%', height: '100%' }} src="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/video-placeholder.jpg" />
                                    <div style={{ position: 'absolute', top: '20%', left: 0, right: 0, textAlign: 'center' }} >
                                        <p>
                                           {this.renderSuccessLottie()} 
                                        </p>
                                        <p>
                                           Your file has been uploaded. Click on "Upload" Button
                                        </p>
                                    </div>
                                </div>
                            )}
                            <p style={{ textAlign: 'center' }}>
                                {this.props.value.content ? (
                                    <div
                                        style={{ color: '#999999' }}
                                    >
                                        You can
                                        <Button
                                            primary
                                            basic
                                            circular
                                            style={{ margin: 10 }}
                                        >
                                            choose another video
                                    </Button>
                                        or drag it here
                                    </div>
                                ) : ''}
                            </p>
                        </div>
                    </section>
                )}
            </Dropzone>
        )
    }

    _renderMoveVideoModal() {
        if (!this.state.moveVideoModalOpen) return null;
        return (
            <MoveVideoModal
                mainFolders={this.props.moveVideoMainFolders}
                openedFolder={this.props.moveVideoOpenedFolder}
                moveVideoLoading={this.props.moveVideoLoading}
                moveVideoCurrentPageNumber={this.props.moveVideoCurrentPageNumber}
                moveVideoTotalPagesCount={this.props.moveVideoTotalPagesCount}
                buttonContent='Select'
                onOpenHomePage={() => {
                    this.props.setMoveVideoOpenedFolder(null);
                    this.props.fetchMoveVideoMainFolders();
                }}
                onOpenFolder={(id) => {
                    this.props.fetchMoveVideoOpenedFolder(id);
                }}
                open={this.state.moveVideoModalOpen}
                onClose={() => {
                    this.setState({ moveVideoModalOpen: false });
                }}
                onMoveVideo={(folderId, folderName) => {
                    this.setState({ moveVideoModalOpen: false });
                    this.props.onChange({ folder: folderId, folderName });
                }}
                onLoadMoreFolders={() => {
                    this.props.loadMoreMoveVideoFolders();
                }}
            />
        );
    }

    render() {
        const { langsOptions, speakersOptions } = this.props;
        return (
            <Grid style={{ margin: '1.5rem' }}>
                {this._renderMoveVideoModal()}
                <Grid.Row>
                    <Grid.Column width={9}>
                        {this.renderDropzone()}
                        {this.props.uploadProgress ? (
                            <Progress percent={Math.floor(this.props.uploadProgress)} indicating progress />
                        ) : null}
                    </Grid.Column>
                    <Grid.Column width={7}>
                        <Grid>
                            <Grid.Row className="form-group">
                                <Grid.Column width={16}>
                                    <Form.Input
                                        fluid
                                        label={(
                                            <div>
                                                Title {this.renderRequiredStar()}
                                                {this.renderInfoPopup(INFO_ICON_TEXT.TITLE)}
                                            </div>
                                        )}
                                        type="text"
                                        value={this.props.value.name}
                                        onChange={this.onFieldChange}
                                        name="name"
                                        placeholder="Title of the video"
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={6}>
                                    <Form.Dropdown
                                        label={(
                                            <div>
                                                No. of speakers {this.renderRequiredStar()}
                                                {this.renderInfoPopup(INFO_ICON_TEXT.NO_OF_SPEAKERS)}
                                            </div>
                                        )}
                                        scrolling
                                        fluid
                                        selection
                                        value={this.props.value.numberOfSpeakers}
                                        onChange={this.onFieldChange}
                                        name="numberOfSpeakers"
                                        options={speakersOptions}
                                    />
                                </Grid.Column>
                                <Grid.Column width={10}>
                                    <Form.Dropdown
                                        search
                                        selection
                                        fluid
                                        label={(
                                            <div>
                                                Language {this.renderRequiredStar()}
                                                {this.renderInfoPopup(INFO_ICON_TEXT.LANGUAGE)}
                                            </div>
                                        )}
                                        value={this.props.value.langCode}
                                        onChange={this.onFieldChange}
                                        name="langCode"
                                        options={langsOptions}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row className="form-group">
                                <Grid.Column width={16}>
                                    <div>
                                        <div>Folder {this.renderInfoPopup(INFO_ICON_TEXT.FOLDER)}</div>
                                        <div>
                                            <span style={{ marginRight: 10 }}>{this.props.value.folderName || 'Homepage'}</span>
                                            <Button 
                                                style={{ padding: 5, fontSize: '.7rem' }}
                                                primary
                                                onClick={() => {
                                                    this.setState({ moveVideoModalOpen: true });
                                                }}
                                            >
                                                Change</Button>
                                        </div>
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={6}>
                                    <Grid>

                                        <Grid.Row className="form-group">
                                            <Grid.Column width={16}>
                                                Add Subtitle
                                        {this.renderInfoPopup(INFO_ICON_TEXT.TRANCRIPT)}
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row style={{ marginTop: 0, paddingTop: 0 }}>
                                            <Grid.Column width={16} className="label">
                                                {this.props.value.subtitle ? (
                                                    <Button
                                                        icon="close"
                                                        basic
                                                        circular
                                                        onClick={() => {
                                                            this.subtitleRef.click()
                                                        }}
                                                    >
                                                        {this.props.value.subtitle.name}
                                                        <Icon
                                                            style={{ marginLeft: 10 }}
                                                            name="close"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                this.onSubtitleChange(null);
                                                                this.subtitleRef.value = null;
                                                            }}
                                                        />
                                                    </Button>
                                                ) : (
                                                        <Button basic circular content="Upload file" onClick={() => this.subtitleRef.click()} />
                                                    )}
                                                <input
                                                    style={{ visibility: 'hidden', width: 0 }}
                                                    type="file"
                                                    accept=".srt, .vtt"
                                                    // value={this.props.subtitle}
                                                    ref={(ref) => this.subtitleRef = ref}
                                                    onChange={(e) => {
                                                        // console.log()
                                                        if (e.target.files[0]) {
                                                            this.onSubtitleChange(e.target.files[0]);
                                                        }
                                                    }}
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Grid.Column>
                                <Grid.Column width={10}>
                                    <Grid>
                                        <Grid.Row className="form-group">
                                            <Grid.Column width={16}>
                                                Background Music
                                            {this.renderInfoPopup(INFO_ICON_TEXT.BACKGROUND_MUSIC)}
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row style={{ marginTop: 0, paddingTop: 0 }}>
                                            <Grid.Column width={16} className="label">
                                                <input
                                                    style={{ visibility: 'hidden', width: 0 }}
                                                    type="file"
                                                    accept="audio/*"
                                                    // value={this.props.backgroundMusic}
                                                    ref={(ref) => this.backgroundMusicRef = ref}
                                                    onChange={(e) => {
                                                        if (e.target.files[0]) {
                                                            this.onFileChange('backgroundMusic', e.target.files[0])
                                                        }
                                                    }}
                                                />
                                                {this.props.value.backgroundMusic ? (
                                                    <Button
                                                        basic
                                                        circular
                                                        onClick={() => {
                                                            this.backgroundMusicRef.click();
                                                        }}
                                                    >
                                                        {this.props.value.backgroundMusic.name}
                                                        <Icon
                                                            name="close"
                                                            style={{ marginLeft: 10 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();

                                                                this.onFileChange('backgroundMusic', null)
                                                                this.backgroundMusicRef.value = null;
                                                            }}
                                                        />
                                                    </Button>
                                                ) : (
                                                        <Button basic circular content="Upload file" onClick={() => this.backgroundMusicRef.click()} />
                                                    )}
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Grid.Column>
                            </Grid.Row>

                            <div
                                style={{ position: 'absolute', bottom: 0, right: 0 }}
                            >
                                <Button
                                    circular
                                    style={{ paddingLeft: '3rem', paddingRight: '3rem' }}

                                    onClick={this.props.onClose}
                                    size={'large'}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    circular
                                    onClick={this.props.onSubmit}
                                    disabled={this.props.disabled}
                                    loading={this.props.loading}
                                    primary
                                    style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                                    size={'large'}
                                >
                                    Upload
                                    </Button>
                            </div>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>

            </Grid >
        )
    }
}

const mapStateToProps = ({ organizationVideos }) => ({
    openedFolder: organizationVideos.openedFolder,
    moveVideoMainFolders: organizationVideos.moveVideoMainFolders,
    moveVideoOpenedFolder: organizationVideos.moveVideoOpenedFolder,
    moveVideoLoading: organizationVideos.moveVideoLoading,
    moveVideoCurrentPageNumber: organizationVideos.moveVideoCurrentPageNumber,
    moveVideoTotalPagesCount: organizationVideos.moveVideoTotalPagesCount,
});

const mapDispatchToProps = (dispatch) => ({
    fetchMoveVideoMainFolders: () => dispatch(videoActions.fetchMoveVideoMainFolders()),
    fetchMoveVideoOpenedFolder: (id) => dispatch(videoActions.fetchMoveVideoOpenedFolder(id)),
    loadMoreMoveVideoFolders: () => dispatch(videoActions.loadMoreMoveVideoFolders()),
    setMoveVideoOpenedFolder: (folder) => dispatch(videoActions.setMoveVideoOpenedFolder(folder)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleUpload);