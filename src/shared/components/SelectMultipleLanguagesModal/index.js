import React from "react";
import {
  Modal,
  ModalContent,
  ModalActions,
  Button,
  Dropdown,
  Grid,
} from "semantic-ui-react";
import { isoLangsArray, TTSLangs, signLangsArray } from "../../utils/langs";

const languagesOptions = isoLangsArray
  .concat([...TTSLangs, ...signLangsArray])
  .map((lang) => ({ key: lang.code, value: lang.code, text: `${lang.name}` }));

class SelectMultipleLanguagesModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOptions: languagesOptions.slice(),
      codes: [],
    };
  }

  onSubmit = () => {
    this.props.onSubmit(this.state.codes);
  };

  onAssignUsers = () => {
    this.props.onAssignUsers(this.state.codes);
  }

  render() {
    return (
      <Modal size="tiny" open={this.props.open} onClose={this.props.onClose}>
        <Modal.Header>
          <h3>Select Multiple Languages:</h3>
        </Modal.Header>
        <ModalContent>
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <Dropdown
                  clearable
                  fluid
                  multiple
                  search
                  selection
                  closeOnChange
                  options={this.state.dropdownOptions}
                  onChange={(_, { value }) => {
                    this.setState({ codes: value });
                  }}
                  placeholder="Select Languages"
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </ModalContent>
        <ModalActions>
          <Button onClick={this.props.onClose}>Cancel</Button>
          {!this.props.multi && <Button color="blue" onClick={this.onAssignUsers}>Assign to people</Button>}
          <Button color="blue" onClick={this.onSubmit}>
            Go
          </Button>
        </ModalActions>
      </Modal>
    );
  }
}

export default SelectMultipleLanguagesModal;
