import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, Label } from 'semantic-ui-react';
import querystring from 'querystring';
import moment from 'moment';
import ReactAvatar from 'react-avatar';
import routes from '../../routes';

export default class AddedCommentToTranslation extends React.Component {

    getLinkTo = () => {
        const { resource, data } = this.props;
        let to = routes.translationArticle(resource);
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
            to += `?${querystring.encode(data)}`;
        }
        return to;
    }

    render() {
        const {
            content,
            from,
            status,
            resource,
            created_at,
            extraContent,
            hasStatus,
            onActionClick
        } = this.props;
        return (
            <Link
                style={{ color: 'black' }}
                to={this.getLinkTo()}
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
                            <Link
                                to={this.getLinkTo()}
                            >

                                <div>
                                    {content}
                                </div>
                            </Link>

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