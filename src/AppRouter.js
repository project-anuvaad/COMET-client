import React from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom'
import './App.css';
import { populateAppEnv, APP_ENV } from './shared/constants'
import routes from './shared/routes';

import Header from './shared/components/Header';
import Footer from './shared/components/Footer';
import LoaderComponent from './shared/components/LoaderComponent';

import LazyRoute from './LazyRoute';
import DashboardLayout from './layouts/Dashboard';
import * as authenticationActions from './actions/authentication';
import websockets from './websockets';
import * as Sentry from '@sentry/browser';

const Home = () => import('./Pages/LandingPage/Home');
const FAQ = () => import('./Pages/LandingPage/FAQ');
const Api = () => import('./Pages/LandingPage/Api');

const LoginRedirect = () => import('./Pages/LoginRedirect');
const ResetPassword = () => import('./Pages/ResetPassword');
const Demo = () => import('./Pages/Demo');
const Convert = () => import('./Pages/Convert');
const Logout = () => import('./Pages/Logout');
const AnnotatePage = () => import('./Pages/AnnotatePage');

const Article = () => import('./Pages/Organization/Article');

const OrganizationUsers = () => import('./Pages/Organization/OrganizationUsers');
const OrganizationArchive = () => import('./Pages/Organization/Archive');
const OrganizationFAQs = () => import('./Pages/Organization/FAQs');
// const OrganizationVideos = () => import('./Pages/Organization/Videos');
const OrganizationReview = () => import('./Pages/Organization/Videos/Review');
const OrganzationTranslations = () => import('./Pages/Organization/Videos/Translations');
const OrganizationTranslationMetrics = () => import('./Pages/Organization/Videos/TranslationMetrics');
const OrganizationImageAnnotation = () => import('./Pages/Organization/Images/Annotation');
const OrganizationImageTranslation = () => import('./Pages/Organization/Images/Translations');
const OrganizationTips = () => import('./Pages/Organization/Tips');
const OrganzaitionTasksTranslations = () => import('./Pages/Organization/Tasks/Translations');
const OrganzaitionTasksReviews = () => import('./Pages/Organization/Tasks/Reviews');

const OrganizationNoiseCancellation = () => import('./Pages/Organization/NoiseCancellation');
const OrganizationAPIKeys = () => import('./Pages/Organization/APIKeys');

const TranslateArticle = () => import('./Pages/Translation/TranslateArticle');

const Invitations = () => import('./Pages/Invitations');
const TranslationInvitation = () => import('./Pages/Invitations/TranslationInvitation');
const TextTranslationInvitation = () => import('./Pages/Invitations/TextTranslationInvitation');

class AppRouter extends React.Component {
  state = {
    envLoaded: false,
  }

  componentDidMount = () => {
    populateAppEnv()
      .then((data) => {
        websockets.createWebsocketConnection(APP_ENV.WEBSOCKET_SERVER_URL, {
            path: '/socket.io',
            transports: ['websocket'],
            secure: true,
        })
        if (process.env.NODE_ENV === 'production' && APP_ENV.SENTRY_DSN) {
          Sentry.init({ dsn: APP_ENV.SENTRY_DSN });
        }
        setTimeout(() => {
          this.setState({ envLoaded: true })
        }, 100);
        console.log('got env data', data)
        if (this.props.isAuthenticated) {
          this.props.getUserDetails();
        }
      })
      .catch(err => {
        console.log('error loading env file', err);
        alert('Misconfiguration error: Please contact Videowiki\'s support team, error ' + JSON.stringify(err))
      })
  }

  render() {
    if (!this.state.envLoaded) return null;
    return (
      <LoaderComponent active={!this.state.envLoaded}>
        <div className="c-app">
          <Header />
          <div className="c-app__main">
            <Switch>
              <LazyRoute
                exact
                path={routes.home()}
                title="VideoWiki"
                loader={Home}
              />
              <LazyRoute
                exact
                path={routes.api()}
                title="VideoWiki: Api"
                loader={Api}
              />

              <LazyRoute
                exact
                path={routes.faq()}
                title="VideoWiki: FAQ"
                loader={FAQ}
              />
              <LazyRoute
                exact
                path={routes.resetPassword()}
                title="VideoWiki: Reset Password"
                loader={ResetPassword}
              />
              <LazyRoute
                exact
                path={routes.loginRedirect()}
                title="VideoWiki"
                loader={LoginRedirect}
              />
              <LazyRoute
                exact
                path={routes.logout()}
                loader={Logout}
              />
              <LazyRoute
                exact
                path={routes.convertProgressV2()}
                title="Convert Video"
                loader={Convert}
              />

              <LazyRoute
                exact
                path={routes.annotateImage()}
                title="Annotate Image"
                loader={AnnotatePage}
              />
              {/* <LazyRoute exact path={routes.demo()} title="Demo" loader={Demo} /> */}
              <LazyRoute
                exact
                path={routes.convertProgress()}
                title="Convert Video"
                loader={Convert}
              />
              {/* === Organization routes === */}

              <LazyRoute
                exact
                path={routes.noiseCancellation()}
                title="Organziation: Noise Cancellation"
                isPrivateRoute={true}
                loader={OrganizationNoiseCancellation}
                layout={DashboardLayout}
              />
              <LazyRoute
                exact
                path={routes.organizationFAQs()}
                title="Organziation: FAQs"
                isPrivateRoute={true}
                loader={OrganizationFAQs}
                layout={DashboardLayout}
              />

              <LazyRoute
                exact
                path={routes.organizationAPIKeys()}
                title="Organziation: API Keys"
                isPrivateRoute={true}
                loader={OrganizationAPIKeys}
                layout={DashboardLayout}
              />

              <LazyRoute
                exact
                path={routes.organizationTips()}
                title="Organziation: Tips and Tutorials"
                isPrivateRoute={true}
                loader={OrganizationTips}
                layout={DashboardLayout}
              />

              <LazyRoute
                exact
                path={routes.organizationUsers()}
                title="Organziation: Users"
                isPrivateRoute={true}
                authorize={[
                  'admin',
                  'project_leader',
                ]}
                loader={OrganizationUsers}
                layout={DashboardLayout}
              />
              <LazyRoute
                exact
                path={routes.organizationVideos()}
                isPrivateRoute={true}
                title="Organziation: Videos"
                authorize={[
                  'admin',
                  'project_leader',
                  'uploader',
                  'review',
                  'break_videos',
                  'transcribe_text',
                  'approve_transcriptions',
                ]}
                loader={OrganizationReview}
                layout={DashboardLayout}
              />
              <LazyRoute
                exact
                path={routes.organizationHome()}
                isPrivateRoute={true}
                authorize={[
                  'admin',
                  'project_leader',
                  'uploader',
                  'review',
                  'break_videos',
                  'transcribe_text',
                  'approve_transcriptions',
                ]}
                title="Organziation: Videos"
                loader={OrganizationReview}
                layout={DashboardLayout}
              />
              <LazyRoute
                exact
                path={routes.organziationTasksTranslations()}
                isPrivateRoute={true}
                authorize={[
                  'admin',
                  'project_leader',
                  'translate',
                  'voice_over_artist',
                  'translate_text',
                  'approve_translations',
                ]}
                title="Organziation: My Translations"
                loader={OrganzaitionTasksTranslations}
                layout={DashboardLayout}
              />

              <LazyRoute
                exact
                path={routes.organziationTasksReview()}
                isPrivateRoute={true}
                authorize={[
                  'admin',
                  'project_leader',
                  'review',
                  'break_videos',
                  'transcribe_text',
                  'approve_transcriptions',
                ]}
                title="Organziation: My Reviews"
                loader={OrganzaitionTasksReviews}
                layout={DashboardLayout}
              />
              <LazyRoute
                exact
                path={routes.organizationArchive()}
                isPrivateRoute={true}
                authorize={[
                  'admin',
                  'project_leader',
                ]}
                title="Organziation: Archive"
                loader={OrganizationArchive}
                layout={DashboardLayout}
              />
              <LazyRoute
                exact
                path={routes.organizationArticle()}
                isPrivateRoute={true}
                title="Organziation: Article"
                loader={Article}
                layout={DashboardLayout}
              />
              <LazyRoute
                exact
                path={routes.organziationReview()}
                isPrivateRoute={true}
                title="Organziation: Reviews"
                authorize={[
                  'admin',
                  'project_leader',
                  'uploader',
                  'review',
                  'break_videos',
                  'transcribe_text',
                  'approve_transcriptions',
                ]}
                loader={OrganizationReview}
                layout={DashboardLayout}
              />
              <LazyRoute
                exact
                path={routes.organziationTranslations()}
                isPrivateRoute={true}
                title="Organziation: Translations"
                authorize={[
                  'admin',
                  'project_leader',
                  'translate',
                  'voice_over_artist',
                  'translate_text',
                  'approve_translations',
                ]}
                loader={OrganzationTranslations}
                layout={DashboardLayout}
              />
              <LazyRoute
                exact
                path={routes.organziationTranslationMetrics()}
                isPrivateRoute={true}
                title="Organziation: Translations"
                authorize={[
                  'admin',
                  'project_leader',
                  'translate',
                  'voice_over_artist',
                  'translate_text',
                  'approve_translations'
                ]}
                loader={OrganizationTranslationMetrics}
                layout={DashboardLayout}
              />

              <LazyRoute
                exact
                path={routes.organizationImages()}
                isPrivateRoute={true}
                title="Organziation: Images"
                authorize={[]}
                loader={OrganizationImageAnnotation}
                layout={DashboardLayout}
              />

              <LazyRoute
                exact
                path={routes.organizationImageAnnotation()}
                isPrivateRoute={true}
                title="Organziation: Annotate"
                authorize={[]}
                loader={OrganizationImageAnnotation}
                layout={DashboardLayout}
              />

              <LazyRoute
                exact
                path={routes.organizationImageTranslation()}
                isPrivateRoute={true}
                title="Organziation: Translations"
                authorize={[]}
                loader={OrganizationImageTranslation}
                layout={DashboardLayout}
              />
              {/* ==== End Organization routes === */}

              {/* === Translation routes === */}

              <LazyRoute
                path={routes.translationArticle()}
                title="Translate Article"
                isPrivateRoute={true}
                loader={TranslateArticle}
                layout={DashboardLayout}
              />
              {/* === End Translation routes === */}

              {/* Invitations routes */}

              <LazyRoute
                path={routes.translationInvitation()}
                title="Invitation To Translate"
                loader={TranslationInvitation}
              />

              <LazyRoute
                path={routes.textTranslationInvitation()}
                title="Invitation To Translate Text"
                loader={TextTranslationInvitation}
              />
              <LazyRoute
                path={routes.invitationsRoute()}
                title="Invitation"
                loader={Invitations}
              />
              {/* End invitations routes  */}
            </Switch>
          </div>
          <Footer />
        </div>
      </LoaderComponent>
    )
  }
}

const mapStateToProps = ({ authentication }) => ({
  user: authentication.user,
  isAuthenticated: authentication.isAuthenticated,
})

const mapDispatchToProps = dispatch => ({
  getUserDetails: () => dispatch(authenticationActions.getUserDetails()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);

// AppRouter.propTypes = {
//   match: PropTypes.object,
// }
