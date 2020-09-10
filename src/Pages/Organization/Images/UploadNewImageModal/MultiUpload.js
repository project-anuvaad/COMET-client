import React from "react";
import {
  Table,
  Checkbox,
  Button,
  Icon,
  Grid,
  Input,
  Popup,
} from "semantic-ui-react";
import "./multiupload.scss";
import Dropzone from "react-dropzone";
import { removeExtension } from "../../../../shared/utils/helpers";
import LanguageDropdown from "../../../../shared/components/LanguageDropdown";

const DEFAULT_LANG_CODE = "en-US";
class MultipleUpload extends React.Component {
  state = {
    currentTabIndex: 0,
    bulkEditing: false,
    bulkEditingNumberOfSpeakers: 1,
    bulkEditingLangCode: DEFAULT_LANG_CODE,
  };

  onMultiImagesDrop = (accpetedFiles) => {
    const newImagesNames = accpetedFiles.map((f) => f.name);
    const newAcceptedFiles = this.props.value.images
      .filter((f) => newImagesNames.indexOf(f.content.name) === -1)
      .concat(
        accpetedFiles.map((f) => ({
          content: f,
          name: removeExtension(f.name),
          selected: false,
          langCode: DEFAULT_LANG_CODE,
        }))
      );

    this.props.onChange({ images: newAcceptedFiles });
  };

  onSelectAllImagesChange = (checked) => {
    const newImages = this.props.value.images;
    newImages.forEach((image) => {
      image.selected = checked;
    });
    this.props.onChange({ images: newImages });
  };

  onMultiImageItemChange(index, field, value) {
    const { images } = this.props.value;
    images[index][field] = value;
    this.props.onChange({ images });
  }

  onDeleteImage = (index) => {
    const { images } = this.props.value;
    images.splice(index, 1);
    this.props.onChange({ images });
  };

  onDeleteSelectedImages = () => {
    const { images } = this.props.value;
    this.props.onChange({ images: images.filter((v) => !v.selected) });
  };

  renderMultipleImagesTable = () => {
    let { images } = this.props.value;
    const { langsOptions } = this.props;
    const backgroundStyle = { backgroundColor: "#d4e0ed", border: "none" };

    return (
      <Table
        celled
        selectable
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: 500, overflowY: "scroll", marginTop: 0 }}
      >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              className="centered-cell"
              style={{ ...backgroundStyle }}
            >
              <Checkbox
                checked={images.every((v) => v.selected)}
                onChange={(e, { checked }) =>
                  this.onSelectAllImagesChange(checked)
                }
              />
            </Table.HeaderCell>
            <Table.HeaderCell style={backgroundStyle}>
              Title of the Image
            </Table.HeaderCell>
            <Table.HeaderCell style={backgroundStyle}>
              Language
            </Table.HeaderCell>
            <Table.HeaderCell style={backgroundStyle} />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {images.map((image, index) => (
            <Table.Row
              key={`multi-images-table-${index}`}
              className="image-row"
            >
              <Table.Cell className="centered-cell">
                <Checkbox
                  checked={image.selected}
                  onChange={(e, { checked }) =>
                    this.onMultiImageItemChange(index, "selected", checked)
                  }
                />
              </Table.Cell>
              {/* View/Edit image name */}
              <Table.Cell width="4">
                <Input
                  type="text"
                  value={image.name}
                  onChange={(e, { value }) =>
                    this.onMultiImageItemChange(index, "name", value)
                  }
                />
              </Table.Cell>
              <Table.Cell>
                <LanguageDropdown
                  selection
                  fluid
                  value={image.langCode}
                  onChange={(value) => {
                    this.onMultiImageItemChange(index, "langCode", value);
                  }}
                  options={langsOptions}
                />
              </Table.Cell>
              <Table.Cell className="ceneterd-cell">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ marginLeft: 10 }}>
                    <Button
                      basic
                      circular
                      icon="trash"
                      color="red"
                      size="tiny"
                      onClick={() => this.onDeleteImage(index)}
                    />
                  </div>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  };
  renderMultipleUploadImagesDropzone = () => {
    return (
      <Dropzone
        // disablePreview={true}
        accept="image/*"
        style={{ padding: "1rem" }}
        onDrop={this.onMultiImagesDrop}
      >
        {({ getRootProps, getInputProps }) => (
          <section style={{ height: 400, overflowY: "scroll" }}>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {this.props.value.images && this.props.value.images.length > 0 ? (
                this.renderMultipleImagesTable()
              ) : (
                <div className="dropbox">
                  <img src="/img/upload-cloud.png" />
                  <p className="description">
                    Drag and drop multiple image files here to upload
                  </p>
                  <p className="extra">
                    or just click here to choose multiple image files
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </Dropzone>
    );
  };

  renderMultipleUploadImages = () => {
    const { images } = this.props.value;
    const marginSpace = { marginRight: 20 };
    return (
      <div>
        {this.renderMultipleUploadImagesDropzone()}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "2rem",
          }}
        >
          <Dropzone
            // disablePreview={true}
            accept="image/*"
            style={{ padding: "1rem" }}
            onDrop={this.onMultiImagesDrop}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div style={{ color: "rgb(153, 153, 153)" }}>
                  You can
                  <Button primary circular basic style={{ margin: "0 10px" }}>
                    Add more images
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
              style={{ paddingLeft: "3rem", paddingRight: "3rem" }}
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
        </div>
      </div>
    );
  };

  isFormValid = () => {
    const { images } = this.props.value;
    return images.length > 0;
  };

  renderTabContent = () => {
    const { currentTabIndex } = this.state;
    switch (currentTabIndex) {
      case 0:
        return this.renderMultipleUploadImages();
      case 1:
        return this.renderMultipleUploadSubtitles();
      default:
        return this.renderMultipleUploadImages();
    }
  };

  render() {
    const { images, subtitles } = this.props.value;
    const marginSpace = { margin: 10 };
    return (
      <Grid style={{ margin: 0 }} className="multi-upload-image">
        <Grid.Row style={{ padding: 0 }}>
          <Grid.Column width={16} style={{ padding: 0 }}>
            {!images || images.length === 0 ? (
              <div style={{ padding: "2rem" }}>
                {this.renderMultipleUploadImagesDropzone()}
              </div>
            ) : (
              <React.Fragment>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#d4e0ed",
                    padding: "1.5rem",
                  }}
                >
                  {this.state.currentTabIndex === 0 &&
                    images.some((v) => v.selected) && (
                      <div
                        onClick={this.onDeleteSelectedImages}
                        style={{
                          cursor: "pointer",
                          color: "#666666",
                          marginLeft: 10,
                        }}
                      >
                        <Icon name="trash" /> Remove selected Images
                      </div>
                    )}
                  <div style={{ position: "absolute", right: "1rem" }}>
                    <Popup
                      wide
                      position="bottom right"
                      content={
                        <div>
                          <p>Drag & drop multiple images</p>
                        </div>
                      }
                      trigger={
                        <a href="javascript:void(0);">
                          <Icon name="info circle" />
                          Know how it works
                        </a>
                      }
                    />
                  </div>
                  {this.state.currentTabIndex === 1 &&
                    subtitles.some((s) => s.selected) && (
                      <div
                        onClick={this.onDeleteSelectedSubtitles}
                        style={{
                          cursor: "pointer",
                          color: "#666666",
                          marginLeft: 10,
                        }}
                      >
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
    );
  }
}

export default MultipleUpload;
