import React from 'react';
import { connect } from 'react-redux';
import querstring from 'query-string';
import { fetchUserApiKey } from '../../actions/authentication';
import routes from '../../shared/routes';
import { APP_ENV } from '../../shared/constants';
import LoadingComponent from '../../shared/components/LoaderComponent';

class Convert extends React.Component {
    state = {
        loaded: false,
    }

    componentWillMount = () => {
        this.props.fetchUserApiKey(this.props.organization._id)
    }

    componentDidMount = () => {
        const vwProofreadScript = document.getElementById('vw-proofread-script');
        if (vwProofreadScript) {
            this.setState({ loaded: true });
        } else {
            const script = document.createElement("script");
            script.id = 'vw-proofread-script'
            script.src = "https://videowiki-microapps.s3-eu-west-1.amazonaws.com/vw-proofread/v2.0.8.js";
            script.async = true;
            script.onload = () => this.setState({ loaded: true });
            document.body.appendChild(script);
        }
    }
    render() {
        if (!this.props.apiKey) return null;
        const { video } = querstring.parse(window.location.search);
        return (
            <div>
                {!this.state.loaded && (
                    <LoadingComponent active={true}></LoadingComponent>
                )}
                {this.props.apiKey && this.props.apiKey.key && (
                    <vw-proofread
                        apiKey={this.props.apiKey.key}
                        apiRoot={APP_ENV.API_ROOT}
                        videoId={video}
                        backRoute={`${routes.organizationVideos()}?activeTab=proofread`}
                        finishRedirectRoute={`${routes.organziationReview()}?activeTab=proofread`}
                        websocketServerUrl={APP_ENV.WEBSOCKET_SERVER_URL}
                    ></vw-proofread>
                )}
            </div>
        )
    }
}

const mapStateToProps = ({ organization, authentication }) => ({
    organization: organization.organization,
    user: authentication.user,
    apiKey: authentication.apiKey,
})

const mapDispatchToProps = (dispatch) => ({
    fetchUserApiKey: (organizationId) => dispatch(fetchUserApiKey(organizationId))
})

export default connect(mapStateToProps, mapDispatchToProps)(Convert)