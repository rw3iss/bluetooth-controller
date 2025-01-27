import EventService from './EventService';

type INotificationProps = {
    title?: string;
    content: any;
    duration?: number;
}

class NotificationService {

    constructor() {
    }

    private _notice(type, title, content, duration) {
        EventService.dispatch('notification', { type, title, content, duration });
    }

    info(n: INotificationProps) {
        this._notice('notice', n.title || 'Notice', n.content, n.duration || 3000);
    }

    success(n: INotificationProps) {
        this._notice('success', n.title || 'Success', n.content, n.duration || 3000);
    }

    warning(n: INotificationProps) {
        this._notice('warning', n.title || 'Warning', n.content, n.duration || 3000);
    }

    error(n: INotificationProps) {
        this._notice('error', n.title || 'Error', n.content, n.duration || 3000);
    }

}

const Notification = new NotificationService();
export default Notification;