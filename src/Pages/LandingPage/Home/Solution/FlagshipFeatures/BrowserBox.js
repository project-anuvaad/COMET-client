import React from 'react';
import './style.scss';
import { Button } from 'semantic-ui-react';

export default class BrowserBox extends React.Component {
    render() {
        const { style } = this.props
        return (
            <div className="browser-box" style={style || {}} >
                <div className="box-header">
                    <div className="dots-container">
                        <span className="dot red-dot" />
                        <span className="dot yellow-dot" />
                        <span className="dot green-dot" />
                        <div className="demo">
                            Video<span className="green">Wiki</span> Demo
                        </div>

                    </div>
                </div>
                <div className="box-body">
                    {this.props.children}
                </div>
            </div>
        )
    }
} 