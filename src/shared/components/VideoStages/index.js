import React from 'react';
import { Label } from 'semantic-ui-react';
import classnames from 'classnames';
import './style.scss';

export const STAGES = [
    {
        title: 'Upload',
    },
    {
        title: 'Transcribe',
    },
    {
        title: 'Translate',
    }
]


export default class VideoStages extends React.Component {

    render() {
        const { activeStage } = this.props;

        return (
            <span className="video-stage">
                {STAGES.map((s, i) => (
                    <span key={`stage-${s.title}`} className={classnames({ 'label-item': true, 'active': activeStage.toLowerCase() === s.title.toLowerCase()})}>
                        <Label circular>{i + 1}</Label> {s.title}
                    </span>
                ))}
            </span>
        )
    }
}