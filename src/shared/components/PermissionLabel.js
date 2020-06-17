import React from 'react';
import { Label } from 'semantic-ui-react';
import { USER_ROLES_TITLE_MAP } from '../constants';

function getPermissionColor(permission) {
    switch (permission) {
        case 'project_leader':
            return 'blue';
        case 'admin':
            return 'teal';

        case 'review':
        case 'break_videos':
        case 'transcribe_text':
        case 'approve_transcriptions':
            return 'brown';

        case 'translate':
        case 'voice_over_artist':
        case 'translate_text':
        case 'approve_translation':
            return 'green';

        default:
            return 'green';
    }
}

export default class PermissionLabel extends React.Component {

    render() {
        const { permission } = this.props;
        return (

            <Label
                style={{ textTransform: 'capitalize', marginRight: 10 }}
                color={getPermissionColor(permission)}

            >{permission === 'review' ? 'transcribe' : USER_ROLES_TITLE_MAP[permission]}</Label>
        )
    }
}