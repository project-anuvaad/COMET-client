import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, Label } from 'semantic-ui-react';
import moment from 'moment';
import ReactAvatar from 'react-avatar';
import routes from '../../routes';

export default class InviteToTranslate extends React.Component {

    renderStatus = (status) => {
        if (status === 'accepted') {
            return <Label color="green" className="pull-right" size="tiny">Accepted</Label>
        }
        return <Label color="red" className="pull-right" size="tiny">Declined</Label>
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
                to={routes.translationArticle(resource)}
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
                                to={routes.translationArticle(resource)}
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
                            {status && status !== 'pending' && this.renderStatus(status)}
                            {hasStatus && status === 'pending' && (

                                <div
                                    style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 10 }}
                                >
                                    <Button
                                        basic
                                        primary
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            onActionClick('accepted');
                                        }}
                                        style={{ fontSize: '0.8rem' }}
                                    >
                                        Accept
                                </Button>

                                    <Button
                                        basic
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            onActionClick('declined');
                                        }}
                                        style={{ fontSize: '0.8rem' }}
                                        color="red"
                                    >
                                        Decline
                                </Button>
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