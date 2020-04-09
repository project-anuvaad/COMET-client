import React from 'react';
import { formatTime } from '../../utils/helpers';
import { Button, Progress, Icon } from 'semantic-ui-react';
import './style.scss';

export default class ProofreadingVideoPlayerV2 extends React.Component {
    state = {
        controlsVisible: false,
    }

    onProgressClick = (e) => {
        const percent = (e.clientX - e.target.getBoundingClientRect().x) / e.target.parentNode.getBoundingClientRect().width;
        const { duration } = this.props;
        this.props.onTimeChange(duration * percent)

    }

    render() {
        return (
            <div>

                <div
                    style={{ width: this.props.width || '700px', margin: '0 auto', position: 'relative' }}
                    onMouseOver={() => this.setState({ controlsVisible: true })}
                    onMouseLeave={() => this.setState({ controlsVisible: false })}
                >
                    <video
                        width={'100%'}
                        style={{ maxWidth: '100%', margin: '0 auto', display: 'block' }}
                        muted={!!this.props.audio || this.props.muted}
                        currentTime={this.props.currentTime}
                        src={this.props.url}
                        autoPlay={this.props.playing}
                        ref={(ref) => this.props.videoRef(ref)}
                        onLoadedData={this.props.onVideoLoad}
                    />

                    {this.props.audio && (
                        <audio
                            muted={this.props.muted}
                            currentTime={this.props.currentTime}
                            src={this.props.audio}
                            muted={this.props.muted}
                            autoPlay={this.props.playing}
                            ref={(ref) => this.props.audioRef && this.props.audioRef(ref)}
                        // onLoadedData={this.props.onVideoLoad}
                        />
                    )}
                    {this.props.text && (
                        <p
                            style={{
                                position: 'absolute',
                                left: '0',
                                right: 0,
                                bottom: this.state.controlsVisible ? '10%' : '5%',
                                color: 'white',
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                padding: 5,
                                textAlign: 'center'
                            }}
                        >
                            {this.props.text}
                        </p>
                    )}
                    <div className="progress-container"
                        style={{
                            width: this.props.width || 700,
                        }}>
                        <Progress
                            className="progress"
                            size={this.state.controlsVisible ? 'medium' : 'tiny'}
                            percent={this.props.currentTime / this.props.duration * 100}
                            onClick={this.onProgressClick}
                        />
                    </div>
                </div>
                <div
                    className="controls"
                >
                    <div
                        className="timing"
                    >
                        <span className={`current ${this.props.inverted ? 'inverted' : ''}`}>{formatTime(this.props.currentTime)}</span>
                        <span className={`separator ${this.props.inverted ? 'inverted' : ''}`}>
                            /
                        </span>
                        <span className="end">
                            {formatTime(this.props.duration)}
                        </span>
                    </div>
                    <div>

                        {/* <Button
                            basic
                            style={{ color: 'white !important', borderColor: 'white', boxShadow: '0 0 0 1px white inset' }}
                            circular
                        >
                        </Button> */}
                        <Icon
                            circular
                            className="play-icon"
                            id={this.props.inverted ? `play-icon-inverted` : `play-icon`}
                            size="large"
                            name={this.props.playing ? 'pause' : 'play'}
                            onClick={this.props.onPlayToggle}
                        />
                    </div>
                    {this.props.extraContent}
                </div>

            </div>
        )
    }
}

