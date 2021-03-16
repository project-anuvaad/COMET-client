import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { fetchUserApiKey } from "../../../actions/authentication";
import * as articleActions from "../../../actions/article";
import { APP_ENV } from "../../../shared/constants";
import LoadingComponent from "../../../shared/components/LoaderComponent";
import routes from "../../../shared/routes";
class TranslateArticle extends React.Component {
  state = {
    loaded: false,
  };
  componentWillMount = () => {
    this.props.fetchUserApiKey(this.props.organization._id);
    const { articleId } = this.props.match.params;
    this.props.fetchArticleById(articleId);
  };
  componentWillReceiveProps = (nextProps) => {
    const { articleId } = this.props.match.params;
    if (
      nextProps.apiKey &&
      nextProps.apiKey.key &&
      nextProps.article &&
      nextProps.article._id === articleId &&
      !this.state.loaded
    ) {
      this.setState(
        {
          loaded: true,
        },
        () => {
          import("@comet-anuvaad/video-translate").then((a) => {
            const el = document.createElement("vd-translate");
            el.apiRoot = APP_ENV.API_ROOT;
            el.apiKey = this.props.apiKey.key;
            el.articleId = articleId;
            el.websocketServerUrl = APP_ENV.WEBSOCKET_SERVER_URL;
            el.backRoute = routes.organziationTranslationMetrics(
              this.props.article.video
            );
            document.getElementById("vd-translate-container").appendChild(el);
          });
        }
      );
    }
  };

  render() {
    return (
      <div
        id="vd-translate-container"
        style={{ minHeight: "100%", height: "100%" }}
      >
        {!this.state.loaded && (
          <LoadingComponent active={true}></LoadingComponent>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ organization, authentication, article }) => ({
  organization: organization.organization,
  user: authentication.user,
  apiKey: authentication.apiKey,
  article: article.article,
});

const mapDispatchToProps = (dispatch) => ({
  fetchUserApiKey: (organizationId) =>
    dispatch(fetchUserApiKey(organizationId)),
  fetchArticleById: (id) => dispatch(articleActions.fetchArticleById(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TranslateArticle));
