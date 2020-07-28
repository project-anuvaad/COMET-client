import { NotificationManager } from 'react-notifications';
const DEFAULT_TIMEOUT = 5000;

class NotificationService {

    info(msg, title, timeout = DEFAULT_TIMEOUT) {
        NotificationManager.info(msg, title, timeout);
    }

    error(msg, title, timeout = DEFAULT_TIMEOUT) {
        NotificationManager.error(msg, title, timeout);
    }

    success(msg, title, timeout = DEFAULT_TIMEOUT) {
        NotificationManager.success(msg, title, timeout);
    }

    warning(msg, title, timeout = DEFAULT_TIMEOUT) {
        NotificationManager.warning(msg, title, timeout);
    }

    responseError(err) {
        const reason = err.response && err.response.text ? err.response.text : 'Something went wrong';
        this.error(reason);        
    }
}

export default new NotificationService();