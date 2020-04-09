import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../modules/actions';
import { Grid, Pagination, Input } from 'semantic-ui-react';
import TasksTabs from '../TasksTabs';
import { debounce } from '../../../../shared/utils/helpers';
import VideoCard from '../../../../shared/components/VideoCard';
import Tabs from '../../../../shared/components/Tabs';
import Proofread from './TabsContent/Proofread';
import Completed from './TabsContent/Completed';
import LoadingComponent from '../../../../shared/components/LoaderComponent';
import ClearPagination from '../../../../shared/components/ClearPagination';

const TAB_VIDEO_STATUS = {
    0: ['proofreading', 'converting'],
    1: ['done'],
}

class Reviews extends React.Component {
    state = {
        activeTab: 0,
    }
    componentWillMount = () => {
        this.props.setSearchFilter('');
        this.props.setCurrentPageNumber(1);
        this.props.fetchUserReviews();
        this.props.setVideoStatusFilter(TAB_VIDEO_STATUS[0]);

        this.debouncedSearch = debounce(() => {
            this.props.setCurrentPageNumber(1);
            this.props.fetchUserReviews();
        }, 500)
    }

    onRereviewVideo = video => {
        this.props.rereviewVideo(video);
    }

    onSearchChange = (searchFilter) => {
        this.props.setSearchFilter(searchFilter);
        this.debouncedSearch()
    }

    onPageChange = (e, { activePage }) => {
        this.props.setCurrentPageNumber(activePage);
        this.props.fetchUserReviews();
    }

    onTabChange = index => {
        this.setState({ activeTab: index });
        this.props.setSearchFilter('');
        this.props.setCurrentPageNumber(1);
        this.props.setVideoStatusFilter(TAB_VIDEO_STATUS[index]);
        this.props.fetchUserReviews();
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

    _renderTabContent = () => {
        const tabProps = { videos: this.props.videos };
        switch (this.state.activeTab) {
            case 0:
                return <Proofread {...tabProps} />
            case 1:
                return <Completed {...tabProps} onRereviewVideo={this.onRereviewVideo} />
            default:
                return <Proofread {...tabProps} />
        }
    }

    render() {
        return (
            <Grid style={{ padding: '2rem' }}>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <div
                            style={{ display: 'flex', justifyContent: 'center' }}
                        >
                            <Tabs
                                items={[{ title: 'Proofread' }, { title: 'Completed' }]}
                                onActiveIndexChange={(index) => this.onTabChange(index)}
                                activeIndex={this.state.activeTab}
                            />
                        </div>
                    </Grid.Column>
                </Grid.Row>
                {this.renderPagination()}
                <LoadingComponent active={this.props.loading}>
                    {this._renderTabContent()}
                </LoadingComponent>
            </Grid>
        )
    }
}


const mapStateToProps = ({ organization, organizationTasks }) => ({
    organization: organization.organization,
    currentPageNumber: organizationTasks.currentPageNumber,
    videos: organizationTasks.videos,
    totalPagesCount: organizationTasks.totalPagesCount,
})

const mapDispatchToProps = (dispatch) => ({
    setCurrentPageNumber: pageNumber => dispatch(actions.setCurrentPageNumber(pageNumber)),
    setSearchFilter: filter => dispatch(actions.setSearchFilter(filter)),
    fetchUserReviews: () => dispatch(actions.fetchUserReviews()),
    setVideoStatusFilter: statuses => dispatch(actions.setVideoStatusFilter(statuses)),
    rereviewVideo: video => dispatch(actions.rereviewVideo(video)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Reviews);