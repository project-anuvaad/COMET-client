import React, { Component } from 'react'
import { Modal } from 'semantic-ui-react'
import SignupForm from './SignupForm';

class OrganizationSignupModal extends Component {
    render = () => {
        return (
            <Modal
                trigger={
                    <button className="large ui green button">
                        Sign up
                    </button>
                }
                size='tiny'
            >
                <Modal.Header>Organization Sign up</Modal.Header>

                <Modal.Content>
                    <div>
                        <div className="ui segment" style={{ border: 'none', boxShadow: 'none' }}>

                            <div className="ui very relaxed one column grid">

                                <div className="column">
                                    <SignupForm/>
                                </div>

                                {/* <div className="column">
                                    <LoginForm />
                                </div> */}

                            </div>
                            {/* <div className="ui vertical divider">OR</div> */}
                        </div>
                    </div>
                </Modal.Content>
            </Modal>
        )
    }
}
export default OrganizationSignupModal;