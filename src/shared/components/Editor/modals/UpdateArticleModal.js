import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Popup, Modal, Progress } from 'semantic-ui-react';
import { NotificationManager } from 'react-notifications';
import request from '../../../utils/requestAgent';

class UpdateArticleModal extends React.Component {
  state = {
    open: false,
  }

  onCloseModal = () => {
    this.setState({ open: false });
  }

  onUpdate = () => {
    this.setState({ open: false });
    this.props.onConfirm()
  }

  render() {
    const { title } = this.props;
    return (
      <React.Fragment>

        <a onClick={() => this.setState({ open: true })} className="c-editor__footer-wiki c-editor__footer-sidebar c-editor__toolbar-publish c-app-footer__link " >
          <Popup
            trigger={
              <Icon
                style={{ cursor: 'pointer' }}
                name="refresh"
                inverted
                color="grey"
              />
            }
            onClick={() => this.setState({ open: true })}
          >
            Update article
        </Popup>
        </a>
        <Modal size="small" open={this.state.open} onClose={() => this.onCloseModal()} >
          <Modal.Header>Update {title.split('_').join(' ')}</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <p>Do you want to update the article "{title.split('_').join(' ')}" now?</p>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button
              onClick={() => this.onCloseModal()}
            >
              Cancel
            </Button>
            <Button
              primary
              onClick={() => this.onUpdate()}
            >
              Yes
              </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    )
  }
}

UpdateArticleModal.propTypes = {
  title: PropTypes.string.isRequired,
  wikiSource: PropTypes.string.isRequired,
  onConfirm: PropTypes.func,
}

export default UpdateArticleModal;
