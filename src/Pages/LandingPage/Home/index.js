import React from 'react';
import './style.scss';
import { Button, Modal, Grid } from 'semantic-ui-react';

import Problem from './Problem';
import Solution from './Solution';
import WhyVideowiki from './WhyVideowiki';
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";
import { Link } from 'react-router-dom';
import LandingPage from '../../../layouts/LandingPage';

const LANGUAGE_MAPS = {
    0: {
    }
}

export default class Home extends React.Component {
   
    constructor(props){
        super(props);
        this.onRefMount = this.onRefMount.bind(this)
    }
    onRefMount = (ref) => {
        console.log('ref is', ref)
        this.layoutRef = ref;
    }
    renderRegisterNowArrowButton = () => (
        <Button
            size="large"
            className="register-btn"
            color="black"
            style={{ padding: '20px 30px ', width: 290, marginRight: '2rem' }}
            onClick={() => {
                const mainBtn = document.getElementById('main-register-btn') ;
                if (mainBtn) {
                    mainBtn.click();
                }
            }}>
            <span
                style={{ paddingRight: 20 }}
            >Register Now</span>
            <img src="/img/right_arrow.svg" style={{ width: 32, height: 15, verticalAlign: 'bottom' }} />
        </Button>
    )

    render() {
        return (
            <LandingPage>

                <div className="cover" style={{ display: 'flex', justifyContent: 'center' }}>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={10}>
                                <h3 className="header-1">
                                    Build multi-lingual videos
                                        </h3>
                                <h3 className="header-2">
                                    easier, cheaper and faster!
                                        </h3>
                                <p
                                    className="poc"
                                >
                                    Videowiki is a one-stop video localization platform that allows organizations to translate text/add voice-over in local language to their videos.
                                        </p>
                                <div>
                                    {this.renderRegisterNowArrowButton()}
                                    <ScrollLink to={'problem'} smooth offset={-85}>
                                        <Button
                                            size="large"
                                            basic
                                            className="learn-more-btn"
                                            style={{ padding: '20px 30px ' }}
                                        >
                                            Learn More
                                        </Button>
                                    </ScrollLink>
                                </div>
                            </Grid.Column>

                            <Grid.Column width={6}>
                                <img src="/img/Landing page illustration.svg" />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                </div>
                <Problem id="problem" />
                <Solution id="solutions" />
                <WhyVideowiki id="why-videowiki" />
                <div style={{ display: 'flex', justifyContent: 'center', margin: '5rem' }}>
                    {this.renderRegisterNowArrowButton()}
                </div>
            </LandingPage>

        )
    }
}