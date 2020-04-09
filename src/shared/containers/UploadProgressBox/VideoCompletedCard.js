import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, Card, Popup } from 'semantic-ui-react';
import VideoStages from '../../components/VideoStages';
import TranscribeStages from '../../components/TranscribeStages';
import routes from '../../routes';
import AnimatedButton from '../../components/AnimatedButton';

export default class VideoCompletedCard extends React.Component {

    render() {

        const { video, index, animating } = this.props;

        return (
            <Grid.Row>
                <Grid.Column width={16}>
                    <Card fluid style={{ padding: '0.8rem' }}>

                        <div>
                            <VideoStages activeStage="translate" />
                        </div>
                        <div>
                            <TranscribeStages activeStage="completed" activeColor="#0e7ceb" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                            <p>
                                <strong>
                                    Video {index + 1}: {video.title}
                                </strong>
                            </p>
                            <Popup
                                basic
                                content="Translate video"
                                trigger={(
                                    <Link to={routes.organziationTranslations({ video: video._id })}>
                                        <AnimatedButton
                                            animating={animating}
                                            animation="moema"
                                            color="blue"
                                            circular
                                            size="tiny"
                                            icon="play"
                                        />
                                    </Link>
                                )}
                            />
                        </div>
                        <p>
                            <small> <strong>Congratulations!</strong> your video is ready to be translated</small>
                        </p>

                    </Card>
                </Grid.Column>
            </Grid.Row>
        )
    }
}