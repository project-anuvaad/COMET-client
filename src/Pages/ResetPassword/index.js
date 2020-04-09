import React from 'react';
import querysting from 'query-string';
import { connect } from 'react-redux';
import LoaderComponent from '../../shared/components/LoaderComponent';
import { resetPassword, setpassword, setPasswordConfirm } from '../../actions/authentication';
import { Grid, Form } from 'semantic-ui-react';

class ResetPassword extends React.Component {

    state = {
        password: '',
        passwordConfirm: '',
    }

    onSubmit = () => {

        const { rc, email } = querysting.parse(window.location.search);
        this.props.resetPassword(email, rc, this.state.password, this.state.passwordConfirm);

    }

    render() {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', backgroundColor: '#eee' }}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={2} />
                        <Grid.Column width={10}>
                            <div>
                                <img src="/img/logo.png" style={{ width: '100%', position: 'relative', top: -50 }} alt="Video Wiki Logo" />
                            </div>

                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={5} />
                        <Grid.Column width={6}>
                            <Form onSubmit={(e) => e.preventDefault()}>
                                <p>Reset your password</p>
                                <Form.Input
                                    fluid
                                    type="password"
                                    placeholder="password"
                                    value={this.state.password}
                                    onChange={(e, { value }) => this.setState({ password: value })}
                                />
                                <Form.Input
                                    fluid
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={this.state.passwordConfirm}
                                    onChange={(e, { value }) => this.setState({ passwordConfirm: value })}
                                />
                                <Form.Button
                                    className="pull-right"
                                    primary
                                    onClick={this.onSubmit}
                                    disabled={this.props.resetPasswordLoading || !this.state.password || this.state.password.length < 6 || this.state.password !== this.state.passwordConfirm}
                                    loading={this.props.resetPasswordLoading}
                                >
                                    Reset
                                </Form.Button>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}

const mapStateToProps = ({ authentication }) => ({
    resetPasswordLoading: authentication.resetPasswordLoading,
})

const mapDispatchToProps = (dispatch) => ({
    resetPassword: (email, rc, password, passwordConfirm) => dispatch(resetPassword(email, rc, password, passwordConfirm)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);