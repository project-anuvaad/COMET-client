import React from 'react';
import BrowserBox from '../BrowserBox';
import { Button, Icon } from 'semantic-ui-react';
import './style.scss'

export default class Box extends React.Component {
    videoRef = {}
    state = {
        playing: false,
    }
    componentWillReceiveProps(nextProps) {

    }

    onTabChange = (index) => {
        console.log('tab change', index)
        const { activeTabIndex } = this.props;
        if (this.videoRef[activeTabIndex] && this.videoRef[activeTabIndex].pause) {
            this.videoRef[activeTabIndex].pause();
        }
        if (this.videoRef[activeTabIndex]) {
            this.props.onTabChange(index, this.videoRef[this.props.activeTabIndex].currentTime)
        } else {
            this.props.onTabChange(index, 0)
        }
    }

    onTogglePlay = () => {
        const { activeTabIndex } = this.props;
        if (this.state.playing) {
            this.videoRef[activeTabIndex].pause()
        } else {
            this.videoRef[activeTabIndex].play();
        }
    }

    render() {
        const { tabs, activeTabIndex } = this.props;

        return (
            <div className="box">

                {tabs && tabs.length > 0 ? (

                    <BrowserBox >
                        <div className="browser-box-buttons-conatiner">
                            <Button.Group>
                                {tabs.map((b, index) => {
                                    return (
                                        <Button
                                            key={b.text}
                                            size="tiny"
                                            basic={activeTabIndex !== index}
                                            color={b.backgroundColor}
                                            onClick={() => this.onTabChange(index)}
                                        >
                                            {b.text}
                                        </Button>
                                    )
                                })}
                            </Button.Group>
                        </div>
                        <div className="play-icon-container" onClick={this.onTogglePlay}>
                            <span
                                className={`play-icon ${this.state.playing ? 'play' : 'pause'}`}
                            >
                                <Icon name={this.state.playing ? 'pause' : 'play'} size="huge" />
                            </span>
                        </div>
                        {tabs.map((t, index) => (
                            <video
                                key={`video-${tabs[index] && tabs[index].video}`}
                                ref={ref => this.videoRef[index] = ref}
                                controls
                                preload={false}
                                onPlay={() => { this.setState({ playing: true })}}
                                onPause={() => this.setState({ playing: false })}
                                onEnded={() => this.setState({ playing: false })}
                                onLoadedMetadata={() => this.videoRef[index].currentTime = tabs[index].currentTime || 0}
                                src={tabs[index] && tabs[index].video}
                                style={{
                                    width: '100%',
                                    display: activeTabIndex === index ? 'block' : 'none'
                                }}
                            />
                        ))}
                    </ BrowserBox>
                ) : (
                        <BrowserBox style={{ height: '100%' }}>
                            <div
                                style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            >
                                <h2>
                                    Coming Soon
                            </h2>
                            </div>
                        </BrowserBox>
                    )}
            </div>
        )
    }
}