import React from "react";
import {
  Icon,
  Modal,
  Popup,
  Grid,
  Input,
  Dropdown,
  Button,
} from "semantic-ui-react";

import { supportedLangs, isoLangsArray } from "../../constants/langs";
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

const INFO_ICON_TEXT = {
  TITLE: 'What is the "Title" of the image?',
  LANGUAGE: "Which language is the image in?",
};

export default class EditImageModal extends React.Component {
  state = {
    title: "",
    langCode: "",
  };

  componentDidMount() {
    const { title, langCode } = this.props.initialValues;
    this.setState({ title, langCode });
  }

  onReset = () => {
    const { title, langCode } = this.props.initialValues;
    this.setState({ title, langCode });
  };

  renderInfoPopup = (text) => {
    return (
      <Popup
        content={text}
        trigger={
          <Icon
            name="info circle"
            style={{ paddingLeft: 10, cursor: "pointer" }}
          />
        }
      />
    );
  };

  renderRequiredStar = () => {
    return <span style={{ color: "red" }}>*</span>;
  };

  onSubmit = () => {
    this.props.onSubmit(this.props.value);
  };

  render() {
    const { open, onClose } = this.props;
    return (
      <Modal open={open} size="small" onClose={onClose}>
        <Modal.Header>
          {this.state.title}
          <Button
            // basic
            onClick={onClose}
            className="pull-right"
            circular
            icon="close"
          />
        </Modal.Header>
        <Modal.Content>
          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                <Button
                  onClick={() => {
                    this.onReset();
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
                <Input
                  fluid
                  type="text"
                  value={this.state.title}
                  onChange={(e, { value }) => {
                    this.setState({ title: value });
                  }}
                  name="title"
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
                  value={this.state.langCode}
                  onChange={(e, { value }) => {
                    this.setState({ langCode: value });
                  }}
                  name="langCode"
                  options={langsOptions}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.props.onClose} circular>
            Cancel
          </Button>
          <Button
            circular
            primary
            onClick={() => {
              const { title, langCode } = this.state;
              this.props.onSave({ title, langCode });
            }}
          >
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
