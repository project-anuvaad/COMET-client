import React from 'react';

import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";
import { Link, NavLink, withRouter } from 'react-router-dom';
import { StickyContainer, Sticky } from 'react-sticky';
import { Button, Modal, Grid, Icon } from 'semantic-ui-react';
import queryString from 'query-string';
import routes from '../../shared/routes';


import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import PasswordResetForm from './PasswordResetForm';

// import './style.scss';
import './custom.scss';
import GiveFeedbackModal from '../../shared/components/GiveFeedbackModal';

const NAV_LINKS = [
    {
        title: 'Problem',
        id: 'problem',
    },
    {
        title: 'Our Solutions',
        id: 'solutions',
    },
    {
        title: 'API',
        route: routes.api(),
    },
    {
        title: 'FAQ',
        route: routes.faq(),
    }
]

class LandingPage extends React.Component {
    state = {
        registerModalOpen: false,
        loginModalVisible: false,
    }
    componentWillMount = () => {
        // const { hostname, protocol, search } = window.location;
    }

    componentDidMount = () => {

        const { search } = window.location;
        const { login } = queryString.parse(search);
        if (login) {
            this.setState({ loginModalVisible: true }, () => {
            });
        }
        if (window.location.hash) {
            const activeSection = window.location.hash.split('#').pop();
            setTimeout(() => {
                scroll.scrollTo(parseInt(document.getElementById(activeSection).getBoundingClientRect().y - 85 * 1.5))
            }, 500);
        }

        // this.setDefaultRedirectUrl();
    }

    // setDefaultRedirectUrl() {
    //     const host = window.location.hostname;

    //     const getEnvironment = (host) => {
    //         switch (true) {
    //             case /^(.*\.)?translate.ntp.net.in$/.test(host): return "https://preprod.ntp.net.in/"; break;
    //             case /^(.*\.)?translate.diksha.gov.in$/.test(host): return "https://diksha.gov.in/"; break;
    //             default: return "https://preprod.ntp.net.in/"; break;
    //         }
    //     };

    //     document.querySelector(".logo").href = getEnvironment(host);
    //     document.querySelector(".explore").href = `${getEnvironment(host)}explore`;
    //     document.querySelector(".tnc").href = `${getEnvironment(host)}term-of-use.html`;
    // }

    openRegisterModal = () => {
        this.setState({ registerModalOpen: true })
    }

    onOrganizationSignup = () => {
        this.setState({
            isOrganizationSignupOpen: true
        });
    }

    renderRegisterModal = () => (
        <Modal
            open={this.state.registerModalOpen}
            onClose={() => this.setState({ registerModalOpen: false })}
            trigger={
                <button type="button" id="main-register-btn" className="explore-diksha"
                    onClick={() => this.setState({ registerModalOpen: true })}>
                    SIGN UP
                </button>
            }
            size='tiny'
        >
            <Modal.Header>Organization Sign up</Modal.Header>

            <Modal.Content>
                <div>
                    <div className="ui segment" style={{ border: 'none', boxShadow: 'none' }}>
                        <div className="ui very relaxed one column grid">
                            <div className="column">
                                <SignupForm
                                    onCancel={() => this.setState({ registerModalOpen: false })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Content>
        </Modal>
    )

    renderLoginModal = () => (
        <Modal
            onClose={() => this.setState({ loginModalVisible: false })}

            trigger={
                <button type="button" className="login-translate" onClick={() => this.setState({ loginModalVisible: true })}>
                    Login To Translate
                </button>
            }
            open={this.state.loginModalVisible}
            size='tiny'
        >
            <Modal.Header>Login</Modal.Header>

            <Modal.Content>
                <div>
                    <div className="ui segment" style={{ border: 'none', boxShadow: 'none' }}>

                        <div className="ui very relaxed one column grid">
                            <div className="column">
                                <LoginForm
                                    onCancel={() => this.setState({ loginModalVisible: false })}
                                    onForgotPasswordClick={() => this.setState({ loginModalVisible: false, forgotPasswordModalVisible: true })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Content>
        </Modal>
    )

    renderForgotPasswordModal = () => (
        <Modal
            size="tiny"
            open={this.state.forgotPasswordModalVisible}
            onClose={() => this.setState({ forgotPasswordModalVisible: false })}
        >
            <Modal.Header>
                Password Reset
            </Modal.Header>
            <Modal.Content>

                <div>
                    <div className="ui segment" style={{ border: 'none', boxShadow: 'none' }}>

                        <div className="ui very relaxed one column grid">
                            <div className="column">
                                <PasswordResetForm
                                    onCancel={() => this.setState({ forgotPasswordModalVisible: false })}
                                    onLoginClick={() => this.setState({ loginModalVisible: true, forgotPasswordModalVisible: false })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Content>
        </Modal>
    )

    onScrollClick = (item) => {
        console.log('On Scroll click', item);
        const element = window.document.getElementById(item.id);
        console.log('element', element)
        if (!element) {
            this.props.history.push(`${routes.home()}#${item.id}`);
        }
    }

    render() {
        return (
            <StickyContainer>
                <div className="container-fluid p-0 ">
                    <header className="header">
                        <a href="#" className="logo"> <img src="https://via.placeholder.com/100" alt="Comet Logo" /> </a>
                        <a href="#" className="explore no-underline">
                            {/* <button type="button" className="explore-diksha">
                                EXPLORE DIKSHA
                            </button> */}
                            {/* {this.renderRegisterModal()} */}
                        </a>
                    </header>
                    <div className="contents">
                        <section className="intro-section">
                            <div className="row flex-even">
                                <div className="col-xl-7 col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                    <div className="intro-content">
                                        <h3>COMET</h3>
                                        <p>COMET - Community Orchestrated Media Translator is a tool that enables translation of video content from English/Hindi to other Indian languages. Users can translate the videos easily and quickly, without the need for a studio set up. The tool automatically extracts speech from source video and translates into text of the target language. Besides, to ensure high audio quality the tool also eliminates background noise, if any, in the voice over recording. COMET is a fork from VideoWiki and is being further enhanced using Indian language translation services within <a href="https://anuvaad.org/">anuvaad.org</a>. COMET is also open sourced under MIT licensed and is <a href="https://github.com/project-anuvaad">available here</a>.</p>
                                    </div>
                                </div>
                                <div className="col-xl-5 col-lg-6 col-md-6 col-sm-12 col-xs-12 worldCloud">
                                    <img src="/img/user.png" alt="user" />
                                    <a href="#" className="login no-underline">
                                        {this.renderLoginModal()}
                                    </a>
                                </div>
                                {/* <div className="col-md-12 col-sm-12 col-xs-12">
                                    <div className="worldCloud">
                                        <img src="/img/user.png" alt="user" />
                                        <a href="#" className="login no-underline">
                                            {this.renderLoginModal()}
                                        </a>
                                    </div>
                                    <div className="intro-content">
                                        <h3>Video Translate</h3>
                                        <p>Video Translate is a tool that enables translation of video content from English/Hindi to other Indian languages. Users can translate the videos easily and quickly, without the need for a studio set up. The tool automatically extracts speech from source video and translates into text of the target language. Besides, to ensure high audio quality the tool also eliminates background noise, if any, in the voice over recording.</p>
                                    </div>
                                </div> */}
                                {this.renderForgotPasswordModal()}
                            </div>
                            <div className="pentagon-background"></div>
                        </section>
                        <section className="eResources">
                            <section className="absolute-section">
                                <section className="about-section text-center">
                                    <label className="aboutVidyadaan">The process involves simple steps of:</label>
                                    <div className="row">
                                        <div className="col-12 all-steps">
                                            <div className="steps">
                                                <img src="/img/resources/1.png" alt="step - 1" />
                                                <label>Upload Video</label>
                                            </div>
                                            <span className="arrow"></span>
                                            <div className="steps">
                                                <img src="/img/resources/2.png" alt="step - 2" />
                                                <label>Proofread transcription text</label>
                                            </div>
                                            <span className="arrow"></span>
                                            <div className="steps">
                                                <img src="/img/resources/3.png" alt="step - 3" />
                                                <label>Translate the text</label>
                                            </div>
                                            <span className="arrow"></span>
                                            <div className="steps">
                                                <img src="/img/resources/4.png" alt="step - 4" />
                                                <label>Add Voice Over and Subtitles</label>
                                            </div>
                                            <span className="arrow"></span>
                                            <div className="steps">
                                                <img src="/img/resources/5.png" alt="step - 5" />
                                                <label>Download Translated Video</label>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </section>
                        </section>
                        <section className="P1060 footer-section">
                            <footer id="footer">
                                <div className="footer container-fluid">
                                    <div className="row text-center">
                                        <div className="col-12">
                                            {/* <label className="en">Contact for queries:</label>
                                            <p className="lh0"> <a href="mailto:support@diksha-ncte.freshdesk.com">support@diksha-ncte.freshdesk.com</a>
                                            </p> */}
                                            <p className="MT-30">
                                                <a href="#" className="tnc">&copy; 2021, COMET</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <img src="/img/footer.png" />
                            </footer>
                        </section>
                    </div>
                </div>
            </StickyContainer>
        )
    }
}

export default withRouter(LandingPage)