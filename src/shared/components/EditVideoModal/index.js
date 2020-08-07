import React from 'react';
import { Icon, Modal, Popup, Grid, Input, Dropdown, Button } from 'semantic-ui-react';

import { supportedLangs, isoLangsArray } from '../../constants/langs';
import MoveVideoModal from '../../../Pages/Organization/Videos/Translations/Folders/MoveVideoModal';
import { connect } from 'react-redux';
import * as videoActions from '../../../Pages/Organization/Videos/modules/actions';

const speakersOptions = Array.apply(null, { length: 10 }).map(Number.call, Number).map((a, index) => ({ value: index + 1, text: index + 1 }));
let langsToUse = supportedLangs.map((l) => ({ ...l, supported: true })).concat(isoLangsArray.filter((l) => supportedLangs.every((l2) => l2.code.indexOf(l.code) === -1)))
const langsOptions = langsToUse.map((lang) => ({ key: lang.code, value: lang.code, text: `${lang.name} ( ${lang.code} ) ${lang.supported ? ' < Auto >' : ''}` }));

const INFO_ICON_TEXT = {
    TITLE: 'What is the "Title" of the video?',
    NO_OF_SPEAKERS: 'How many speakers are speaking in the video?',
    LANGUAGE: 'Which language is the video in?',
    TRANCRIPT: 'Do you have a .srt or .vtt subtitle file for this video?',
    BACKGROUND_MUSIC: 'Do you have the background music asset of this video? Your background music file will be automatically added to the translated video.',
    FOLDER: 'What is the "Folder" of the video?',
}

class EditVideoModal extends React.Component {
    state = {
        moveVideoModalOpen: false,
        folderName: null,
        folderId: null,
        oldFolderCached: false
    }

    componentWillMount = () => {
        this.props.fetchMoveVideoMainFolders();
    }

    componentWillUpdate(nextProps) {
        if (nextProps.value && nextProps.value.folder && nextProps.value.folder._id !== this.state.folderId && !this.state.oldFolderCached) {
            this.setState({ folderName: nextProps.value.folder.name, folderId: nextProps.value.folder._id, oldFolderCached: true });
        }
    }

    renderInfoPopup = (text) => {
        return (
            <Popup content={text} trigger={<Icon name="info circle" style={{ paddingLeft: 10, cursor: 'pointer' }} />} />
        )
    }

    renderRequiredStar = () => {
        return (
            <span style={{ color: 'red' }}>*</span>
        )
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
            this.props.onChange({ subtitle: '' });
        }
    }

    onFileChange = (fieldName, file) => {
        this.props.onChange({ [fieldName]: file });
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
                    this.setState({ moveVideoModalOpen: false, folderName, folderId });
                    this.props.onChange({ folder: folderId || '' });
                }}
                onLoadMoreFolders={() => {
                    this.props.loadMoreMoveVideoFolders();
                }}
            />
        );
    }

    render() {
        const { open, value, initialValue, onClose } = this.props;
        return (
            <Modal open={open} size="small" onClose={onClose}>
                {this._renderMoveVideoModal()}
                <Modal.Header>
                    {value ? value.title : 'Edit Video'}
                    <Button
                        // basic
                        onClick={onClose}
                        className="pull-right"
                        circular
                        icon="close"
                    />

                </Modal.Header>
                {value && (
                    <Modal.Content>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <Button
                                        onClick={() => {
                                            this.props.onReset();
                                            this.subtitleRef.value = null;
                                            this.backgroundMusicRef.value = null;
                                        }}
                                        className="pull-right"
                                    >
                                        <Icon name="refresh" />
                                        Reset
                                    </Button>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row className="form-group">
                                <Grid.Column width={4} className="label">
                                    Title {this.renderRequiredStar()}
                                    {this.renderInfoPopup(INFO_ICON_TEXT.TITLE)}
                                </Grid.Column>
                                <Grid.Column width={12}>
                                    <Input fluid type="text" value={this.props.value.title} onChange={this.onFieldChange} name="title" />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row className="form-group">
                                <Grid.Column width={4} className="label">
                                    No. of speakers {this.renderRequiredStar()}
                                    {this.renderInfoPopup(INFO_ICON_TEXT.NO_OF_SPEAKERS)}
                                </Grid.Column>
                                <Grid.Column width={12}>
                                    <Dropdown
                                        scrolling
                                        value={this.props.value.numberOfSpeakers}
                                        onChange={this.onFieldChange}
                                        name="numberOfSpeakers"
                                        options={speakersOptions}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row className="form-group">
                                <Grid.Column width={4} className="label">
                                    Language {this.renderRequiredStar()}
                                    {this.renderInfoPopup(INFO_ICON_TEXT.LANGUAGE)}

                                </Grid.Column>
                                <Grid.Column width={12}>
                                    <Dropdown
                                        search
                                        selection
                                        fluid
                                        value={this.props.value.langCode}
                                        onChange={this.onFieldChange}
                                        name="langCode"
                                        options={langsOptions}
                                    />
                                    {value && initialValue && value.status !== 'uploaded' && value.langCode && value.langCode !== initialValue.langCode && (
                                        <small>
                                            <strong>
                                                Changing the language will cause the video to be back to the trancribe stage
                                            </strong>
                                        </small>
                                    )}
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row className="form-group">
                                <Grid.Column width={4}>
                                    Folder {this.renderInfoPopup(INFO_ICON_TEXT.FOLDER)}
                                </Grid.Column>
                                <Grid.Column width={12}>
                                    <span style={{ marginRight: 10 }}>{this.state.folderName || 'Homepage'}</span>
                                    <Button 
                                        size="mini" 
                                        onClick={() => {
                                            this.setState({ moveVideoModalOpen: true });
                                        }}
                                    >
                                        Change</Button>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row className="form-group">
                                <Grid.Column width={4}>
                                    Transcript
                                    {this.renderInfoPopup(INFO_ICON_TEXT.TRANCRIPT)}
                                </Grid.Column>
                                <Grid.Column width={12} className="label">
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type="file"
                                            accept=".srt, .vtt"
                                            // value={this.props.subtitle}
                                            ref={(ref) => this.subtitleRef = ref}
                                            onChange={(e) => {
                                                // console.log()
                                                this.onSubtitleChange(e.target.files[0]);
                                            }}
                                        />

                                        {value.subtitle && typeof value.subtitle === 'string' && (
                                            <a href={`${value.subtitle}?download`} target="_blank">
                                                Download
                                            </a>
                                        )}
                                        {value.subtitle && (
                                            <Button icon="close" onClick={() => {
                                                this.onSubtitleChange('');
                                                this.subtitleRef.value = null;
                                            }} basic style={{ boxShadow: 'none', marginLeft: 20 }} />
                                        )}
                                    </div>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row className="form-group">
                                <Grid.Column width={4}>
                                    Background Music
                                    {this.renderInfoPopup(INFO_ICON_TEXT.BACKGROUND_MUSIC)}
                                </Grid.Column>
                                <Grid.Column width={12} className="label">
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type="file"
                                            accept="audio/*"
                                            // value={this.props.backgroundMusic}
                                            ref={(ref) => this.backgroundMusicRef = ref}
                                            onChange={(e) => {
                                                this.onFileChange('backgroundMusicUrl', e.target.files[0])
                                            }}
                                        />
                                        {value.backgroundMusicUrl && typeof value.backgroundMusicUrl === 'string' && (
                                            <a href={`${value.backgroundMusicUrl}?download`} target="_blank">
                                                Download
                                            </a>
                                        )}
                                        {value.backgroundMusicUrl && (
                                            <Button icon="close" onClick={() => {
                                                this.onFileChange('backgroundMusicUrl', '')
                                                this.backgroundMusicRef.value = null;
                                            }} basic style={{ boxShadow: 'none', marginLeft: 20 }} />
                                        )}
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Content>
                )}
                <Modal.Actions>
                    <Button
                        onClick={this.props.onClose}
                        circular
                    >
                        Cancel
                    </Button>
                    <Button
                        circular
                        primary
                        onClick={this.props.onSave}
                    >
                        Save
                    </Button>
                </Modal.Actions>
            </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditVideoModal);
