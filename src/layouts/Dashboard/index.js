import React from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { Button, Icon, Menu, Grid, Card, Dropdown, Modal, Input, Loader, Dimmer, Label } from 'semantic-ui-react'
import * as Sentry from '@sentry/browser';
import './style.scss';
import Avatar from 'react-avatar';
import fileUtils from '../../shared/utils/fileUtils';
import websockets from '../../websockets';

import { APP_ENV } from '../../shared/constants';

import NotificationService from '../../shared/utils/NotificationService';
import * as organizationActions from '../../actions/organization';
import * as pollerActions from '../../actions/poller';

import { redirectToSwitchOrganization, fetchUserApiKey, updateShowUserGuiding } from '../../actions/authentication'
import routes from '../../shared/routes';
import RoleRenderer from '../../shared/containers/RoleRenderer';
import ShowMore from '../../shared/components/ShowMore';
import NotificationsDropdown from './NotificationsDropdown';
import UploadProgressBox from '../../shared/containers/UploadProgressBox';
import GiveFeedbackModal from '../../shared/components/GiveFeedbackModal';
import UserGuidingTutorialModal from '../../shared/components/UserGuidingTutorialModal';
import { setUploadedVideos } from '../../actions/video';
import { canUserAccess, getUserNamePreview, getUserName } from '../../shared/utils/helpers';

function getNavLinks(user, organization) {
    if (!user || !organization) return [];


    let translationNavTitle = 'My Translations'
    // If he's translator and approver, show  My Translations & Approvals
    if (canUserAccess(user, organization, ['approve_translations']) && canUserAccess(user, organization, ['translate_text', 'voice_over_artist'])) {
        translationNavTitle += ' & Approvals';
        // if he's an approver only, show My Translations Approvals
    } else if (canUserAccess(user, organization, ['approve_translations'])) {
        translationNavTitle = 'My Translation Approvals';
    }

    let transcriptionNavTitle = 'My Transcriptions';
    // If he's transcriber and approver, show  My Transcriptions & Approvals
    if (canUserAccess(user, organization, ['approve_transcriptions']) && canUserAccess(user, organization, ['break_videos', 'transcribe_text'])) {
        transcriptionNavTitle += ' & Approvals';
        // if he's an approver only, show My Transcription Approvals
    } else if (canUserAccess(user, organization, ['approve_translations'])) {
        transcriptionNavTitle = 'My Transcription Approvals';
    }

    const navLinks = [
        {
            title: 'Home',
            route: routes.organizationVideos(),
            icon: 'home',
        },
        {
            title: translationNavTitle,
            route: routes.organziationTasksTranslations(),
            roles: [
                'admin',
                'project_leader',
                'translate',
                'voice_over_artist',
                'translate_text',
                'approve_translations',
            ],
            icon: 'translate',
        },
        {
            title: transcriptionNavTitle,
            route: routes.organziationTasksReview(),
            roles: [
                'admin',
                'project_leader',
                'review',
                'break_videos',
                'transcribe_text',
                'approve_transcriptions',
            ],
            icon: 'pencil alternate',
        },
        {
            title: 'Archive',
            route: routes.organizationArchive(),
            roles: [
                'admin',
                'project_leader',
            ],
            icon: 'archive',
        },
        {
            title: 'Users',
            route: routes.organizationUsers(),
            roles: [
                'admin',
                'project_leader',
            ],
            icon: 'user',
        },
        {
            title: 'Noise Cancellation',
            route: routes.noiseCancellation(),
            icon: 'headphones',
        },
        {
            title: 'API Keys',
            route: routes.organizationAPIKeys(),
            roles: [
                'admin',
                'project_leader',
            ],
            icon: 'key',
        },
    ];

    return navLinks;
}

const AUTHENTICATE_USER_JOB = 'AUTHENTICATE_USER_JOB';

class Dashboard extends React.Component {
    state = {
        uploadFormOpen: false,
        expanded: false,
        createOrganizationModalVisible: false,
        currentLocation: '/organization',
    }

    componentWillMount = () => {
        const { organization, user } = this.props;
        const { hostname } = window.location;
        const hostParts = hostname.split('.')
        const urlOrgName = hostParts[0].toLowerCase().replace(/\-/g, ' ')
        // If the url indicates another organization, redirect the user to that org
        if (urlOrgName !== organization.name.toLowerCase()) {
            if (!user || !user.organizationRoles) return;
            const targetOrgRole = user.organizationRoles.find((r) => r.organization.name.toLowerCase() === urlOrgName);
            if (targetOrgRole) {
                this.onSwitchOrganization(targetOrgRole, this.props.history.location.pathname);
            }
        }
    }

    componentDidMount = () => {
        this.props.setNewOrganizationLogo(null);
        this.props.setNewOrganizationName('');
        this.props.fetchUserApiKey(this.props.organization._id)
        if (this.props.organization) {
            this.props.fetchOrganization(this.props.organization._id)
        }
        this.websocketConnection = websockets.createWebsocketConnection(APP_ENV.WEBSOCKET_SERVER_URL, {
            path: '/socket.io',
            transports: ['websocket'],
            secure: true,
        })
        if (this.props.userToken && this.props.organization && this.props.organization._id) {
            websockets.subscribeToEvent(websockets.websocketsEvents.AUTHENTICATE_SUCCESS, (data) => {
                console.log('============ auth seccuess');
            })
            websockets.subscribeToEvent(websockets.websocketsEvents.AUTHENTICATE_FAILED, (data) => {
                NotificationService.info('Session expired, please login');
                setTimeout(() => {
                    this.props.history.push(routes.logout());
                }, 1000);
            })

            websockets.subscribeToEvent(websockets.websocketsEvents.DOWNLOAD_FILE, ({ url }) => {
                console.log('Downloading file', url);
                fileUtils.downloadFile(url);
            });

            this.props.startJob({ jobName: AUTHENTICATE_USER_JOB, interval: 60 * 1000, immediate: true }, () => {
                websockets.emitEvent(websockets.websocketsEvents.AUTHENTICATE, { organization: this.props.organization._id, token: this.props.userToken });
            })
        }
        if (!this.props.userGuidingShowed && this.props.user && this.props.user.showUserGuiding) {
            this.props.setUserGuidingTutorialModalOpen(true);
            this.props.setUserGuidingShowed(true)
        }
        const { user, organization } = this.props;
        if (user && process.env.NODE_ENV === 'production') {
            Sentry.configureScope(function (scope) {
                const userInfo = {
                    email: user.email,
                    id: user._id,
                }
                if (organization && organization) {
                    userInfo.organization = organization.name;
                    userInfo.organizationId = organization._id;
                }
                scope.setUser(userInfo);
            });
        }
    }

    componentWillUnmount = () => {
        if (this.websocketConnection) {
            websockets.unsubscribeFromEvent(websockets.websocketsEvents.AUTHENTICATE_SUCCESS);
            websockets.unsubscribeFromEvent(websockets.websocketsEvents.AUTHENTICATE_FAILED);
            websockets.unsubscribeFromEvent(websockets.websocketsEvents.DOWNLOAD_FILE);
        }
        this.props.stopJob(AUTHENTICATE_USER_JOB);
    }

    onCreateOrganization = () => {
        const { newOrganizationName, newOrganizationLogo } = this.props;
        this.props.createOrganization(newOrganizationName, newOrganizationLogo);
    }

    onUploadLogo = (file) => {
        if (file) {
            this.props.updateOrganizationLogo(file);
        }
    }

    canUpload = () => {
        const { organization, user } = this.props;
        if (!user || !organization || !user.organizationRoles) return false;
        const userRole = user.organizationRoles.find((role) => role.organization._id === organization._id);
        if (!userRole) return false;
        if (userRole.organizationOwner || userRole.permissions.indexOf('admin') !== -1) return true;
        return false;
    }

    onSwitchOrganization = (organizationRole, redirectTo = '') => {
        const { userToken } = this.props;
        // Commented this out, organization will be automatically set after logging to the new org
        // this.props.setOrganization(organizationRole.organization);
        this.props.redirectToSwitchOrganization(userToken, organizationRole.organization, redirectTo);
    }

    renderCreateOrganizationModal = () => (
        <Modal open={this.state.createOrganizationModalVisible} size="tiny">
            <Modal.Header>
                Create Organization
            </Modal.Header>
            <Modal.Content>
                <Grid>
                    <Grid.Row style={{ display: 'flex', alignItems: 'center' }}>
                        <Grid.Column width={5}>
                            Organization Name
                            <span style={{ color: 'red' }}> *</span>
                        </Grid.Column>
                        <Grid.Column width={11}>
                            <Input
                                fluid
                                placeholder="name"
                                onChange={(e, { value }) => this.props.setNewOrganizationName(value)}
                                value={this.props.newOrganizationName}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>

                        <Grid.Column width={5}>
                            Logo
                        </Grid.Column>
                        <Grid.Column width={11}>
                            <input
                                accept="image/*"
                                type="file"
                                ref={(ref) => this.logoItemRef = ref}
                                onChange={(e) => this.props.setNewOrganizationLogo(e.target.files[0])}
                            />
                            {this.props.newOrganizationLogo && (

                                <Button icon="close" onClick={() => {
                                    this.props.setNewOrganizationLogo(null);
                                    this.logoItemRef.value = null;
                                }} basic style={{ boxShadow: 'none', marginLeft: 20 }} />
                            )}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => this.setState({ createOrganizationModalVisible: false })}>Cancel</Button>
                <Button primary onClick={this.onCreateOrganization} disabled={!this.props.newOrganizationName || !this.props.newOrganizationName.trim()}>Create</Button>
            </Modal.Actions>
        </Modal>
    )

    renderUserDropdown = () => {
        const { user, organization } = this.props;
        if (!user) return;
        return (
            <Dropdown icon={<Avatar name={user.email} size={40} round="50%" />} floating labeled direction="left">
                <Dropdown.Menu style={{ minWidth: 250 }}>
                    <Dropdown.Header style={{ textTransform: 'none', fontSize: '1rem' }}>
                        <Grid>
                            <Grid.Row style={{ alignItems: 'center' }}>
                                <Grid.Column width={4}>
                                    <Avatar name={user.email} round size="40" />
                                </Grid.Column>
                                <Grid.Column width={12}>
                                    <ShowMore text={getUserName(user)} length={18} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        {/* <p>
                            Logged in as:
                        </p>
                        <p>
                            <strong>{user.email}</strong>
                        </p> */}
                    </Dropdown.Header>
                    <Dropdown.Header>MY Organizations</Dropdown.Header>
                    {user.organizationRoles.map((role) => (
                        <Dropdown.Item
                            active={organization._id === role.organization._id}
                            key={`organization-dropdown-${role.organization._id}`}
                            onClick={() => this.onSwitchOrganization(role)}
                        >
                            {role.organization.name}
                            {organization._id !== role.organization._id && (
                                <div className="pull-right">
                                    <Icon name="arrow right" />
                                </div>
                            )}
                        </Dropdown.Item>
                    ))}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => this.setState({ createOrganizationModalVisible: true })}>
                        Create Organization
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => this.props.history.push('/logout')}  >
                        <Icon name="log out" />
                        Logout
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    renderNotificationsDropdown = () => {
        return (
            <NotificationsDropdown />
        )
    }

    renderGiveFeedback = () => {

        return (
            <GiveFeedbackModal
                buttonProps={{
                    circular: true,
                    inverted: true,
                    basic: true
                }}
            />
        )
    }

    renderHeader = () => {
        return (
            <div>
                <div className="pull-right">
                    <span style={{ display: 'inline-block', marginRight: 15 }}>
                        {/* {this.renderGiveFeedback()} */}
                        <a href={routes.organizationFAQs()} target="_blank">
                            <Button
                                circular
                                inverted
                                basic
                                style={{ position: 'relative' }}
                                help="Frequently asked questions"
                            >
                                FAQs
                                <Label circular color="green"
                                    style={{ position: 'absolute', fontSize: 8, top: -7, right: 0 }}
                                >New</Label>
                            </Button>
                        </a>
                    </span>
                    <span style={{ display: 'inline-block', marginRight: 15 }}>
                        {this.renderGiveFeedback()}
                    </span>
                    {this.renderNotificationsDropdown()}
                    {this.props.user && this.renderUserDropdown()}
                    {this.renderCreateOrganizationModal()}
                </div>
            </div>
        )
    }

    renderLogo = () => {
        const { organization } = this.props;
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '-1rem' }}>

                <Card style={{ margin: 0, borderRadius: 0 }}>
                    <Card.Content className="logo-container" style={{ margin: 0, padding: 0 }}>
                        {this.canUpload() && (
                            <React.Fragment>
                                {!organization.logo && (
                                    <div
                                        onClick={() => this.uploadLogoRef.click()}
                                        className={`upload-container visible`}
                                    >
                                        <Button size="tiny" className="upload-logo-btn">
                                            Upload Logo <Icon className="btn-icon" name="upload" />

                                        </Button>
                                    </div>
                                )}
                                {organization.logo && (
                                    <div className="edit-logo-container">
                                        <Button
                                            // color="blue"
                                            onClick={() => this.uploadLogoRef.click()}
                                            basic
                                            icon="upload"
                                        />
                                        {/* <Icon name="edit" /> */}
                                    </div>
                                )}

                                <input
                                    accept="image/*"
                                    ref={(ref) => this.uploadLogoRef = ref}
                                    type="file"
                                    style={{ visibility: 'hidden', position: 'absolute' }}
                                    onChange={(e) => this.onUploadLogo(e.target.files[0])}
                                />

                            </React.Fragment>
                        )}
                        {organization && organization.logo && (
                            <img style={{ width: '100%', maxHeight: 60 }} src={organization.logo} alt="Logo" />
                        )}
                        {organization && !organization.logo && (
                            <div className="avatar-logo-container">
                                <Avatar size="50px" name={organization.name[0]} />
                                <div style={{ marginLeft: '1rem' }}>
                                    <h4 >{organization.name}</h4>
                                    {/* <h5 style={{ margin: 0 }}><small>{showMoreText(`https://${organization.name}.videowiki.org`, 30)}</small></h5> */}
                                </div>
                            </div>
                        )}

                        <Dimmer active={this.props.uploadLogoLoading}>
                            <Loader />
                        </Dimmer>
                    </Card.Content>
                </Card>
            </div>
        )
    }

    render() {
        const { organization } = this.props;
        const navLinks = getNavLinks(this.props.user, this.props.organization);
        return (
            <div style={{ height: '100%' }}>
                <div style={{ height: '6rem', backgroundColor: '#1c232b', margin: 0, padding: 0, borderBottom: '1px solid gray' }}>
                    <Grid style={{ margin: 0 }}>
                        <Grid.Row style={{ display: 'flex', alignItems: 'center', margin: 0 }}>
                            <Grid.Column width={1}>
                                {/* <Button
                                    basic
                                    icon="more"
                                    onClick={() => this.setState({ expanded: !this.state.expanded })}
                                /> */}
                            </Grid.Column>
                            <Grid.Column width={4} style={{ display: 'flex' }}>
                                {this.renderLogo()}
                            </Grid.Column>
                            <Grid.Column width={11} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {this.renderHeader()}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                <Grid style={{ height: '100%', margin: 0, }} className="dashboard">

                    <Grid.Row style={{ padding: 0 }}>
                        <Grid.Column width={this.state.expanded ? 2 : 1} style={{ height: '100%', backgroundColor: '#1c232b', paddingRight: 0, paddingLeft: 0, paddingTop: '2rem', zIndex: 2 }}>

                            <Menu
                                fluid
                                vertical
                                tabular
                                style={{ color: 'white', border: 'none' }}
                            >
                                {navLinks.map((l) => {
                                    const content = (
                                        (
                                            <Link
                                                to={l.route}
                                                key={`navlink-item-renderer-` + l.title + l.route}
                                                style={{
                                                    color: 'white',
                                                    opacity: this.props.location.pathname.indexOf(l.route) === 0 ? 1 : 0.5,
                                                    // backgroundColor: this.props.location.pathname.indexOf(l.route) === 0 ? '#eee' : 'transparent',
                                                    // color: this.props.location.pathname.indexOf(l.route) === 0 ? 'black' : 'white',
                                                    width: '100%',
                                                    padding: 15,
                                                    textAlign: 'center',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'

                                                }}
                                                onClick={() => this.setState({ currentLocation: l.route })}
                                            >
                                                <Icon name={l.icon} size="large" />
                                                {l.title}
                                            </Link>
                                        )
                                    )
                                    return l.roles ? (

                                        <RoleRenderer
                                            roles={l.roles}
                                            key={`role-renderer-` + l.title + l.route}
                                        >
                                            {content}
                                        </RoleRenderer>
                                    ) : content
                                })}
                            </Menu>

                        </Grid.Column>
                        <Grid.Column width={this.state.expanded ? 14 : 15} stretched style={{ zIndex: 1, paddingLeft: 0, paddingRight: 0 }}>
                            {/* {this.renderHeader()} */}
                            <div
                                className="dashboard-content"
                            >
                                {this.props.children}

                                <UploadProgressBox
                                    className={'upload-progress-box'}
                                />
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <UserGuidingTutorialModal
                    showSkipOnStart
                    open={this.props.userGuidingTutorialModalOpen}
                    onClose={() => this.props.setUserGuidingTutorialModalOpen(false)}
                    showUserGuiding={this.props.user && this.props.user.showUserGuiding}
                    onChangeShowUserGuiding={(show) => {
                        this.props.updateShowUserGuiding(show)
                    }}
                />
            </div>

        )
    }
}

const mapStateToProps = ({ authentication, organization, video, router, }) => ({
    user: authentication.user,
    userToken: authentication.token,
    organization: organization.organization,
    newOrganizationName: organization.newOrganizationName,
    newOrganizationLogo: organization.newOrganizationLogo,
    uploadLogoLoading: organization.uploadLogoLoading,
    uploadState: video.uploadState,
    uploadError: video.uploadError,
    video: video.video,
    location: router.location,
    userGuidingTutorialModalOpen: organization.userGuidingTutorialModalOpen,
    userGuidingShowed: organization.userGuidingShowed,
    uploadedVideos: video.uploadedVideos,
})

const mapDispatchToProps = (dispatch) => ({
    setOrganization: org => dispatch(organizationActions.setOrganization(org)),
    setNewOrganizationName: name => dispatch(organizationActions.setNewOrganizationName(name)),
    setNewOrganizationLogo: file => dispatch(organizationActions.setNewOrganizationLogo(file)),
    fetchOrganization: (id) => dispatch(organizationActions.fetchOrganization(id)),
    createOrganization: (name, logoFile) => dispatch(organizationActions.createOrganization(name, logoFile)),
    updateOrganizationLogo: (file) => dispatch(organizationActions.updateOrganizationLogo(file)),
    startJob: (options, callFunc) => dispatch(pollerActions.startJob(options, callFunc)),
    stopJob: jobName => dispatch(pollerActions.stopJob(jobName)),
    redirectToSwitchOrganization: (token, organization, redirectTo) => dispatch(redirectToSwitchOrganization(token, organization, redirectTo)),
    fetchUserApiKey: (organizationId) => dispatch(fetchUserApiKey(organizationId)),
    setUserGuidingTutorialModalOpen: open => dispatch(organizationActions.setUserGuidingTutorialModalOpen(open)),
    updateShowUserGuiding: show => dispatch(updateShowUserGuiding(show)),
    setUserGuidingShowed: show => dispatch(organizationActions.setUserGuidingShowed(show)),
    setUploadedVideos: form => dispatch(setUploadedVideos(form)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));