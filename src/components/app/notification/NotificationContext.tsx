import EventService from 'lib/EventService';
import { useEffect, useState } from 'preact/hooks';
import "./Notification.scss";

const NOTIFICATION_TIMEOUT_MS = 3000;

// todo: should handle array/multiple notices.

type NotificationType = 'notice' | 'error';

interface Notification {
    type: NotificationType;
    title?: string;
    content: any;
}

export const NotificationContext = (props) => {
    const [show, setShow] = useState(false);
    const [type, setType] = useState(undefined);
    const [title, setTitle] = useState(undefined);
    const [content, setContent] = useState(undefined);
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
            console.log(`add notification`, n, notifications)
            notifications.unshift(n);
            setNotifications([...notifications]);
            //if (timeout) clearInterval(timeout);
            setTimeout(() => {
                popNotification(n);
            }, NOTIFICATION_TIMEOUT_MS);
        }
    }

    const popNotification = (n) => {
        console.log(`POP`, n)
        setNotifications(notifications.filter(_n => _n.title != n.title));
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