import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../modules/actions';
import { Grid, Pagination, Input } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import LoadingComponent from '../../../../shared/components/LoaderComponent';
import { isoLangs } from '../../../../shared/constants/langs';
import routes from '../../../../shared/routes';
import ArticleSummaryCard from '../../../../shared/components/ArticleSummaryCard';
import { debounce } from '../../../../shared/utils/helpers';
import ClearPagination from '../../../../shared/components/ClearPagination';

class Translations extends React.Component {
    componentWillMount = () => {
        this.props.setSearchFilter('');
        this.props.setCurrentPageNumber(1);
        this.props.fetchUserTasks();
        this.debouncedSearch = debounce(() => {
            this.props.setCurrentPageNumber(1);
            this.props.fetchUserTasks();
        }, 500)
    }

    onSearchChange = (searchFilter) => {
        this.props.setSearchFilter(searchFilter);
        this.debouncedSearch()
    }

    onPageChange = (e, { activePage }) => {
        this.props.setCurrentPageNumber(activePage);
        this.props.fetchUserTasks();
    }

    renderPagination = () => (
        <Grid.Row>
            <Grid.Column width={5}>

                <Input
                    fluid

                    input={<input
                        type="text"
                        style={{ borderRadius: 20, color: '#999999', backgroundColor: '#d4e0ed' }}
                    />}
                    // style={{ height: '100%' }}
                    type="text"
                    icon="search"
                    placeholder="Search"
                    value={this.props.searchFilter}
                    onChange={(e, { value }) => this.onSearchChange(value)}
                />
            </Grid.Column>
            <Grid.Column width={11}>
                <div className="pull-right" style={{ marginLeft: '2rem' }}>
                    <ClearPagination
                        activePage={this.props.currentPageNumber}
                        onPageChange={this.onPageChange}
                        totalPages={this.props.totalPagesCount}
                    />
                </div>
            </Grid.Column>
        </Grid.Row>
    )

    render() {
        return (
            <Grid style={{ padding: '2rem' }}>
                {this.renderPagination()}
                <LoadingComponent active={this.props.loading}>
                    {this.props.articles.length === 0 ? (
                        <Grid.Row style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', height: 400 }}>
                            <Grid.Column width={6}>You're not assigned to any translations yet.</Grid.Column>
                        </Grid.Row>
                    ) : (
                            <Grid.Row>
                                {this.props.articles.map(article => (
                                    <Grid.Column width={5} key={`my-tasks-translated-article-article-${article._id}`} style={{ marginBottom: 20 }}>
                                        <ArticleSummaryCard
                                            title={`${article.title} (${isoLangs[article.langCode] ? isoLangs[article.langCode].name : article.langCode})`}
                                            videoUrl={article.video.url}
                                            thumbnailUrl={article.video.thumbnailUrl}
                                            article={article}
                                            onTitleClick={() => this.props.history.push(routes.translationArticle(article.originalArticle) + `?lang=${article.langCode}`)}
                                        />
                                    </Grid.Column>
                                ))}
                            </Grid.Row>
                        )}
                </LoadingComponent>
            </Grid>
        )
    }
}


const mapStateToProps = ({ organization, organizationTasks }) => ({
    organization: organization.organization,
    currentPageNumber: organizationTasks.currentPageNumber,
    articles: organizationTasks.articles,
    loading: organizationTasks.loading,
    totalPagesCount: organizationTasks.totalPagesCount,
})

const mapDispatchToProps = (dispatch) => ({
    setSearchFilter: filter => dispatch(actions.setSearchFilter(filter)),
    setCurrentPageNumber: pageNumber => dispatch(actions.setCurrentPageNumber(pageNumber)),
    fetchUserTasks: (orgId, page) => dispatch(actions.fetchUserTasks(orgId, page)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Translations));