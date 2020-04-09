import React from 'react';
import { Grid, Menu, Segment, Icon, Label } from 'semantic-ui-react'
import LandingPage from '../../../layouts/LandingPage';
import VideoPlayer from 'react-player';
import './style.scss';
import UploadVideoContributeVideo from './UploadVideoContributeVideo';

import requestAgent from '../../utils/requestAgent';
import api from '../../api';
// ../../
import NotificationService from '../../utils/NotificationService';
import UserGuidingTutorialModal from '../../components/UserGuidingTutorialModal';

const basics = [
    {
        title: 'How do i upload a video?',
        link: 'https://stonly.com/explanation/V6qYWygf1g/Steps/',
    },
    {
        title: 'How do I transcribe a video?',
        link: 'https://stonly.com/explanation/DiUVG1eUya/Steps/',
    },
    {
        title: 'How do I translate a video?',
        link: 'https://stonly.com/explanation/lWggv19jOd/Steps/',
    }

]

const detailed = [
    {
        title: 'How do I "proofread" the transcription?',
        link: 'https://stonly.com/explanation/l9PZgi62iQ/Steps/',
    },
    {
        title: 'How do I add voice-overs in VideoWiki?',
        link: 'https://stonly.com/explanation/LG7yTdLSA5/Steps/',
    },
    {
        title: 'How do I generate subtitles?',
        link: 'https://stonly.com/explanation/p8PeLrtYH9/Steps/',
    }
]

const admin = [
    {
        title: 'How do I upload multiple videos?',
        link: 'https://stonly.com/explanation/BBkfRwc8vU/Steps/',
    },
    {
        title: 'Can VideoWiki help me in removing the background noise and improving the quality of my videos?',
        link: 'https://stonly.com/explanation/iNzSuSqEpL/Steps/',
    },
    {
        title: 'How do I add new users on VideoWiki?',
        link: 'https://stonly.com/explanation/DplqMWk3Yd/Steps/',
    },
    {
        title: 'How do I assign videos to my team?',
        link: 'https://stonly.com/explanation/4hjltQx2gn/Steps/',
    }
]


function renderSteps(steps) {
    return steps.map((b, i) => {
        const segmentStyles = {
        }
        if (i !== 0) {
            segmentStyles['border-top'] = 'none';
        }
        return (
            <a
                key={b.title + i}
                href={b.link}
                target="_blank"
                style={{ display: 'block' }}
            >
                <Segment
                    className="step-segment-item"
                    style={segmentStyles}
                >
                    {i + 1}. {b.title}
                    <Icon name="chevron right" className="pull-right" />
                </Segment>
            </a>
        )
    })
}


const ACTIVE_SEGMENT = {
    'Basics': (
        <React.Fragment>
            {renderSteps(basics)}
        </React.Fragment>
    ),
    'Detailed': (
        <React.Fragment>
            {renderSteps(detailed)}
        </React.Fragment>
    ),
    'Admin': (
        <React.Fragment>
            {renderSteps(admin)}
        </React.Fragment>
    )
}

export default class FAQ extends React.Component {
    state = {
        activeTab: 0,
        videos: [],
        guidingModalOpen: false,
    }

    componentWillMount = () => {
        this.loadVideos();
    }

    loadVideos = () => {
        requestAgent.get(api.videoTutorialContribution.getVideos())
            .then((res) => {
                const { videos } = res.body;
                console.log(videos)
                this.setState({ videos });
            })
            .catch(err => {
                console.log(err);
                NotificationService.responseError(err);
            })
    }

    onTabChange = (index) => {
        if (index === 2) return;
        this.setState({ activeTab: index });
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const { activeTab } = this.state;
        const SUBTABS = [{ title: `FAQs` }, { title: `Video Tutorials` }, { title: <span>Interactive Tutorials <span style={{ fontSize: 10, padding: 5, backgroundColor: '#f4cd9a', color: '#330000' }} >Coming soon</span></span> }];
        return (
            <div className="faq">
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <div style={{ padding: '0 10%', paddingTop: '5rem', backgroundColor: '#F3F5F9' }}>
                                <div className="how-it-work-card">
                                    <h3>
                                        How does VideoWiki work?
                                        </h3>

                                    <div>
                                        <span className="label-item">
                                            <Label circular>1</Label> Upload
                                            </span>

                                        <span className="label-item">
                                            <Label circular>2</Label> Trancribe
                                            </span>
                                        <span className="label-item">
                                            <Label circular>3</Label> Translate
                                            </span>
                                    </div>
                                    <div className="play-icon">
                                        <img
                                            onClick={() => this.setState({ guidingModalOpen: true })}
                                            src="/img/onboarding/play-button.png"
                                        />
                                    </div>
                                </div>
                                {SUBTABS.map((item, index) => (
                                    <React.Fragment
                                        key={`subtab-item-${item.title}`}
                                    >
                                        <span
                                            onClick={() => this.onTabChange(index)}
                                            style={{
                                                display: 'inline-block',
                                                cursor: 'pointer',
                                                marginRight: '2rem',
                                                textTransform: 'none',
                                                padding: '1rem',
                                                fontSize: '1rem',
                                                borderBottom: this.state.activeTab === index ? '3px solid #0e7ceb' : 'none',
                                                opacity: this.state.activeTab === index ? 1 : 0.5,
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {item.title}
                                        </span>
                                    </React.Fragment>
                                ))}
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <UserGuidingTutorialModal open={this.state.guidingModalOpen} onClose={() => this.setState({ guidingModalOpen: false })} />
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <div style={{ width: '80%', margin: '0 auto', marginTop: '5rem' }}>
                                {this.state.activeTab === 0 && (

                                    <div>
                                        <h2
                                            style={{ marginTop: '1rem' }}
                                        >
                                            Basics
                                            </h2>
                                        <div>
                                            {renderSteps(basics)}
                                        </div>
                                        <h2>
                                            Detailed
                                            </h2>
                                        <div>
                                            {renderSteps(detailed)}
                                        </div>
                                        <h2>
                                            Admin
                                            </h2>
                                        <div>
                                            {renderSteps(admin)}
                                        </div>
                                    </div>
                                )}
                                {this.state.activeTab === 1 && (
                                    <div>
                                        <h2>
                                            Video tutorials
                                            </h2>
                                        <Grid>
                                            <Grid.Row className="center-space-content">
                                                <Grid.Column width={5} className="video-tutorial-item">
                                                    <h3>Proofreading Tutorial</h3>
                                                    <iframe width="80%"
                                                        height="315" src="https://www.youtube.com/embed/ERofQfGRjNo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                                </Grid.Column>
                                                <Grid.Column width={5} className="video-tutorial-item">
                                                    <h3>Translating Tutorial</h3>
                                                    <iframe width="80%" height="315" src="https://www.youtube.com/embed/gydSz1_QwrY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                                </Grid.Column>
                                                <Grid.Column width={5} className="video-tutorial-item">
                                                    <h3>Generate Subtitles Tutorial</h3>
                                                    <iframe width="80%" height="315" src="https://www.youtube.com/embed/eJ78_Q29rG0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                                </Grid.Column>
                                                {this.state.videos.map(v => (
                                                    <Grid.Column width={5} key={v._id} className="video-tutorial-item">
                                                        <h3>{v.title}</h3>
                                                        <VideoPlayer controls url={v.url} width={'80%'} style={{ height: 315 }} />
                                                    </Grid.Column>

                                                ))}
                                            </Grid.Row>
                                            <Grid.Row>
                                                <Grid.Column width={16} className="video-tutorial-item">
                                                    <UploadVideoContributeVideo />
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </div>
                                )}
                            </div>
                        </Grid.Column>
                    </Grid.Row>

                </Grid>
            </div>
        )
    }
}