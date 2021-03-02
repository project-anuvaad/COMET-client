import React from 'react';
import { Grid, Progress } from 'semantic-ui-react';
import './style.scss';
import VizSensor from 'react-visibility-sensor';
import Fade from 'react-reveal/Fade'

export default class FasterSubtitles extends React.Component {
    state = {
        videoPercent: 0,
        youtubePercent: 0,
    }

    onVisibleChange = (isVisible) => {
        console.log('on change', isVisible)
        if (isVisible) {
            this.videoIntervalId = setInterval(() => {
                if (this.state.videoPercent < 30) {
                    this.setState((state) => ({ videoPercent: state.videoPercent + 5 }))
                } else {
                    clearInterval(this.videoIntervalId)
                }
            }, 70);
            this.youtubeIntervalId = setInterval(() => {
                if (this.state.youtubePercent < 90) {
                    this.setState((state) => ({ youtubePercent: state.youtubePercent + 5 }))
                } else {
                    clearInterval(this.youtubeIntervalId)
                }
            }, 70);

        } else {
            this.setState({ videoPercent: 0, youtubePercent: 0 })
        }
    }

    render() {
        return (
            <div className="faster-subtitles">
                <Grid>
                    <VizSensor
                        onChange={this.onVisibleChange}
                    >
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <h2 className="subtitles-header">
                                    <span className="green">2X Faster</span> Subtitle Generator
                            </h2>
                                <p className="subtitles-desc">
                                    Leveraging the subtitles of the original video, COMET allows users to generate super-fast subtitles for translated videos.
                            </p>
                            </Grid.Column>
                            <Grid.Column width={8}>

                                <Fade>

                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column width={16}>
                                                <h4 className="captioning-header">
                                                    Video<span className="green">Wiki</span> Captioning
                                                </h4>
                                                <span className=" pull-right captioning-timing">
                                                    Avg 2.30 / min
                                                </span>
                                                <div>
                                                    <Progress percent={this.state.videoPercent} color="green" />
                                                </div>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column width={16}>
                                                <h4 className="captioning-header">
                                                    Youtube Captioning
                                        </h4>
                                                <span className=" pull-right captioning-timing">
                                                    Avg 5.00 / min
                                        </span>
                                                <div>
                                                    <Progress percent={this.state.youtubePercent} color="red" />
                                                </div>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Fade>
                            </Grid.Column>
                        </Grid.Row>
                    </VizSensor>
                </Grid>
            </div>
        )
    }
}