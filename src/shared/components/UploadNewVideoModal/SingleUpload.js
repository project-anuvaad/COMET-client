import React from 'react';
import { Grid, Dropdown, Progress, Input, Button, Popup, Icon, Form } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import VideoPlayer from '../VideoPlayer';
import { removeExtension } from '../../utils/helpers';

const INFO_ICON_TEXT = {
    TITLE: 'What is the "Title" of the video?',
    NO_OF_SPEAKERS: 'How many speakers are speaking in the video?',
    LANGUAGE: 'Which language is the video in?',
    TRANCRIPT: 'Do you have a .srt or .vtt subtitle file for this video?',
    BACKGROUND_MUSIC: 'Do you have the background music asset of this video? Your background music file will be automatically added to the translated video.'
}

class SingleUpload extends React.Component {

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
            this.props.onChange({ base64: reader.result });
        }
        reader.readAsDataURL(file)
    }

    onVideoDrop = (accpetedFiles) => {
        if (accpetedFiles.length > 0) {
            this.props.onChange({ content: accpetedFiles[0], name: removeExtension(accpetedFiles[0].name) });
            this.onVideoChange(accpetedFiles[0]);
        }
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
                            {this.props.value.base64 ? (
                                <VideoPlayer src={this.props.value.base64} width={'100%'} videoProps={{ width: '100%' }} />
                            ) : (
                                    <div className="dropbox">
                                        <img src="/img/upload-cloud.png" />
                                        <p className="description">Drag and drop a video file here to upload</p>
                                        <p className="extra">or just click here to choose a video file</p>
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

    render() {
        const { langsOptions, speakersOptions } = this.props;
        return (
            <Grid style={{ margin: '1.5rem' }}>
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

export default SingleUpload;
