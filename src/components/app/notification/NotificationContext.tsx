import EventService from 'lib/EventService';
import { useEffect, useState } from 'preact/hooks';
import "./Notification.scss";

const NOTIFICATION_TIMEOUT_MS = 3000;

// todo: should handle array/multiple notices.

let timeout;
export const NotificationContext = (props) => {
    const [show, setShow] = useState(false);
    const [type, setType] = useState(undefined);
    const [title, setTitle] = useState(undefined);
    const [content, setContent] = useState(undefined);

    useEffect(() => {
        EventService.subscribe('notification', onNotification);
        return () => EventService.unsubscribe('notification', onNotification);
    }, []);

    function onNotification(e) {
        if (e.target) {
            if (timeout) clearInterval(timeout);
            setShow(true);
            setType(e.target.type || 'notice');
            setTitle(e.target.title);
            setContent(e.target.content);
            timeout = setTimeout(() => {
                setShow(false);
            }, e.target.duration || NOTIFICATION_TIMEOUT_MS);
        }
    }

    return (
        <>
            {show ?
                <div id="notification" class={type}>
                    <div class="inner">
                        <div class="title">
                            {title || "Notice"}
                        </div>
                        <div class="content">
                            {content}
                        </div>
                    </div>
                </div>
                : undefined
            }
        </>
    );
}