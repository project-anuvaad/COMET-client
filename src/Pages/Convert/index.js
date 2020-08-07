import React from "react";
import { connect } from "react-redux";
import querstring from "query-string";
import { fetchUserApiKey } from "../../actions/authentication";
import routes from "../../shared/routes";
import { APP_ENV } from "../../shared/constants";
import LoadingComponent from "../../shared/components/LoaderComponent";
import { fetchVideoById } from "../../actions/video";

class Convert extends React.Component {
  state = {
    loaded: false,
    vwComp: null,
  };

  componentWillMount = () => {
    const { video } = querstring.parse(window.location.search);
    this.props.fetchVideoById(video);
    this.props.fetchUserApiKey(this.props.organization._id);
  };

  componentWillReceiveProps = (nextProps) => {
    const { video } = querstring.parse(window.location.search);
    if (
      nextProps.apiKey &&
      nextProps.apiKey.key &&
      nextProps.video &&
      nextProps.video._id === video &&
      !this.state.loaded
    ) {
      import("@videowiki/vw-proofread").then((a) => {
        this.setState({
          loaded: true,
        });
        const el = document.createElement("vw-proofread");
        el.apiRoot = APP_ENV.API_ROOT;
        el.apiKey = this.props.apiKey.key;
        el.videoId = video;
        el.websocketServerUrl = APP_ENV.WEBSOCKET_SERVER_URL;
        el.backRoute = `${routes.organizationVideos()}?activeTab=proofread`;
        el.finishRedirectRoute = this.getFinishRedirectRoute();
        document.getElementById('vw-proofread-container').appendChild(el);
      });
    }
  };

  getFinishRedirectRoute = () => {
    const { video } = this.props;
    if (video.status === "cutting") {
      return `${routes.organziationReview()}?activeTab=proofread`;
    }
    return `${routes.organziationTranslations()}?video=${video._id}`;
  };

//   renderVwProofread = () => {
//     const { video } = querstring.parse(window.location.search);
//     return (
//       <vw-proofread
//         apiKey={this.props.apiKey.key}
//         apiRoot={APP_ENV.API_ROOT}
//         videoId={video}
//         backRoute={`${routes.organizationVideos()}?activeTab=proofread`}
//         finishRedirectRoute={this.getFinishRedirectRoute()}
//         websocketServerUrl={APP_ENV.WEBSOCKET_SERVER_URL}
//       ></vw-proofread>
//     );
//   };

  render() {
    if (!this.props.apiKey) return null;

    return (
      <div id="vw-proofread-container">
        {!this.state.loaded ||
          (!this.props.video && (
            <LoadingComponent active={true}></LoadingComponent>
          ))}
        {/* {this.props.apiKey &&
          this.props.apiKey.key &&
            this.props.video &&
          this.renderVwProofread()} */}
      </div>
    );
  }
}

const mapStateToProps = ({ organization, video, authentication }) => ({
  organization: organization.organization,
  user: authentication.user,
  apiKey: authentication.apiKey,
  video: video.video,
});

const mapDispatchToProps = (dispatch) => ({
  fetchUserApiKey: (organizationId) =>
    dispatch(fetchUserApiKey(organizationId)),
  fetchVideoById: (id) => dispatch(fetchVideoById(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Convert);
