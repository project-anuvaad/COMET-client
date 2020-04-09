import React from 'react';
import { connect } from 'react-redux';

import { emailResetPassword } from '../../actions/authentication';
import { Button } from 'semantic-ui-react';


class PasswordResetForm extends React.Component {
    state = {
        email: '',
    }

    onFormSubmit = (e) => {
        e.preventDefault();
        this.props.emailResetPassword(this.state.email);
    }

    render() {
        return (
            <div>
                <form className="ui form" method="POST" onSubmit={this.onFormSubmit}>

                    <div className="field">
                        We'll send you a link on your email to reset your password
                    </div>
                    <div className="field">
                        <label>Email</label>
                        <input name="email" value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} />
                    </div>

                    <div
                        style={{ textAlign: 'right', margin: 20 }}
                    >

                        <a
                            href="javascript:void(0)"
                            onClick={this.props.onLoginClick}
                        >
                            Already have an account?
                    </a>
                    </div>


                    <Button
                        loading={this.props.resetPasswordLoading}
                        disabled={this.props.resetPasswordLoading}
                        type="submit"
                        className="ui green button pull-right"
                    >
                        Reset
                    </Button>

                    <Button
                        onClick={this.props.onCancel}
                        type="button"
                        className="ui button pull-right"
                    >
                        Cancel
                    </Button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = ({ authentication }) => ({
    resetPasswordLoading: authentication.resetPasswordLoading,
})

const mapDispatchToProps = (dispatch) => ({
    emailResetPassword: (email) => dispatch(emailResetPassword(email)),
})


export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetForm)