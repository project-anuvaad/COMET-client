import React from 'react';
import './style.scss';
import FlagshipFeatures from './FlagshipFeatures';
import EndToEndLocalization from './EndToEndLocalization';
import FasterSubtitles from './FasterSubtitles';

export default class Solution extends React.Component{
    render() {
        return (
            <div className="our-solution" id={this.props.id}>
                <h1 className="solution-header">
                    Our solution
                </h1>
                <p className="solution-desc">
                    Using VideoWiki, organizations can localize their videos into multiple Indian languages
                </p>
                <FlagshipFeatures />
                <EndToEndLocalization />
                <FasterSubtitles />
            </div>
        )
    }
}