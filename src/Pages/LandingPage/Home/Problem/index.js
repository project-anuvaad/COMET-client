import React from 'react';
import LanguageMaps from './LanguageMaps';
import './style.scss'

export default class Problem extends React.Component {
    render() {
        return (
            <div className="problem" id={this.props.id}>
                <h1 className="problem-header">
                    problem
                </h1>
                <div
                >
                    <p className="problem-desc">
                        Most of India’s internet is in English, despite the fact that 90% of India’s population  - <span className="bold">over 1 billion people</span> do not speak English
                    </p>
                </div>

                <LanguageMaps />
            </div>
        )
    }
}