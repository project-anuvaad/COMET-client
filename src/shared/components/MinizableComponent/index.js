import React from 'react';
import { connect } from 'react-redux';
import { Card, Button, Grid, Progress, Modal, Icon } from 'semantic-ui-react';
import './style.scss';
import * as videoActions from '../../../actions/video';

class MinizableComponent extends React.Component {
    state = {
        minimized: false,
    }

    toggleMinimize = () => {
        this.setState({ minimized: !this.state.minimized });
    }

    render() {
        const { className } = this.props;

        return (
            <div>
                <Card fluid>
                    <Card.Header>
                        {this.props.title}
                        <div className="action-buttons">
                            <Button
                                size="mini"
                                className="minimize"
                                onClick={this.toggleMinimize}
                                circular
                                basic
                                icon={`chevron ${this.state.minimized ? 'up' : 'down'}`}
                            />
                            <Button
                                size="mini"
                                className="close"
                                circular
                                basic
                                icon="close"
                                onClick={() => this.props.onClose()}
                            />
                        </div>
                    </Card.Header>
                    {!this.state.minimized && (
                        <Card.Content>
                            {this.props.children}
                        </Card.Content>
                    )}
                </Card>
            </div >
        )
    }
}

export default MinizableComponent