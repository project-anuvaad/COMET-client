import React from 'react';
import { Modal, Label, Button, Grid, Checkbox } from 'semantic-ui-react';
import './style.scss';
import classnames from 'classnames';
import { NUMBER_OF_STEPS, STEP_CONTENT, STAGES } from './config'
import VideoStages from '../VideoStages';

export default class UserGuidingTutorialModal extends React.Component {

    state = {
        currentStep: 1,
    }

    toggleOpen = () => {
        if (this.props.open) {
            this.props.onClose();
        } else {
            this.props.onOpen()
        }
    }

    onBack = () => {
        if (this.state.currentStep > 1) {
            this.setState({ currentStep: this.state.currentStep - 1 })
        } else {
            this.setState({ currentStep: 1 })
        }
    }

    onNext = () => {
        const { currentStep } = this.state;
        if (currentStep < NUMBER_OF_STEPS) {
            this.setState({ currentStep: currentStep + 1 });
        } else {
            this.setState({ currentStep: 1 });
            this.toggleOpen();
        }
    }

    getActivestage = () => {
        let activeStage;
        STAGES.forEach((s, i) => {
            if(this.state.currentStep >= s.activeRange[0] && this.state.currentStep <= s.activeRange[1]) {
                activeStage = s;
            }
        })
        return activeStage.title;
    }

    render() {

        return (
            <Modal
                className="user-guiding-tutorial-modal"
                onClose={this.toggleOpen}
                open={this.props.open}
            >

                <Modal.Header>
                    <h3>
                        How does COMET work?
                        <Button
                            circular
                            basic
                            icon="close"
                            className="pull-right"
                            onClick={this.toggleOpen}
                        />
                    </h3>
                    <div>
                        <VideoStages activeStage={this.getActivestage()} />
                    </div>
                </Modal.Header>
                <Modal.Content>
                    <Grid>
                        <Grid.Row className="step">
                            <Grid.Column width={10}>
                                <h1 className="step-title">
                                    {STEP_CONTENT[this.state.currentStep].title}
                                </h1>

                                <p className="step-description">
                                    {STEP_CONTENT[this.state.currentStep].description}
                                </p>
                                <div className="bottom-content">

                                    <div className="nav-buttons">
                                        <Button disabled={this.state.currentStep === 1} className="back" circular onClick={this.onBack}>
                                            Back
                                    </Button>
                                        <Button circular primary className="next" onClick={this.onNext}>
                                            {this.state.currentStep < NUMBER_OF_STEPS ? 'Next' : 'Go to COMET Home'}
                                        </Button>


                                    </div>
                                    <div>
                                        {[...Array(NUMBER_OF_STEPS).keys()].map((s, i) => (
                                            <span key={`step-flag-${i}`} className={classnames({ 'rectangle': true, 'active': s + 1 === this.state.currentStep })} ></span>
                                        ))}
                                    </div>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={6}>
                                <img className="step-img" src={STEP_CONTENT[this.state.currentStep].image} />
                                {this.props.showSkipOnStart && (
                                    <div className="skip-on-start">
                                        <Checkbox
                                            label="Show this tutorial on startup"
                                            checked={this.props.showUserGuiding}
                                            onChange={(e, { checked }) => this.props.onChangeShowUserGuiding(checked)}
                                        />
                                    </div>
                                )}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
            </Modal>
        )
    }
}