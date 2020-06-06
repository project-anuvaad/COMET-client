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

import './style.scss';
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
        title: 'Why Videowiki?',
        id: 'why-videowiki'
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

        // const hostnameParts = hostname.split('.');
        // console.log('hostname parts', hostnameParts)
        // if (hostnameParts.length > 2 && hostnameParts[0] !== 'www' && (hostnameParts.indexOf('videowiki') !== -1)) {
        //     window.location.href = `${protocol}//${hostnameParts[hostnameParts.length - 2]}.${hostnameParts[hostnameParts.length - 1]}/${search || ''}`;
        // }
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
    }

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
                <Button
                    color="black"
                    size="medium"
                    id="main-register-btn"
                    className="register-btn"
                    onClick={() => this.setState({ registerModalOpen: true })}>
                    Register Now
                </Button>
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
                <Button className="nav-btn" basic onClick={() => this.setState({ loginModalVisible: true })}>
                    Login
                </Button>
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
                <div className="home">
                    <GiveFeedbackModal
                        buttonProps={{
                            color: "red",
                            className: "give-feedback-btn"
                        }}
                    />
                    <Sticky topOffset={85 * 2}>
                        {({ style, distanceFromTop, calculatedHeight }) => (
                            <nav style={style} className="header-wrapper">
                                <h2 className="ui home-header">
                                    <div className="logo-wrapper">
                                        <Link to={routes.home()}>
                                            <span className="video">Video</span>
                                            <span className="wiki">Wiki</span>
                                        </Link>
                                    </div>
                                    <div className="pull-right" style={{ display: 'flex', justifyContent: 'center', alignItems: 'stretch' }}>
                                        <ul className="navbar">
                                            {NAV_LINKS.map((n) => (
                                                n.id ? (
                                                    <ScrollLink
                                                        // spy
                                                        onClick={() => this.onScrollClick(n)}
                                                        isDynamic
                                                        hashSpy
                                                        to={n.id}
                                                        smooth
                                                        offset={-calculatedHeight}
                                                    >
                                                        <li className="nav-btn" key={`navlink-${n.title}`}>

                                                            <div>
                                                                {n.title}
                                                            </div>
                                                        </li>
                                                    </ScrollLink>
                                                ) : (
                                                        <li className="nav-btn" key={`navlink-${n.title}`}>
                                                            {n.route ? (

                                                                <NavLink to={n.route} activeClassName="active" >
                                                                    {n.title}
                                                                </NavLink>
                                                            ) : (
                                                                    <a href={n.url} target="_blank">{n.title}</a>
                                                                )}
                                                        </li>
                                                    )

                                            ))}

                                            <li>
                                                {this.renderLoginModal()}
                                            </li>
                                            <li>
                                                {this.renderRegisterModal()}
                                            </li>
                                            {this.renderForgotPasswordModal()}
                                        </ul>
                                    </div>
                                </h2>
                            </nav>
                        )}
                    </Sticky>

                    <div className="content" style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: this.props.stretched ? '100%' : '80%' }}>
                            {this.props.children}
                        </div>
                    </div>

                    <footer className="footer">
                        <div className="initiative">
                            <p>
                                {/* An initiative of Pratik Shetty Foundation */}
                            </p>
                        </div>
                        <div className="links">
                            <a href="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/TVW+-+Terms+of+Service.pdf" target="_blank" rel="noopener noreferrer" >Terms of service</a>
                            <a href="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/TVW+-+Privacy+Policy.pdf" target="_blank" rel="noopener noreferrer" >Privacy Policy</a>
                        </div>
                    </footer>
                </div>
            </StickyContainer>
        )
    }
}

export default withRouter(LandingPage)