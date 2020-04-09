import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as articleActions from '../../../actions/article';
import * as pollerActions from '../../../actions/poller';
import Editor from '../../../shared/components/Editor';
import { Grid } from 'semantic-ui-react';
import routes from '../../../shared/routes';
import LoaderComponent from '../../../shared/components/LoaderComponent'
import NotificationService from '../../../shared/utils/NotificationService';

const REFRESH_ARTICLE_JOB = `REFHRESH_ARTICLE_JOB`;

class Article extends React.Component {

    componentWillMount = () => {
        this.props.fetchArticleById(this.props.match.params.articleId)
    }

    onAddHumanVoice = lang => {
        this.props.history.push({
            pathname: routes.translationArticle(this.props.article._id),
            search: `?lang=${lang}`
        })
    }

    componentWillUnmount = () => {
        this.props.stopJob(REFRESH_ARTICLE_JOB)
    }
    componentWillUpdate = (nextProps) => {
        if (this.props.article && nextProps.article) {
            if (this.props.article.refreshing && !nextProps.article.refreshing) {
                this.props.stopJob(REFRESH_ARTICLE_JOB);
                NotificationService.success('Updated successfully');
            }
        }
    }

    onUpdateArticle = () => {
        console.log('on update article')
        this.props.refreshArticleMedia(this.props.article.video, this.props.article._id);
        this.props.stopJob(REFRESH_ARTICLE_JOB)
        this.props.startJob({ jobName: REFRESH_ARTICLE_JOB, interval: 5000 }, () => {
            this.props.fetchArticleById(this.props.match.params.articleId)
        })
    }

    render() {
        return (
            <Grid style={{ width: '100%' }}>
                <LoaderComponent active={this.props.loading || (this.props.article && this.props.article.refreshing)}>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            {this.props.article && (
                                <Editor
                                    headerOptions={{
                                        showUpdateArticle: true,
                                    }}
                                    article={this.props.article}
                                    layout={1}
                                    onUpdateArticle={this.onUpdateArticle}
                                    onAddHumanVoice={this.onAddHumanVoice}
                                />
                            )}
                        </Grid.Column>
                    </Grid.Row>
                </LoaderComponent>
            </Grid>
        )
    }
}

const mapStateToProps = ({ article }) => ({
    article: article.article,
    loading: article.loading,
})

const mapDispatchToProps = (dispatch) => ({
    fetchArticleById: id => dispatch(articleActions.fetchArticleById(id)),
    refreshArticleMedia: (videoId, articleId) =>  dispatch(articleActions.refreshArticleMedia(videoId, articleId)),
    startJob: (params, func) => dispatch(pollerActions.startJob(params, func)),
    stopJob: (jobName) => dispatch(pollerActions.stopJob(jobName)),

})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Article));