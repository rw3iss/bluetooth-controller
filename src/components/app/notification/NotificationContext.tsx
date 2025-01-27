import EventService from 'lib/EventService';
import { useEffect, useState } from 'preact/hooks';
import "./Notification.scss";

const NOTIFICATION_TIMEOUT_MS = 3000;

type NotificationType = 'notice' | 'error';

interface Notification {
    type: NotificationType;
    title?: string;
    content: any;
}

interface INotificationProps {
    singular?: boolean;
}

let timeout;
export const NotificationContext = (props: INotificationProps) => {
    const [notifications, setNotifications] = useState(new Array<Notification>());

    useEffect(() => {
        EventService.subscribe('notification', onNotification);
        return () => EventService.unsubscribe('notification', onNotification);
    }, []);

    const onNotification = (e) => {
        if (e.target) {
            const t = e.target;
            const n = {
                type: t.type,
                title: t.title,
                content: t.content
            }
            if (props.singular) {
                if (timeout) clearTimeout(timeout);
                notifications.pop();
            }
            notifications.unshift(n);
            setNotifications([...notifications]);
            timeout = setTimeout(() => {
                popNotification(n);
            }, NOTIFICATION_TIMEOUT_MS);
        }
    }

    const popNotification = (n) => {
        notifications.pop();
        setTimeout(() => setNotifications([...notifications]));
    }

    return (
        notifications.length > 0 && (
            <div id="notifications">
                {notifications.map((n: Notification) => (
                    <div class={`notification ${n.type}`}>
                        <div class="inner">
                            <div class="title">
                                {n.title || "Notice"}
                            </div>
                            <div class="content">
                                {n.content}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    )
}