import React from 'react';
import { Modal, Button, Grid, Icon } from 'semantic-ui-react';
import './style.scss';

export default class GiveFeedbackModal extends React.Component {
    state = {
        open: false,
    }

    toggleOpen = () => {
        this.setState({ open: !this.state.open });
    }

    render() {
        const { buttonProps } = this.props;

        return (
            <Modal
                style={{ width: 400 }}
                size="tiny"
                onClose={this.toggleOpen}
                open={this.state.open}
                trigger={(
                    <Button
                        {...buttonProps}
                        onClick={this.toggleOpen}
                    >
                        Give Feedback
                    </Button>
                )}
            >
                <Modal.Header>
                    Give Feedback to VideoWiki

                    <Button
                        circular
                        icon="close"
                        className="pull-right"
                        onClick={this.toggleOpen}
                    />
                </Modal.Header>
                <Modal.Content>
                    <div className="feedback-item" >
                        <a
                            href="https://feature-request.videowiki.org"
                            target="_blank"
                        >
                            <div style={{ marginRight: 30 }}>
                                <Icon name="info circular" color="green" size="large" />
                            </div>

                            <div>
                                Help us improve VideoWiki
                                <div>
                                    <small>
                                        Give feedback about your VideoWiki experience
                                    </small>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="feedback-item" >
                        <a
                            href="https://support.videowiki.org"
                            target="_blank"
                        >
                            <div style={{ marginRight: 30 }}>
                                <Icon name="warning sign circular" color="red" size="large" />
                            </div>

                            <div>
                                Something went wrong
                                <div>
                                    <small>
                                        Let us know about a broken feature
                                    </small>
                                </div>
                            </div>
                        </a>
                    </div>
                </Modal.Content>
            </Modal>
        )
    }
}