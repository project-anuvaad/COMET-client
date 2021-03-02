import React from 'react';
import LandingPage from '../../../layouts/LandingPage';
import { Grid, Input, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import './style.scss';
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

import { subscribeToApiDocs } from '../../../actions/authentication';



class Api extends React.Component {
    state = {
        email: '',
    }

    render() {
        return (
            <LandingPage>
                <div className="api">
                    <Grid>
                        {/* <Grid.Row>
                            <Grid.Column width={8}>
                                <Grid className="api-container">
                                    <Grid.Row>
                                        <Grid.Column width={16}>
                                            <h2>
                                                API coming soon!
                                            </h2>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column width={16}>
                                            <p>
                                                Integrate COMET’s video localization platform directly onto your website
                                            </p>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column width={16}>
                                            <Input
                                                className="register-input"
                                                type="email"
                                                placeholder="Enter your email address"
                                                fluid
                                                onChange={(e) => this.setState({ email: e.target.value })}
                                                action={(
                                                    <Button
                                                        onClick={() => this.props.subscribeToApiDocs(this.state.email)}
                                                        loading={this.props.subscribeToApiDocsLoading}
                                                        disabled={this.props.subscribeToApiDocsLoading}
                                                        className="register-action"
                                                    >
                                                        Register Now
                                                    </Button>
                                                )}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <img src="/img/Under construction illustration.svg" className="construction-img" />
                            </Grid.Column>
                        </Grid.Row> */}
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <SwaggerUI url="docs/swagger.yaml" />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </LandingPage>
        )
    }
}

const mapStateToProps = ({ authentication }) => ({
    subscribeToApiDocsLoading: authentication.subscribeToApiDocsLoading,
})

const mapDispatchToProps = (dispatch) => ({
    subscribeToApiDocs: (email) => dispatch(subscribeToApiDocs(email)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Api);