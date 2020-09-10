import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Modal, Button, Tab, Icon } from "semantic-ui-react";
import classnames from "classnames";
import SingleUpload from "./SingleUpload";
import MultipleUpload from "./MultiUpload";

import {
  supportedLangs,
  isoLangsArray,
} from "../../../../shared/constants/langs";
import { setUploadImageForm, uploadImages } from "../../../../actions/image";

import "./style.scss";

let langsToUse = supportedLangs
  .map((l) => ({ ...l, supported: true }))
  .concat(
    isoLangsArray.filter((l) =>
      supportedLangs.every((l2) => l2.code.indexOf(l.code) === -1)
    )
  );

const langsOptions = langsToUse.map((lang) => ({
  key: lang.code,
  value: lang.code,
  text: `${lang.name} ( ${lang.code} ) ${lang.supported ? " < Auto >" : ""}`,
}));

const DEFAULT_LANG_CODE = "en-US";

class UploadNewImageModal extends React.Component {
  isSingleFormValid = () => {
    const { uploadImageForm } = this.props;
    const { images } = uploadImageForm;
    if (!images[0]) return false;
    const { name, langCode, content } = images[0];
    if (!name || !langCode || !content) return false;
    return true;
  };

  isMultiFormValid = () => {
    const { uploadImageForm } = this.props;
    const { images } = uploadImageForm;
    if (!images || images.length === 0) return false;
    return true;
  };

  isFormValid = () => {
    return this.props.uploadImageForm.activeTabIndex === 0
      ? this.isSingleFormValid()
      : this.isMultiFormValid();
  };

  onTabChange = (index) => {
    this.onUploadFormChange({ activeTabIndex: index });
  };

  onUploadFormChange = (changes) => {
    const { uploadImageForm } = this.props;
    Object.keys(changes).forEach((key) => {
      uploadImageForm[key] = changes[key];
    });
    this.props.setUploadImageForm({ ...uploadImageForm });
  };

  onSingleUploadFormChange = (changes) => {
    const { uploadImageForm } = this.props;
    if (!uploadImageForm.images || !uploadImageForm.images[0]) {
      uploadImageForm.images = [
        {
          langCode: DEFAULT_LANG_CODE,
          selected: false,
        },
      ];
    }

    Object.keys(changes).forEach((key) => {
      uploadImageForm.images[0][key] = changes[key];
    });
    this.props.setUploadImageForm({ ...uploadImageForm });
  };

  onSubmit = (values) => {
    this.props.uploadImages(this.props.organization._id);
    this.props.onClose();
  };

  render() {
    const tabItems = [
      {
        menuItem: "Single",
        render: () => (
          <SingleUpload
            {...this.props}
            disabled={!this.isFormValid()}
            onChange={this.onSingleUploadFormChange}
            value={this.props.uploadImageForm.images[0] || {}}
            onSubmit={this.onSubmit}
            langsOptions={langsOptions}
          />
        ),
      },
      {
        menuItem: "Multiple",
        render: () => (
          <MultipleUpload
            {...this.props}
            disabled={!(this.isFormValid() && !this.props.loading)}
            onChange={this.onUploadFormChange}
            value={this.props.uploadImageForm}
            onSubmit={this.onSubmit}
            langsOptions={langsOptions}
          />
        ),
      },
    ];
    return (
      <Modal
        open={this.props.open}
        size="large"
        className={"upload-modal"}
        onClose={this.props.onClose}
      >
        <Modal.Header>
          <ul className="header-tabs">
            <li
              className={classnames({
                "header-tabs-item": true,
                "header-tabs-item-active":
                  this.props.uploadImageForm.activeTabIndex === 0,
              })}
              onClick={() => this.onTabChange(0)}
            >
              UPLOAD SINGLE IMAGE
            </li>
            <li
              className={classnames({
                "header-tabs-item": true,
                "header-tabs-item-active":
                  this.props.uploadImageForm.activeTabIndex === 1,
              })}
              onClick={() => this.onTabChange(1)}
            >
              UPLOAD MULTIPLE IMAGES
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
          {tabItems[this.props.uploadImageForm.activeTabIndex].render()}
        </Modal.Content>
      </Modal>
    );
  }
}

UploadNewImageModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

UploadNewImageModal.defaultProps = {
  open: false,
  onClose: () => {},
};

const mapStateToProps = ({ image, organization }) => ({
  uploadImageForm: { ...image.uploadImageForm },
  organization: organization.organization,
});

const mapDispatchToProps = (dispatch) => ({
  uploadImages: (organization) => dispatch(uploadImages(organization)),
  setUploadImageForm: (uploadImageForm) =>
    dispatch(setUploadImageForm(uploadImageForm)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadNewImageModal);
