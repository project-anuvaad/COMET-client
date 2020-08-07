import React from 'react';
import { Tab, Table, Checkbox, Dropdown, Button, TableHeader, Icon, Progress, Grid, Input, Popup } from 'semantic-ui-react';
// import async from 'async';
import './multiupload.scss';
import Dropzone from 'react-dropzone';
import { matchVideosWithSubtitels, removeExtension, showMoreText } from '../../utils/helpers';
import Tabs from '../Tabs';
import LanguageDropdown from '../LanguageDropdown';
import MoveVideoModal from '../../../Pages/Organization/Videos/Translations/Folders/MoveVideoModal';
import { connect } from 'react-redux';
import * as videoActions from '../../../Pages/Organization/Videos/modules/actions';

const DEFAULT_LANG_CODE = 'en-US';
const SPEAKERS_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
class MultipleUpload extends React.Component {
    state = {
        currentTabIndex: 0,
        bulkEditing: false,
        bulkEditingNumberOfSpeakers: 1,
        bulkEditingLangCode: DEFAULT_LANG_CODE,
        // folderName: null,
        // folderId: null,
        moveVideoModalOpen: false,
        selectFolderItemIndex: null,
    }

    onSaveBulkEditing = () => {
        const { bulkEditingLangCode, bulkEditingNumberOfSpeakers } = this.state;
        const { videos } = this.props.value;
        videos.forEach((video) => {
            if (video.selected) {
                video.numberOfSpeakers = bulkEditingNumberOfSpeakers;
                video.langCode = bulkEditingLangCode;
            }
        })
        this.props.onChange({ videos });
        this.setState({ bulkEditing: false, bulkEditingNumberOfSpeakers: 1, bulkEditingLangCode: DEFAULT_LANG_CODE });
    }

    onMultiVideosDrop = (accpetedFiles) => {
        const newVideosNames = accpetedFiles.map((f) => f.name);
        const newAcceptedFiles = this.props.value.videos
            .filter((f) => newVideosNames.indexOf(f.content.name) === -1)
            .concat(accpetedFiles.map((f) => ({ content: f, name: removeExtension(f.name), selected: false, hasSubtitle: false, numberOfSpeakers: 1, langCode: DEFAULT_LANG_CODE })));

        this.props.onChange({ videos: newAcceptedFiles });
    }
    onMultiSubtitlesDrop = (accpetedFiles) => {
        let { videos } = this.props.value;
        const newSubtitlesNames = accpetedFiles.map((f) => f.name);
        const newAcceptedFiles = this.props.value.subtitles
            .filter((f) => newSubtitlesNames.indexOf(f.content.name) === -1)
            .concat(accpetedFiles.map((f) => ({ content: f, selected: false })));
        videos = matchVideosWithSubtitels(videos, accpetedFiles);
        this.props.onChange({ subtitles: newAcceptedFiles, videos });
    }

    onSelectAllVideosChange = (checked) => {
        const newvids = this.props.value.videos;
        newvids.forEach(video => {
            video.selected = checked;
        });
        this.props.onChange({ videos: newvids });
    }
    onSelectAllSubtitlesChange = (checked) => {
        const newSubtitles = this.props.value.subtitles;
        newSubtitles.forEach(video => {
            video.selected = checked;
        });
        this.props.onChange({ subtitles: newSubtitles });
    }

    onMultiVideoItemChange(index, field, value) {
        const { videos } = this.props.value;
        videos[index][field] = value;
        this.props.onChange({ videos });
    }

    onMultiSubtitleItemChange(index, field, value) {
        const { subtitles } = this.props.value;
        subtitles[index][field] = value;
        this.props.onChange({ subtitles });
    }

    onDeleteVideo = (index) => {
        const { videos } = this.props.value;
        videos.splice(index, 1);
        this.props.onChange({ videos });
    }

    onDeleteSelectedVideos = () => {
        const { videos } = this.props.value;
        this.props.onChange({ videos: videos.filter(v => !v.selected) });
    }

    onDeleteSelectedSubtitles = () => {
        const { subtitles } = this.props.value;
        this.props.onChange({ subtitles: subtitles.filter((s) => !s.selected) });
    }

    _renderMoveVideoModal() {
        if (!this.state.moveVideoModalOpen && this.state.selectFolderItemIndex === null) return null;
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
                    this.setState({ moveVideoModalOpen: false, selectFolderItemIndex: null });
                }}
                onMoveVideo={(folderId, folderName) => {
                    this.setState({ moveVideoModalOpen: false });
                    this.onMultiVideoItemChange(this.state.selectFolderItemIndex, 'folder', folderId);
                    this.onMultiVideoItemChange(this.state.selectFolderItemIndex, 'folderName', folderName);
                }}
                onLoadMoreFolders={() => {
                    this.props.loadMoreMoveVideoFolders();
                }}
            />
        );
    }

    renderMultipleVidoesTable = () => {
        let { videos, subtitles } = this.props.value;
        const { langsOptions } = this.props;
        const subtitlesOptions = subtitles.map((s) => ({
            key: `subtitle-item-dropdown-${s.content.name}`,
            text: s.content.name,
            // text: <div>
            //     <Popup content={s.content.name} trigger={<div>{showMoreText(s.content.name, 10)}</div>} />
            // </div>,
            value: s.content
        }))
        const backgroundStyle = { backgroundColor: '#d4e0ed', border: 'none' };

        return (
            <Table celled selectable onClick={(e) => e.stopPropagation()} style={{ maxHeight: 500, overflowY: 'scroll', marginTop: 0 }}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell className="centered-cell" style={{ ...backgroundStyle }}>
                            <Checkbox
                                // label={`${videos.length} Videos`}
                                checked={videos.every((v) => v.selected)} onChange={(e, { checked }) => this.onSelectAllVideosChange(checked)} />
                        </Table.HeaderCell>
                        <Table.HeaderCell style={backgroundStyle}>Title of the video</Table.HeaderCell>
                        <Table.HeaderCell style={backgroundStyle}>Speakers</Table.HeaderCell>
                        <Table.HeaderCell style={backgroundStyle}>Language</Table.HeaderCell>
                        <Table.HeaderCell style={backgroundStyle}>Folder</Table.HeaderCell>
                        <Table.HeaderCell style={backgroundStyle}>Subtitle</Table.HeaderCell>
                        {/* <Table.HeaderCell style={backgroundStyle} /> */}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {videos.map((video, index) => (
                        <Table.Row key={`multi-videos-table-${index}`} className="video-row">
                            <Table.Cell className="centered-cell">
                                <Checkbox checked={video.selected} onChange={(e, { checked }) => this.onMultiVideoItemChange(index, 'selected', checked)} />
                            </Table.Cell>
                            {/* View/Edit video name */}
                            <Table.Cell width="3">

                                <Input
                                    type="text"
                                    value={video.name}
                                    onChange={(e, { value }) => this.onMultiVideoItemChange(index, 'name', value)}
                                />
                                {video.progress && video.progress > 0 && (
                                    <Progress size="small" indicating percent={video.progress} style={{ margin: 0 }} />
                                )}
                            </Table.Cell>
                            <Table.Cell width={2}>

                                <Dropdown
                                    options={SPEAKERS_OPTIONS.map(o => ({ text: o, value: o, key: `${video.name}-speaker-option-${o}` }))}
                                    value={video.numberOfSpeakers}
                                    onChange={(e, { value }) => {
                                        value = parseInt(value);
                                        if (value > 10 || value < 1) {
                                            this.onMultiVideoItemChange(index, 'numberOfSpeakers', 1);
                                        } else {
                                            this.onMultiVideoItemChange(index, 'numberOfSpeakers', parseInt(value))
                                        }
                                    }}
                                    fluid
                                    selection
                                />
                            </Table.Cell>
                            <Table.Cell>
                                <LanguageDropdown
                                    selection
                                    fluid
                                    value={video.langCode}
                                    onChange={(value) => { this.onMultiVideoItemChange(index, 'langCode', value); }}
                                    options={langsOptions}
                                />
                            </Table.Cell>
                            <Table.Cell width="3">
                                <div>
                                    <span style={{ marginRight: 10 }}>{video.folderName || 'Homepage'}</span>
                                    <Button 
                                        size="mini" 
                                        onClick={() => {
                                            this.setState({ moveVideoModalOpen: true, selectFolderItemIndex: index });
                                        }}
                                    >
                                        Change</Button>
                                </div>
                            </Table.Cell>
                            <Table.Cell className="ceneterd-cell">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Dropdown
                                        options={subtitlesOptions}
                                        value={video.subtitle}
                                        onChange={(e, { value }) => this.onMultiVideoItemChange(index, 'subtitle', value)}
                                        fluid
                                        search
                                        selection
                                        clearable
                                    />
                                    <div style={{ marginLeft: 10 }}>
                                        <Button
                                            basic
                                            circular
                                            icon="trash"
                                            color="red"
                                            size="tiny"
                                            onClick={() => this.onDeleteVideo(index)}
                                        />
                                    </div>

                                </div>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        )
    }
    renderMultipleUploadVideosDropzone = () => {
        return (
            <Dropzone
                // disablePreview={true}
                accept="video/*"
                style={{ padding: '1rem' }}
                onDrop={this.onMultiVideosDrop}>
                {({ getRootProps, getInputProps }) => (
                    <section style={{ height: 400, overflowY: 'scroll' }}>
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            {this.props.value.videos && this.props.value.videos.length > 0 ? this.renderMultipleVidoesTable()
                                : (
                                    <div className="dropbox">
                                        <img src="/img/upload-cloud.png" />
                                        <p className="description">Drag and drop multiple video files here to upload</p>
                                        <p className="extra">or just click here to choose multiple video files</p>
                                    </div>
                                )}
                        </div>
                    </section>
                )}
            </Dropzone>
        )
    }

    renderMultipleUploadVideos = () => {
        const { videos } = this.props.value;
        const marginSpace = { marginRight: 20 };
        return (
            <div>
                {this.renderMultipleUploadVideosDropzone()}

                <div
                    style={{ display: 'flex', justifyContent: 'space-between', padding: '2rem' }}
                >
                    <Dropzone
                        // disablePreview={true}
                        accept="video/*"
                        style={{ padding: '1rem' }}
                        onDrop={this.onMultiVideosDrop}>
                        {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />

                                <div
                                    style={{ color: 'rgb(153, 153, 153)' }}
                                >
                                    You can
                                    <Button
                                        primary
                                        circular
                                        basic
                                        style={{ margin: '0 10px' }}
                                    >
                                        Add more videos
                                    </Button>
                                    or drag it here
                                    </div>
                            </div>
                        )}
                    </Dropzone>
                    <div>
                        <Button
                            circular
                            onClick={this.props.onClose}
                            style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
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
                </div>
            </div>
        )
    }

    onDeleteSubtitle = index => {
        const { subtitles } = this.props.value;
        subtitles.splice(index, 1);
        this.props.onChange({ subtitles });
    }

    renderMultipleSubtitlesTable = () => {
        const { subtitles } = this.props.value;
        return (
            <Table className="subtitles-table" celled selectable onClick={(e) => e.stopPropagation()} style={{ maxHeight: 500, overflowY: 'scroll' }}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell className="centered-cell">
                            <Checkbox checked={subtitles.every((v) => v.selected)} onChange={(e, { checked }) => this.onSelectAllSubtitlesChange(checked)} />
                        </Table.HeaderCell>
                        <Table.HeaderCell width="14">{subtitles.length} Subtitles</Table.HeaderCell>
                        <Table.HeaderCell />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {subtitles.map((subtitle, index) => (
                        <Table.Row key={`multi-subtitles-table-${index}`} className="subtitle-row">
                            <Table.Cell className="centered-cell">
                                <Checkbox checked={subtitle.selected} onChange={(e, { checked }) => this.onMultiSubtitleItemChange(index, 'selected', checked)} />
                            </Table.Cell>
                            <Table.Cell width="12">
                                {subtitle.content.name}
                            </Table.Cell>
                            <Table.Cell className="centered-cell">
                                <Button
                                    basic
                                    circular
                                    icon="trash"
                                    color="red"
                                    size="tiny"
                                    onClick={() => this.onDeleteSubtitle(index)}
                                />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        )
    }

    renderMultipleUploadSubtitles = () => {
        const { subtitles } = this.props.value;
        return (
            <div>
                <Dropzone
                    // disablePreview={true}
                    accept=".srt, .vtt"
                    onDrop={this.onMultiSubtitlesDrop}>
                    {({ getRootProps, getInputProps }) => (
                        <section>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                {subtitles && subtitles.length > 0 ? this.renderMultipleSubtitlesTable()
                                    : (
                                        <div className="dropbox">
                                            <img src="/img/upload-cloud.png" />
                                            <p className="description">Drag and drop multiple subtitle files here to upload</p>
                                            <p className="extra">or just click here to choose multiple subtitle files</p>
                                        </div>
                                    )}
                            </div>
                        </section>
                    )}
                </Dropzone>
                {subtitles.length > 0 && (

                    <div
                        style={{ display: 'flex', justifyContent: 'space-between', padding: '2rem' }}
                    >
                        <Dropzone
                            // disablePreview={true}
                            accept=".srt, .vtt"
                            style={{ padding: '1rem' }}
                            onDrop={this.onMultiSubtitlesDrop}>
                            {({ getRootProps, getInputProps }) => (
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />

                                    <div
                                        style={{ color: 'rgb(153, 153, 153)' }}
                                    >
                                        You can
                                    <Button
                                            primary
                                            circular
                                            basic
                                            style={{ margin: '0 10px' }}
                                        >
                                            Add more subtitles
                                    </Button>
                                        or drag it here
                                    </div>
                                </div>
                            )}
                        </Dropzone>
                        <div>
                            <Button
                                circular
                                onClick={this.props.onClose}
                                style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
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
                    </div>
                )}

            </div>
        )
    }

    isFormValid = () => {
        const { videos } = this.props.value;
        return videos.length > 0;
    }

    renderTabContent = () => {
        const { currentTabIndex } = this.state;
        switch (currentTabIndex) {
            case 0:
                return this.renderMultipleUploadVideos();
            case 1:
                return this.renderMultipleUploadSubtitles();
            default:
                return this.renderMultipleUploadVideos()
        }
    }

    render() {
        const { videos, subtitles } = this.props.value;
        const marginSpace = { margin: 10 }
        return (
            <Grid style={{ margin: 0 }} className="multi-upload-video">
                {this._renderMoveVideoModal()}
                <Grid.Row style={{ padding: 0 }}>
                    <Grid.Column width={16} style={{ padding: 0 }}>
                        {!videos || videos.length === 0 ? (
                            <div style={{ padding: '2rem' }}>
                                {this.renderMultipleUploadVideosDropzone()}
                            </div>
                        ) : (
                                <React.Fragment>
                                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#d4e0ed', padding: '1.5rem' }}>
                                        <Tabs
                                            id="upload-tabs"
                                            items={[{ title: 'Videos' }, { title: 'Subtitles' }]}
                                            activeIndex={this.state.currentTabIndex}
                                            onActiveIndexChange={val => {
                                                this.setState({ currentTabIndex: val });
                                            }}
                                        />
                                        {this.state.currentTabIndex === 0 && videos.some((v) => v.selected) && (
                                            // <React.Fragment>
                                            //     <Dropdown text='Actions' disabled={!videos.some((v) => v.selected)} pointing>
                                            //         <Dropdown.Menu>
                                            //             <Dropdown.Item onClick={() => this.setState({ bulkEditing: true })}>Edit</Dropdown.Item>
                                            //             <Dropdown.Item onClick={this.onDeleteSelectedVideos}>Delete</Dropdown.Item>
                                            //         </Dropdown.Menu>
                                            //     </Dropdown>
                                            // </React.Fragment>
                                            <div onClick={this.onDeleteSelectedVideos} style={{ cursor: 'pointer', color: '#666666', marginLeft: 10 }}>
                                                <Icon name="trash" /> Remove selected videos
                                            </div>
                                        )}
                                        <div style={{ position: 'absolute', right: '1rem' }}>

                                            <Popup
                                                wide
                                                position="bottom right"
                                                content={(
                                                    <div

                                                    >
                                                        <p><strong>Step 1:</strong> Drag & drop multiple videos in <strong>‘Videos’</strong> tab</p>
                                                        <p><strong>Step 2:</strong> Drag & drop multiple subtitles in <strong>’Subtitles’</strong> tab</p>
                                                        <p><strong>Step 3:</strong> Select subtitle using the subtitle dropdown in <strong>‘Videos’</strong> tab</p>
                                                    </div>
                                                )}
                                                trigger={<a href="javascript:void(0);"><Icon name="info circle" />Know how it works</a>}
                                            />
                                        </div>
                                        {this.state.currentTabIndex === 1 && subtitles.some((s) => s.selected) && (
                                            <div onClick={this.onDeleteSelectedSubtitles} style={{ cursor: 'pointer', color: '#666666', marginLeft: 10 }}>
                                                <Icon name="trash" /> Remove selected subtitles
                                            </div>

                                        )}
                                    </div>
                                    {this.renderTabContent()}
                                </React.Fragment>
                            )}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(MultipleUpload);