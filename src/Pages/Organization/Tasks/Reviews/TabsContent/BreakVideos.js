import React from 'react';
import { withRouter } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import VideoCard from '../../../../../shared/components/VideoCard';
import routes from '../../../../../shared/routes';

class BreakVideos extends React.Component {

    navigateToConvertProgresss = videoId => {
        window.location.href = routes.convertProgressV2(videoId);
    }

    render() {
        return (
            <Grid.Row>
                {this.props.videos && this.props.videos.length === 0 ? (
                    <div style={{ margin: 50 }}>No videos requires proofreading</div>
                ) : this.props.videos && this.props.videos.map((video) => {
                    return (
                        <Grid.Column key={video._id} width={4}>
                            <VideoCard
                                url={video.url}
                                subTitle={video.organization && video.organization.name ? `Orgnization: ${video.organization.name}` : ''}
                                thumbnailUrl={video.thumbnailUrl}
                                title={video.title}
                                buttonTitle="Break video"
                                loading={video.status === 'converting'}
                                disabled={video.status === 'converting'}
                                onButtonClick={() => this.navigateToConvertProgresss(video._id)}
                            />
                        </Grid.Column>
                    )
                })}
            </Grid.Row>
        )
    }
}

export default withRouter(BreakVideos);