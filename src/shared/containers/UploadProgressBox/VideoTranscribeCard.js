import React from 'react';
import { Grid, Button, Card, Popup } from 'semantic-ui-react';
import VideoStages from '../../components/VideoStages';
import TranscribeStages from '../../components/TranscribeStages';
import AnimatedButton from '../../components/AnimatedButton';

export default class VideoTranscribeCard extends React.Component {

    render() {
        const SUBTABS = [{ title: `AI Transcribe` }, { title: `Proofread` }, { title: `Completed` }];

        const { video, index } = this.props;
        const loading = video.status === 'transcriping';

        return (
            <Grid.Row>
                <Grid.Column width={16}>
                    <Card fluid style={{ padding: '0.8rem' }}>

                        <div>
                            <VideoStages activeStage="transcribe" />
                        </div>
                        <div>
                            <TranscribeStages activeStage="ai transcribe" activeColor="#0e7ceb" />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                            <p>
                                <strong>
                                    Video {index + 1}: {video.title}
                                </strong>
                            </p>
                            <Popup
                                basic
                                content="AI Transcribe Video"
                                trigger={(
                                    <AnimatedButton
                                        animating={this.props.animating && !loading}
                                        animation="moema"
                                        color="blue"
                                        loading={loading}
                                        disabled={loading}
                                        size="tiny"
                                        circular
                                        icon="play"
                                        onClick={this.props.onTranscribe}
                                    />
                                )}
                            />
                        </div>
                        <p>
                            {loading ? (
                                <small>Your video is being transcribed </small>
                            ) : (
                                    <small> Your video is now uploaded and ready to be transcribed</small>
                                )}
                        </p>
                    </Card>
                </Grid.Column>
            </Grid.Row>
        )
    }
}