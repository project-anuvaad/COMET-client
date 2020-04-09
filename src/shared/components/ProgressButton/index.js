import React from 'react';
import { Progress, Button } from 'semantic-ui-react';
import './style.scss';

export default class ProgressButton extends React.Component{

    render() {
        return (
            <div>
                <div className={`progress-btn ${this.props.showProgress && 'hidden'}`} basic onClick={this.props.onClick}> 
                    {this.props.text}
                </div>  
                <Progress className={`progress-bar ${!this.props.showProgress && 'hidden'}`} size="small" percent={this.props.percent} indicating progress />
            </div>
        )
    }
}

ProgressButton.defaultProps = {
    onClick: () => {},
}