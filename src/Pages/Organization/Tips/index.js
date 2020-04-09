import React from 'react';
import { Grid, Card, Modal } from 'semantic-ui-react';
import './style.scss';

function fullscreen(elementSelector) {
    // check if fullscreen mode is available
    if (document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.msFullscreenEnabled) {

        // which element will be fullscreen
        const iframe = document.querySelector(elementSelector);
        // Do fullscreen
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
        } else if (iframe.webkitRequestFullscreen) {
            iframe.webkitRequestFullscreen();
        } else if (iframe.mozRequestFullScreen) {
            iframe.mozRequestFullScreen();
        } else if (iframe.msRequestFullscreen) {
            iframe.msRequestFullscreen();
        }
    }
    else {
        alert('Your browser doesnt support full screen mode')
    }
}

function fullscreenChange(elementSelector) {
    const fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
    const iframe = document.querySelector(elementSelector);
    if (iframe.pause) {
        iframe.pause()
    }
    if (fullscreenElement) {
        iframe.src = iframe.src;
    } else {

    }
}

const STONLY_TUTORIALS = [
    {
        title: 'How to upload a video?',
        id: 'ston-V6qYWygf1g',
        src: 'https://stonly.com/embed/V6qYWygf1g/view/',
        image: 'https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/upload-single-video-tutorial.png',
    },
    {
        title: 'How to upload multiple videos?',
        id: 'ston-BBkfRwc8vU',
        src: 'https://stonly.com/embed/BBkfRwc8vU/view/',
        image: 'https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/upload-multiple-videos-tutorial.png'
    },
    {
        title: 'What is AI Transcribe?',
        id: 'ston-DiUVG1eUya',
        src: 'https://stonly.com/embed/DiUVG1eUya/view/',
        image: 'https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/what+is+AI+tutorial.png',
    },
    {
        title: 'How to type in local languages?',
        id: 'ston-JlidaH4tKv',
        src: 'https://stonly.com/embed/JlidaH4tKv/view/',
        image: 'https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/typing+in+local+language+tutorial.png',
    },

    {
        title: 'How to Proofread a video?',
        id: 'ston-l9PZgi62iQ',
        src: 'https://stonly.com/embed/l9PZgi62iQ/view/',
    },
    {
        title: 'How to Translate a video?',
        id: 'ston-LG7yTdLSA5',
        src: 'https://stonly.com/embed/LG7yTdLSA5/view/',
    },
    {
        title: 'Reviewing a video',
        type: 'video',
        id: 'review_tutorial',
        src: 'https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/review_tutorial.mp4',
    },
    {
        title: 'Translating a Video',
        type: 'video',
        id: 'translate_tutorial',
        src: 'https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/translate_tutorial.mp4',
    }

]

// const `#${this.state.iframeId}` = 'tutorial-iframe'
export default class Tips extends React.Component {
    state = {
        modalVisible: false,
        selectedTutorial: null,
        iframeSrc: '',
        iframeId: 'tutorial-iframe',
        currentItem: null,
    }

    onFullScreenChange = () => {
        if (this.state.currentItem.type === 'video') {
            fullscreenChange(`#${this.state.currentItem.id}`)
        } else {
            fullscreenChange(`#${this.state.iframeId}`);
        }
    }

    componentDidMount = () => {
        document.addEventListener('webkitfullscreenchange', this.onFullScreenChange);
        document.addEventListener('mozfullscreenchange', this.onFullScreenChange);
        document.addEventListener('fullscreenchange', this.onFullScreenChange);
        document.addEventListener('MSFullscreenChange', this.onFullScreenChange);

    }

    componentWillUnmount = () => {
        document.removeEventListener('webkitfullscreenchange', this.onFullScreenChange)
        document.removeEventListener('mozfullscreenchange', this.onFullScreenChange)
        document.removeEventListener('fullscreenchange', this.onFullScreenChange)
        document.removeEventListener('MSFullscreenChange', this.onFullScreenChange)
    }

    onOpenTutorial = (tutorialItem) => {
        this.setState({ currentItem: tutorialItem })
        if (tutorialItem.type === 'video') {
            fullscreen(`#${tutorialItem.id}`);
            return;
        }
        this.setState({ iframeSrc: tutorialItem.src });
        setTimeout(() => {
            fullscreen(`#${this.state.iframeId}`)
        }, 500);
    }

    render() {
        return (
            <Grid style={{ padding: '2rem' }}>
                <Grid.Row style={{ textAlign: 'center' }}>
                    {STONLY_TUTORIALS.map((t, index) => (
                        <Grid.Column width={5} key={'tutorial' + index} style={{ marginBottom: '2rem' }} onClick={() => this.onOpenTutorial(t)}>
                            <a href="javascript:void(0);">
                                <Card fluid>
                                    <Card.Header style={{ padding: '1rem' }}>
                                        <h3>
                                            Tutorial {index + 1}
                                        </h3>
                                    </Card.Header>
                                    <Card.Content className="card-content">
                                        <h5>
                                            {t.title}  {t.type === 'video' && ( <span style={{ fontSize: '0.7rem', fontWeight: 'bold'}}>
                                                (Video)
                                            </span>)}
                                        
                                        </h5>
                                        {t.type === 'video' && (
                                            <video
                                                id={t.id}
                                                src={t.src}
                                                width="0"
                                                height="0"
                                                controls
                                            />
                                        )}
                                    </Card.Content>
                                </Card>
                            </a>
                        </Grid.Column>
                    ))}
                </Grid.Row>
                <iframe id={this.state.iframeId} width="100%" height="815" frameBorder="0" name="StonlyExplanation" style={{ width: 0, height: 0 }} allowFullScreen src={this.state.iframeSrc} />
            </Grid>
        )
    }
}