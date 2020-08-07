import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Button, Tab, Icon } from 'semantic-ui-react';
import classnames from 'classnames';
import SingleUpload from './SingleUpload';
import MultipleUpload from './MultiUpload';

import { supportedLangs, isoLangsArray } from '../../constants/langs';
import { uploadVideo, setUploadVideoForm, uploadMultiVideos, setMultiUploadMode } from '../../../actions/video';
import './style.scss'
const speakersOptions = Array.apply(null, { length: 10 }).map(Number.call, Number).map((a, index) => ({ value: index + 1, text: index + 1 }));
let langsToUse = supportedLangs.map((l) => ({ ...l, supported: true })).concat(isoLangsArray.filter((l) => supportedLangs.every((l2) => l2.code.indexOf(l.code) === -1)))

const langsOptions = langsToUse.map((lang) => ({ key: lang.code, value: lang.code, text: `${lang.name} ( ${lang.code} ) ${lang.supported ? ' < Auto >' : ''}` }));

const DEFAULT_LANG_CODE = 'en-US';

class UploadNewVideoModal extends React.Component {
    state = {
        activeTabIndex: 0,
    }

    isSingleFormValid = () => {
        const { uploadVideoForm } = this.props;
        const { videos } = uploadVideoForm;
        if (!videos[0]) return false;
        const { name, numberOfSpeakers, langCode, content } = videos[0];
        if (!name || !numberOfSpeakers || !langCode || !content) return false;
        return true;
    }

    isMultiFormValid = () => {
        const { uploadVideoForm } = this.props;
        const { videos } = uploadVideoForm;
        if (!videos || videos.length === 0) return false;
        return true;

    }

    isFormValid = () => {
        return this.props.uploadVideoForm.activeTabIndex === 0 ? this.isSingleFormValid() : this.isMultiFormValid();
    }

    onTabChange = index => {
        this.onUploadFormChange({ activeTabIndex: index });
    }

    onUploadFormChange = (changes) => {
        const { uploadVideoForm } = this.props;
        Object.keys(changes).forEach((key) => {
            uploadVideoForm[key] = changes[key];
        })
        this.props.setUploadVideoForm({ ...uploadVideoForm });
    }
    
    onSingleUploadFormChange = (changes) => {
        const { uploadVideoForm } = this.props;
        if (!uploadVideoForm.videos || !uploadVideoForm.videos[0]) {
            uploadVideoForm.videos = [{
                numberOfSpeakers: 1,
                langCode: DEFAULT_LANG_CODE,
                selected: false,
                hasSubtitle: false,
                folder: null,
                folderName: null,
            }];
        }

        Object.keys(changes).forEach((key) => {
            uploadVideoForm.videos[0][key] = changes[key];
        })
        this.props.setUploadVideoForm({ ...uploadVideoForm });
    }

    onSubmit = (values) => {
        this.props.uploadMultiVideos({ videos: this.props.uploadVideoForm.videos, organization: this.props.organization._id });
        this.props.onClose();
    }

    render() {
        const tabItems = [
            {
                menuItem: 'Single',
                render: () =>
                    <SingleUpload
                        {...this.props}
                        disabled={!(this.isFormValid() && !this.props.loading)}
                        onChange={this.onSingleUploadFormChange}
                        value={this.props.uploadVideoForm.videos[0] || {}}
                        onSubmit={this.onSubmit}
                        langsOptions={langsOptions}
                        speakersOptions={speakersOptions}
                        
                    />
            },
            {
                menuItem: 'Multiple',
                render: () =>
                    <MultipleUpload
                        {...this.props}
                        disabled={!(this.isFormValid() && !this.props.loading)}
                        onChange={this.onUploadFormChange}
                        value={this.props.uploadVideoForm}
                        onSubmit={this.onSubmit}
                        langsOptions={langsOptions}
                        speakersOptions={speakersOptions}
                    />
            }
        ]
        return (
            <Modal open={this.props.open} size="large" className={"upload-modal"} onClose={this.props.onClose} >
                <Modal.Header>
                    <ul className="header-tabs">
                        <li
                            className={classnames({ 'header-tabs-item': true, 'header-tabs-item-active': this.props.uploadVideoForm.activeTabIndex === 0 })}
                            onClick={() => this.onTabChange(0)}
                        >
                            UPLOAD SINGLE VIDEO
                        </li>
                        <li
                            className={classnames({ 'header-tabs-item': true, 'header-tabs-item-active': this.props.uploadVideoForm.activeTabIndex === 1 })}
                            onClick={() => this.onTabChange(1)}
                        >
                            UPLOAD MULTIPLE VIDEOS
                        </li>
                    </ul>
                    <Button
                        circular
                        icon="close"
                        className="pull-right"
                        onClick={this.props.onClose}
                    />

                </Modal.Header>
                <Modal.Content style={{ padding: 0 }}>
                    {tabItems[this.props.uploadVideoForm.activeTabIndex].render()}
                </Modal.Content>
                {/* <Modal.Actions>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={this.props.onClose} size={'large'}>Cancel</Button>
                        <Button onClick={() => this.onSubmit(this.props.uploadVideoForm)} disabled={!(this.isFormValid() && !this.props.loading)} loading={this.props.loading} primary size={'large'}>
                            <Icon name="upload" />
                            Upload
                        </Button>
                    </div>
                </Modal.Actions> */}
            </Modal>
        )
    }
}

UploadNewVideoModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    uploadProgress: PropTypes.number,
}

UploadNewVideoModal.defaultProps = {
    open: false,
    uploadProgress: 0,
    onClose: () => { },
}

const mapStateToProps = ({ video, organization }) => ({
    uploadProgress: video.uploadProgress,
    loading: video.uploadState === 'loading',
    uploadState: video.uploadState,
    uploadError: video.uploadError,
    uploadVideoForm: { ...video.uploadVideoForm },
    video: video.video,
    organization: organization.organization,
})

const mapDispatchToProps = (dispatch) => ({
    uploadMultiVideos: values => dispatch(uploadMultiVideos(values)),
    uploadVideo: values => dispatch(uploadVideo(values)),
    setUploadVideoForm: uploadVideoForm => dispatch(setUploadVideoForm(uploadVideoForm)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UploadNewVideoModal);
