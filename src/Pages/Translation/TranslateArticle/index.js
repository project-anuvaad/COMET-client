import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchUserApiKey } from '../../../actions/authentication';
import * as articleActions from '../../../actions/article'
import { APP_ENV } from '../../../shared/constants';
import LoadingComponent from '../../../shared/components/LoaderComponent';
import routes from '../../../shared/routes';

class TranslateArticle extends React.Component {

    state = {
        loaded: false,
    }
    componentWillMount = () => {
        this.props.fetchUserApiKey(this.props.organization._id)
    }

    componentDidMount = () => {
        const vwTranslateScript = document.getElementById('vw-translate-script');
        if (vwTranslateScript) {
            this.setState({ loaded: true });
        } else {
            const script = document.createElement("script");
            script.id = 'vw-translate-script'
            script.src = "https://videowiki-microapps.s3-eu-west-1.amazonaws.com/vw-translate/v2.0.0.js";
            script.async = true;
            script.onload = () => this.setState({ loaded: true });
            document.body.appendChild(script);
        }

        const { articleId } = this.props.match.params;
        this.props.fetchArticleById(articleId);
    }

    render() {
        const { articleId } = this.props.match.params;
        return (
            <div>
                {!this.state.loaded && (
                    <LoadingComponent active={true}></LoadingComponent>
                )}
                {this.state.loaded && this.props.apiKey && this.props.apiKey.key && (
                    <vw-translate
                        articleId={articleId}
                        apiKey={this.props.apiKey.key}
                        apiRoot={APP_ENV.API_ROOT}
                        backRoute={this.props.article ? routes.organziationTranslationMetrics(this.props.article.video) : ''}
                    ></vw-translate>
                )}
            </div>
        )
    }
}

const mapStateToProps = ({ organization, authentication, article }) => ({
    organization: organization.organization,
    user: authentication.user,
    apiKey: authentication.apiKey,
    article: article.article,
})

const mapDispatchToProps = (dispatch) => ({
    fetchUserApiKey: (organizationId) => dispatch(fetchUserApiKey(organizationId)),
    fetchArticleById: (id) => dispatch(articleActions.fetchArticleById(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TranslateArticle))