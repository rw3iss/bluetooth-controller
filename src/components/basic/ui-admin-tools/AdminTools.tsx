import { useState } from 'preact/hooks';
import './AdminTools.scss';

export function AdminTools({ app }) {
    const [closed, setClosed] = useState(false);
    const [hidden, setHidden] = useState(false);

    async function clearViewCache() {
        const store = app.idb.getStore('view-state');
        await app.idb.clearAll('view-state');
        console.log(`View state cleared.`, store)
    }

    return (
        closed ? <></> :
            <div class="admin-tools">
                {hidden ? <button onClick={() => setHidden(false)}>Show</button> :
                    <div class="actions">
                        <button onClick={() => clearViewCache()}>Clear View Cache</button>
                        <div class="row">
                            <button onClick={() => setHidden(true)}>Hide</button>
                            <button onClick={() => setClosed(true)}>Close</button>
                        </div>
                    </div>}
            </div>
    );
}