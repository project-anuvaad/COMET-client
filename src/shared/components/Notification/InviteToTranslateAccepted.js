import React from 'react';
import { Link } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import ReactAvatar from 'react-avatar';
import routes from '../../routes';

export default class InviteToTranslateAccepted extends React.Component {
    render() {
        const { content, from, resource } = this.props;
        return (
            <a href={routes.translationArticle(resource)}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={2}>
                            {this.props.from && (

                                <ReactAvatar
                                    name={`${from.firstname} ${from.lastname}`}
                                    round
                                    size={40}
                                />
                            )}
                        </Grid.Column>
                        <Grid.Column width={14} className="notification-content">
                            {content}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </a>
        )
    }
}