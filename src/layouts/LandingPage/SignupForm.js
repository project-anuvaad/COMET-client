import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Message, Button, Popup, Icon } from 'semantic-ui-react';

import { signUp } from '../../actions/authentication';

class SignupForm extends Component {
    state = {
        orgName: '',
        email: '',
        firstname: '',
        lastname: '',
        password: '',
        logo: null,
    }

    onFormSubmit = (e) => {
        e.preventDefault();
        this.registerUser();
    }

    registerUser() {
        const { orgName, email, password, logo, firstname, lastname } = this.state;

        this.props.signUp({
            orgName,
            email,
            firstname,
            lastname,
            password,
            logo,
        });
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    onLogoChange = (event) => {
        const file = event.target.files[0];
        this.setState({ logo: file });
    }

    render() {
        const re = /^[A-Za-z0-9\s]+$/i
        const isorgNameValid = this.state.orgName.match(re) && this.state.orgName.match(re).length > 0
        return (
            <div>
                <form className="ui form" method="POST" onSubmit={this.onFormSubmit}>
                    <div className="field">
                        <label>
                            Organization Name
                        <span style={{ color: 'red' }}> *</span>
                        <Popup content="Only letters and numbers allowed" trigger={<Icon name="info circle" />} />
                        </label>
                        <input name="orgName" value={this.state.orgName} onChange={this.handleChange} />
                        {this.state.orgName && !isorgNameValid && (
                            <div style={{ color: 'red' }}>
                                Invalid organiation name ( only letters and numbers are allowed)
                            </div>
                        )}
                    </div>
                    <div className="field">
                        <label>Email
                            <span style={{ color: 'red' }}> *</span>
                        </label>
                        <input name="email" value={this.state.email} onChange={this.handleChange} />
                    </div>

                    <div className="field">
                        <label>First Name
                            <span style={{ color: 'red' }}> *</span>
                        </label>
                        <input name="firstname" value={this.state.firstname} onChange={this.handleChange} />
                    </div>

                    <div className="field">
                        <label>Last name
                            <span style={{ color: 'red' }}> *</span>
                        </label>
                        <input name="lastname" value={this.state.lastname} onChange={this.handleChange} />
                    </div>


                    <div className="field">
                        <label>
                            Password
                            <span style={{ color: 'red' }}> *</span>
                        </label>
                        <input name="password" type="password" value={this.state.password} onChange={this.handleChange} />
                    </div>

                    <div className="field">
                        <label>Logo</label>
                        <input name="logo" type="file" accept="image/*" onChange={this.onLogoChange} />
                    </div>
                    <Button type="submit" className="ui green button pull-right" loading={this.props.signupLoading} disabled={this.props.signupLoading}>Sign up</Button>
                    <Button type="button" className="ui button pull-right"
                        onClick={this.props.onCancel}
                    >Cancel</Button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = ({ authentication }) => ({
    ...authentication
})

const mapDispatchToProps = (dispatch) => ({
    signUp: (params) => dispatch(signUp(params))
})

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(SignupForm)
);