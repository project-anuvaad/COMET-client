import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Icon, Button, Card, Popup } from 'semantic-ui-react';
import VideoStages from '../../components/VideoStages';
import TranscribeStages from '../../components/TranscribeStages';
import routes from '../../routes';
import AnimatedButton from '../../components/AnimatedButton';

export default class VideoProofreadCard extends React.Component {

    render() {

        const { video, index } = this.props;
        const loading = video.status === 'converting';

        return (
            <Grid.Row>
                <Grid.Column width={16}>
                    <Card fluid style={{ padding: '0.8rem' }}>

                        <div>
                            <VideoStages activeStage="transcribe" />
                        </div>
                        <div>
                            <TranscribeStages activeStage="proofread" activeColor="#0e7ceb" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                            <p>
                                <strong>
                                    Video {index + 1}: {video.title}
                                </strong>
                            </p>
                            <Popup
                                basic
                                content="Proofread video"
                                trigger={(loading ? (
                                    <AnimatedButton
                                        animating={this.props.animating && !loading}
                                        animation="moema"
                                        color="blue"
                                        circular
                                        loading={loading}
                                        disabled={loading}
                                        size="tiny"
                                        icon="play"
                                    />
                                ) : (
                                        <Link to={routes.convertProgressV2(video._id)}>
                                            <AnimatedButton
                                                animating={this.props.animating && !loading}
                                                animation="moema"
                                                color="blue"
                                                circular
                                                loading={loading}
                                                disabled={loading}
                                                size="tiny"
                                                icon="play"
                                            />
                                        </Link>
                                    )

                                )}
                            />
                        </div>
                        <p>
                            {loading ? (
                                <small> <strong>Congratulations!</strong> your video is being finalized</small>
                            ) : (
                                    <small> <strong>Congratulations!</strong> your video moved to the next stage</small>
                                )}
                        </p>

                    </Card>
                </Grid.Column>
            </Grid.Row>
        )
    }
}