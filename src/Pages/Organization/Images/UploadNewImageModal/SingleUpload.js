import React from "react";
import {
  Grid,
  Dropdown,
  Progress,
  Input,
  Button,
  Popup,
  Icon,
  Form,
} from "semantic-ui-react";
import Dropzone from "react-dropzone";
import { removeExtension } from "../../../../shared/utils/helpers";
import SuccessLottie from "../../../../shared/lottie/success-animation.json";
import Lottie from "react-lottie";
const FILE_PREVIEW_SIZE_LIMIT = 10 * 1024 * 1024;

const INFO_ICON_TEXT = {
  TITLE: 'What is the "Title" of the image?',
  LANGUAGE: "Which language is the image in?",
};

class SingleUpload extends React.Component {
  onSubmit = () => {
    this.props.onSubmit(this.props.value);
  };

  onFieldChange = (e, { name, value, checked }) => {
    console.log("on change", name, value, checked);
    this.props.onChange({ [name]: value });
  };

  onFileChange = (fieldName, file) => {
    this.props.onChange({ [fieldName]: file });
  };

  onVideoChange = (file) => {
    const reader = new FileReader();
    console.log("on video change", file);
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      this.props.onChange({ base64: reader.result });
    };
    reader.readAsDataURL(file);
  };

  onVideoDrop = (accpetedFiles) => {
    if (accpetedFiles.length > 0) {
      const file = accpetedFiles[0];
      const fileSize = file.size;
      this.props.onChange({
        content: file,
        name: removeExtension(accpetedFiles[0].name),
      });
      if (fileSize < FILE_PREVIEW_SIZE_LIMIT) {
        this.onVideoChange(accpetedFiles[0]);
      } else {
        this.props.onChange({ base64: "" });
      }
    }
  };

  renderSuccessLottie = () => {
    const defaultOptions = {
      loop: false,
      autoplay: true,
      animationData: SuccessLottie,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };
    return <Lottie width={150} height={150} options={defaultOptions} />;
  };

  renderInfoPopup = (text) => {
    return (
      <Popup
        content={text}
        trigger={
          <Icon
            name="info circle"
            style={{ paddingLeft: 10, cursor: "pointer", color: "gray" }}
          />
        }
      />
    );
  };

  renderRequiredStar = () => {
    return <span style={{ color: "red" }}>*</span>;
  };

  renderDropzone = () => {
    const { content, base64 } = this.props.value;
    return (
      <Dropzone
        multiple={false}
        accept="image/*"
        onDrop={this.onVideoDrop}
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {!content && !base64 && (
                <div className="dropbox">
                  <img alt="upload cloud" src="/img/upload-cloud.png" />
                  <p className="description">
                    Drag and drop an image file here to upload
                  </p>
                  <p className="extra">
                    or just click here to choose an image file
                  </p>
                </div>
              )}
              {base64 && <img src={base64} width={"100%"} />}
              {content && !base64 && (
                <div style={{ height: 400, position: "relative" }}>
                {/* <img
                  alt="video thumbnail"
                  style={{ width: "100%", height: "100%" }}
                  src=""
                /> */}
                  <div
                    style={{
                      position: "absolute",
                      top: "20%",
                      left: 0,
                      right: 0,
                      textAlign: "center",
                    }}
                  >
                    <p>{this.renderSuccessLottie()}</p>
                    <p>Your file has been uploaded. Click on "Upload" Button</p>
                  </div>
                </div>
              )}
              <p style={{ textAlign: "center" }}>
                {this.props.value.content ? (
                  <div style={{ color: "#999999" }}>
                    You can
                    <Button primary basic circular style={{ margin: 10 }}>
                      choose another image
                    </Button>
                    or drag it here
                  </div>
                ) : (
                  ""
                )}
              </p>
            </div>
          </section>
        )}
      </Dropzone>
    );
  };

  render() {
    const { langsOptions, speakersOptions } = this.props;
    return (
      <Grid style={{ margin: "1.5rem" }}>
        <Grid.Row>
          <Grid.Column width={9}>
            {this.renderDropzone()}
            {this.props.uploadProgress ? (
              <Progress
                percent={Math.floor(this.props.uploadProgress)}
                indicating
                progress
              />
            ) : null}
          </Grid.Column>
          <Grid.Column width={7}>
            <Grid>
              <Grid.Row className="form-group">
                <Grid.Column width={16}>
                  <Form.Input
                    fluid
                    label={
                      <div>
                        Title {this.renderRequiredStar()}
                        {this.renderInfoPopup(INFO_ICON_TEXT.TITLE)}
                      </div>
                    }
                    type="text"
                    value={this.props.value.name}
                    onChange={this.onFieldChange}
                    name="name"
                    placeholder="Title of the video"
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row className="form-group">
                <Grid.Column width={16}>
                  <Form.Dropdown
                    search
                    selection
                    fluid
                    label={
                      <div>
                        Language {this.renderRequiredStar()}
                        {this.renderInfoPopup(INFO_ICON_TEXT.LANGUAGE)}
                      </div>
                    }
                    value={this.props.value.langCode}
                    onChange={this.onFieldChange}
                    name="langCode"
                    options={langsOptions}
                  />
                </Grid.Column>
              </Grid.Row>

              <div style={{ position: "absolute", bottom: 0, right: 0 }}>
                <Button
                  circular
                  style={{ paddingLeft: "3rem", paddingRight: "3rem" }}
                  onClick={this.props.onClose}
                  size={"large"}
                >
                  Cancel
                </Button>
                <Button
                  circular
                  onClick={this.props.onSubmit}
                  disabled={this.props.disabled}
                  loading={this.props.loading}
                  primary
                  style={{ paddingLeft: "3rem", paddingRight: "3rem" }}
                  size={"large"}
                >
                  Upload
                </Button>
              </div>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default SingleUpload;
