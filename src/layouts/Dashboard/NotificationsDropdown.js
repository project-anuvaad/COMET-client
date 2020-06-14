import React from 'react';
import { connect } from 'react-redux';
import * as notificationActions from '../../actions/notification';
import { Dropdown, Icon, Dimmer, Loader, Button } from 'semantic-ui-react';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';
import websockets from '../../websockets';

import Notification from '../../shared/components/Notification';

class NotificationsDropdown extends React.Component {

    componentDidMount = () => {
        this.props.fetchNotifications();
        this.props.fetchUnreadCount();

        websockets.subscribeToEvent(websockets.websocketsEvents.NEW_NOTIFICATION, this.onNotification)
    }
    
    componentWillUnmount = () => {
        websockets.unsubscribeFromEvent(websockets.websocketsEvents.NEW_NOTIFICATION, this.onNotification);
    }

    onNotification =  (data) => {
        this.props.fetchUnreadCount();
    }

    onLoadMore = (e) => {
        e.stopPropagation();
        this.props.loadMore();
    }

    onDropdownOpen = () => {
        this.props.fetchNotifications();
        this.props.setNotificationsRead()
    }

    onNotificationActionClick = (notification, action) => {
        if (notification.type === 'invited_to_translate') {
            this.props.respondToTranslationInvitation(notification._id, this.props.organization._id, notification.resource, action, notification.inviteToken, this.props.user.email);
        } else if (notification.type === 'invited_to_translate_text') {
            this.props.respondToTextTranslationInvitation(notification._id, this.props.organization._id, notification.resource, action, notification.inviteToken, this.props.user.email);
        }
    }

    renderDropdownTrigger = () => {
        return (
            <div
                style={{ display: 'inline-block', position: 'relative' }}
            >
                <Icon name="bell outline" size="large" style={{ color: 'white' }} />
                <NotificationBadge count={this.props.unreadCount} effect={Effect.SCALE}/>
            </div>
        );
    }

    render() {
        const { notifications } = this.props;
        return (
            <Dropdown
                trigger={this.renderDropdownTrigger()}
                icon="none"
                floating
                direction="left"
                onOpen={() => this.onDropdownOpen()}
            >
                <Dropdown.Menu
                    style={{ minHeight: 100, maxHeight: 300, height: 300, width: 400, overflowY: notifications && notifications.length > 0 ? 'scroll' : 'hidden' }}
                >
                    {notifications && notifications.length > 0 ? (
                        <React.Fragment>
                            {notifications.map(noti => (
                                <Dropdown.Item className="notification-item" key={noti._id}>
                                    <Notification
                                        {...noti}
                                        onActionClick={(action) => this.onNotificationActionClick(noti, action)}
                                    />
                                </Dropdown.Item>
                            ))}
                            {this.props.currentPage !== this.props.totalPagesCount && (
                                <div
                                    style={{ margin: 20, display: 'flex', justifyContent: 'center' }}
                                >

                                    <Button
                                        primary
                                        disabled={this.props.loading}
                                        loading={this.props.loading}
                                        onClick={this.onLoadMore}
                                    >
                                        Load More...
                                </Button>
                                </div>
                            )}
                        </React.Fragment>
                    ) : (
                            <div
                                style={{
                                    width: '50%',
                                    margin: '120px auto',
                                }}
                            >
                                Nothing to show here yet :)
                        </div>
                        )}
                </Dropdown.Menu>
            </Dropdown>
        )
    }
}


const mapStateToProps = ({ notification, authentication, organization }) => ({
    loading: notification.loading,
    notifications: notification.notifications,
    currentPage: notification.currentPage,
    totalPagesCount: notification.totalPagesCount,
    unreadCount: notification.unreadCount,
    user: authentication.user,
    organization: organization.organization,
})

const mapDispatchToProps = (dispatch) => ({
    fetchNotifications: () => dispatch(notificationActions.fetchNotifications()),
    loadMore: () => dispatch(notificationActions.loadMore()),
    fetchUnreadCount: () => dispatch(notificationActions.fetchUnreadCount()),
    setNotificationsRead: () => dispatch(notificationActions.setNotificationsRead()),
    respondToTranslationInvitation: (notificationId, organizationId, articleId, status, inviteToken, email) => dispatch(notificationActions.respondToTranslationInvitation(notificationId, organizationId, articleId, status, inviteToken, email))
})

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsDropdown);
