import { RouteContext } from 'components/app/route-context/RouteContext';
import { AdminTools } from 'components/basic/ui-admin-tools/AdminTools';
import AppHeader from './app-header/AppHeader';
import { NotificationContext } from './notification/NotificationContext';
import { RoastPopup } from './roast-popup/RoastPopup';

import "./App.scss";

export const App = () => {

    return (
        <main id="app">

            <AppHeader />

            <div className="context">
                <RouteContext />
            </div>

            <RoastPopup />

            <NotificationContext />

            <AdminTools />

        </main>
    );

}