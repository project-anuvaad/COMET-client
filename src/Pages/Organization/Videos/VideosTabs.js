import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Tabs from '../../../shared/components/Tabs';
import routes from '../../../shared/routes';
import { canUserAccess, getUserOrganziationRole } from '../../../shared/utils/helpers';
import { Button } from 'semantic-ui-react';
import UploadNewVideoModal from '../../../shared/components/UploadNewVideoModal';
import NotificationService from '../../../shared/utils/NotificationService';

import * as videoActions from './modules/actions';
import AnimatedButton from '../../../shared/components/AnimatedButton';
const items = [{ title: 'Transcribe' }, { title: 'Voiceover Translations' }];

class VideosTabs extends React.Component {
    state = {
        currentTitle: '',
        tabItems: [],
        uploadFormOpen: false,
        animating: false,
    }

    componentDidMount = () => {
        const { user, organization } = this.props;
        const { pathname } = this.props.location;
        let tabItems = [];
        const organizationRole = getUserOrganziationRole(user, organization);
        if (!organizationRole) return this.redirectUnauthorizedUser();

        if (organizationRole.organizationOwner || (organizationRole.permissions && organizationRole.permissions.indexOf('admin') !== -1)) {
            tabItems = [...items];
        } else {
            if (organizationRole.permissions.indexOf('review') !== -1) {
                tabItems.push({ title: 'Transcribe' })
            }

            if (organizationRole.permissions.indexOf('translate') !== -1) {
                tabItems.push({ title: 'Voiceover Translations' })
            }
        }
        this.setState({ tabItems });
        if (pathname.indexOf(routes.organziationTranslations()) !== -1) {
            this.setState({ currentTitle: 'Voiceover Translations', tabItems });
        } else if (pathname.indexOf(routes.organziationReview()) !== -1) {
            this.setState({ currentTitle: 'Transcribe' });
        } else {
            this.setState({ currentTitle: 'Transcribe' });
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.uploadState === 'loading' && nextProps.uploadState === 'done') {
            NotificationService.success('Uploaded successfully');
            this.setState({ uploadFormOpen: false });
            this.props.fetchVideos();
            this.props.fetchVideosCount();
            // this.props.history.push(`/convert/${nextProps.video._id}`);
        }
        if (this.props.uploadState === 'loading' && nextProps.uploadState === 'failed') {
            NotificationService.error(nextProps.uploadError);
            this.setState({ uploadFormOpen: false });
        }
        if (nextProps.videosCounts) {
            if (nextProps.videosCounts.total === 0 && !this.state.animating) {
                    this.setState({ animating: true });
            } else if (this.state.animating && nextProps.videosCounts.total !== 0) {
                this.setState({ animating: false })
            }
        }
    }

    componentWillUnmount = () => {
        if (this.animateInterval) {
            clearInterval(this.animateInterval);
            this.animateInterval = null;
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

    onActiveIndexChange = (val) => {
        const currentTitle = this.state.tabItems[val].title;
        this.setState({ currentTitle });
        switch (currentTitle.toLowerCase()) {
            case 'transcribe':
                return this.props.history.push(routes.organziationReview());
            case 'voiceover translations':
                this.props.history.push(routes.organziationTranslations());
                return;
            default:
                break;
        }
    }

    render() {
        return (
            <div
                style={{
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    backgroundColor: '#12181f',
                    padding: '3rem',
                    paddingBottom: this.props.extraContent ? 0 : '3rem',
                    paddingTop: '4rem',
                    marginLeft: '-1rem',
                    marginRight: '-1rem',
                }}
            >
                <div
                    style={{
                        marginBottom: this.props.extraContent ? '2rem' : 0,
                    }}
                >

                    {this.state.tabItems.map((item, index) => (
                        <span
                            key={`tabs-item-${item.title}`}
                            onClick={() => this.onActiveIndexChange(index)}
                            style={{
                                display: 'inline-block',
                                cursor: 'pointer',
                                marginRight: '2rem',
                                opacity: this.state.currentTitle === item.title ? 1 : 0.5,

                            }}
                        >
                            {item.title}
                        </span>
                    ))}
                    {this.canUpload() && (
                        <React.Fragment>
                            <AnimatedButton
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    marginRight: '2rem',
                                    marginTop: '-1rem',
                                }}
                                animating={this.state.animating}
                                animation="moema"
                                animationInterval={4000}
                                primary
                                circular
                                size="large"
                                icon="upload"
                                content="Upload"
                                onClick={() => this.setState({ uploadFormOpen: true })}
                            />
                            <UploadNewVideoModal
                                open={this.state.uploadFormOpen}
                                onClose={() => this.setState({ uploadFormOpen: false })}
                            />
                        </React.Fragment>
                    )}
                </div>
                {this.props.extraContent || null}
            </div>
        )
    }
}

const mapStateToProps = ({ authentication, organizationVideos, organization, video }) => ({
    user: authentication.user,
    organization: organization.organization,
    uploadState: video.uploadState,
    videosCounts: organizationVideos.videosCounts,

})

const mapDispatchToProps = (dispatch) => ({
    fetchVideos: (params) => dispatch(videoActions.fetchVideos(params)),
    fetchVideosCount: (params) => dispatch(videoActions.fetchVideosCount(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(VideosTabs));
