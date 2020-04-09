import React from 'react';
import './style.scss';
import InviteToTranslate from './InviteToTranslate';
import InviteToTranslateAccepted from './InviteToTranslateAccepted';
import InviteToTranslateDeclined from './InviteToTranslateDeclined';
import DefaultNotification from './DefaultNotification';
import MarkedReviewAsDone from './MarkedReviewAsDone'
import AddedCommentToTranslation from './AddedCommentToTranslation';

const NOTIFICATIONS_TYPES = [
    'invited_to_translate',
    'invited_to_translate_accepted',
    'invited_to_translate_declined',
];

const NOTIFICATION_COMP_MAP = {
    'invited_to_translate': InviteToTranslate,
    'invited_to_translate_accepted': DefaultNotification,
    'invited_to_translate_declined': DefaultNotification, 
    'translation_export_request': DefaultNotification,
    'added_comment_to_translation': AddedCommentToTranslation,
    'invited_to_verify': DefaultNotification,
    'review_marked_as_done': MarkedReviewAsDone,
}

export default class Notification extends React.Component {
    render() {
        let Comp = NOTIFICATION_COMP_MAP[this.props.type];
        return <Comp {...this.props} className="notification-item" />
    }
}