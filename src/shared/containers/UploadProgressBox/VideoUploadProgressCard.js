import React from 'react';
import { Button, Grid, Progress, Icon } from 'semantic-ui-react';

export default class VideoUploadProgressCard extends React.Component {

    render() {
        const { video } = this.props;
        
        return (

            <Grid.Row style={{ height: 70 }}>
                <Grid.Column width={4}>
                    <img
                        src={'https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/video-placeholder.jpg'}
                        style={{ height: '100%' }}
                    />
                </Grid.Column>
                <Grid.Column width={12} style={{ padding: 0 }}>
                    <div>
                        <p>
                            {video.name}
                            {video.aborted && (
                                <Icon style={{ marginRight: 20 }} name="close circle" color="red" className="pull-right" />
                            )}
                            {video.progress === 100 && (
                                <Icon style={{ marginRight: 20 }} className="pull-right" color="green" name="check circle" />
                            )}
                            {video.progress !== 100 && !video.aborted && (
                                <Button
                                    circular
                                    size="mini"
                                    icon='close'
                                    basic
                                    className="pull-right close"
                                    style={{ marginRight: 20, opacity: 0.5 }}
                                    onClick={() => this.props.abortVideoUpload()}
                                />
                            )}
                        </p>

                        <div className="progress-container">
                            {video.aborted ? (
                                <div>
                                    Upload aborted
                            </div>
                            ) : (
                                    <React.Fragment>
                                        <div className="progress-percentage">
                                            {parseInt(video.progress || 0)} %
                                        </div>
                                        <div className="progress-bar-container">
                                            <Progress size="tiny" percent={parseInt(video.progress || 0)} />
                                        </div>
                                    </React.Fragment>
                                )}
                        </div>
                    </div>
                </Grid.Column>
            </Grid.Row>
        )
    }
}