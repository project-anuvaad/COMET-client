import React from 'react';
import { Grid, Button } from 'semantic-ui-react';
import './style.scss'
import BrowserBox from './BrowserBox';
import BackgroundNoiseBox from './Boxes/BackgroundNoiseBox';
import AudioMasteringBox from './Boxes/AudioMasteringBox';
import AutomaticStitchingBox from './Boxes/AutomaticStitchingBox';

const FEATURES_ITEMS = [
    {
        title: 'Background noise cancellation',
        image: '/img/Background noise cancellation.svg',
        activeImage: '/img/Background noise cancellation_colored.svg',
        width: 60,
    },
    {
        title: 'Audio mastering at your fingertips',
        image: '/img/Audio Mastering.svg',
        activeImage: '/img/Audio Mastering_colored.svg',
        width: 48,
    },
    {
        title: 'Automatic stitching of final video',
        image: '/img/Automatic stiching.svg',
        activeImage: '/img/Automatic stiching_colored.svg',
        width: 56,
    }
]

export default class FlagshipFeatures extends React.Component {
    state = {
        activeTabIndex: 0,
    }

    renderBrowserBox = () => {
        const { activeTabIndex } = this.state;
        switch (activeTabIndex) {
            case 0:
                return <BackgroundNoiseBox />
            case 1:
                return <AudioMasteringBox />
            case 2:
                return <AutomaticStitchingBox />
            default:
                return <BackgroundNoiseBox />
        }
    }
    render() {
        const { activeTabIndex } = this.state;
        return (
            <div className="flagship-features">
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <h2 className="flagship-header">
                                Flagship features
                            </h2>
                            <div className="features-list">
                                {FEATURES_ITEMS.map((item, index) => (

                                    <Button
                                        basic
                                        key={`feature-item-${item.title}`}
                                        className={`feature-item feature-item-${index + 1} ${activeTabIndex === index ? `feature-item-${index + 1}-active` : ''}`}
                                        onClick={() => this.setState({ activeTabIndex: index })}
                                    >
                                        <div
                                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                        >
                                            <div
                                                style={{ width: item.width, height: 'auto', display: 'inline-block', marginRight: 10 }}
                                            >
                                                <img src={index === activeTabIndex ? item.activeImage : item.image} style={{ maxHeight: '100%' }} />
                                            </div>
                                            <span>
                                                {item.title}
                                            </span>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            {this.renderBrowserBox()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}