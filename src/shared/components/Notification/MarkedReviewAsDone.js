import React from 'react';
import { Link } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import moment from 'moment';
import ReactAvatar from 'react-avatar';
import routes from '../../routes';

export default class MarkedReviewAsDone extends React.Component {
    render() {
        const { content, from, resource, created_at, extraContent } = this.props;
        return (
            <Link 
                to={routes.convertProgressV2(resource)}
                style={{ color: 'black' }}    
            >
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            {this.props.from && (

                                <ReactAvatar
                                    name={`${from.firstname} ${from.lastname}`}
                                    round
                                    size={50}
                                />
                            )}
                        </Grid.Column>
                        <Grid.Column width={13} className="notification-content">
                            <div>
                                {content}
                            </div>
                            {extraContent && (
                                <div>
                                    <small>
                                        {extraContent}
                                    </small>
                                </div>
                            )}
                            <div>
                                <small>
                                    {moment(created_at).fromNow()}
                                </small>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Link>
        )
    }
}