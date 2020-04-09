import React, { Component } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import LoginForm from './LoginForm';

class LoginModal extends Component {
    state = {
        open: false,
    }

    onClose = () => {
        this.setState({ open: false });
        console.log('on close')
    }

    render = () => {
        return (
            <Modal
                open={this.state.open}
                trigger={
                    <Button size="large" color="black" onClick={() => this.setState({ open: true })}>
                        LOGIN
                    </Button>
                }
                onClose={this.onClose}
                size='tiny'
            >
                <Modal.Header>Login</Modal.Header>

                <Modal.Content>
                    <div>
                        <div className="ui segment" style={{ border: 'none', boxShadow: 'none' }}>

                            <div className="ui very relaxed one column grid">

                                {/* <div className="column">
                                    <SignupForm/>
                                </div> */}

                                <div className="column">
                                    <LoginForm onCancel={() => this.setState({ open: false })} />
                                </div>

                            </div>
                        </div>
                    </div>
                </Modal.Content>
            </Modal>
        )
    }
}
export default LoginModal;