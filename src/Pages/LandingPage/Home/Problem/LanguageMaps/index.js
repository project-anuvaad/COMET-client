import React from 'react';
import Map from './Map';
import './style.scss';
import { Button } from 'semantic-ui-react';
import Fade from 'react-reveal/Fade';
import Reveal from 'react-reveal/Reveal';

const MAPS_INFO = {
    1: {
        number: 1,
        countHeader: '23',
        countDescription: 'recognized official languages in India',
        infoItems: ['Hindi speaking states', 'Regional language states'],
        image: '/img/maps/india.svg',
    },
    2: {
        number: 2,
        countHeader: '≈85%',
        countDescription: 'of population speaks regional languages',
        infoItems: ['Regional language speakers', 'English language speakers'],
        image: '/img/maps/regional_languages_in_india.svg',
    },
    3: {
        number: 3,
        countHeader: '<0.1%',
        countDescription: 'content online is in Indian languages',
        infoItems: ['Regional online content', 'English online content'],
        image: '/img/maps/english_vs_regional_content.svg',
    },
}

export default class LanguageMaps extends React.Component {
    state = {
        activeTab: 1,
    }
    render() {
        const { activeTab } = this.state;
        return (
            <div className="maps-container">
                <div className="maps-toggle-container">
                    <Button
                        basic
                        className={`action-buttons india ${activeTab === 1 ? 'action-active' : ''}`}
                        onClick={() => this.setState({ activeTab: 1 })}
                        size="large"
                    >
                        Languages spoken in India
                    </Button>
                    <Button
                        basic
                        onClick={() => this.setState({ activeTab: 2 })}
                        className={`action-buttons regional ${activeTab === 2 ? 'action-active' : ''}`}
                        size="large"
                    >
                        Regional language speakers
                    </Button>
                    <Button
                        basic
                        size="large"
                        onClick={() => this.setState({ activeTab: 3 })}
                        className={`action-buttons english ${activeTab === 3 ? 'action-active' : ''}`}
                    >
                        English vs regional content
                    </Button>
                </div>
                <Fade key={`fade-maps-${activeTab}`}>
                
                    <div
                        style={{ marginTop: '3rem' }}
                    >
                        <Map {...MAPS_INFO[this.state.activeTab]} />
                    </div>
                </Fade>
                <div className="note-container">
                    <p className="note">
                        Note: Map is for representational purposes only. Check out the joint study by KMPG and Google to learn why local language content is the future of Indian internet.
                    </p>
                </div>
            </div>
        )
    }
}