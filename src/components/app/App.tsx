import { RouteContext } from 'components/app/route-context/RouteContext';
import AppHeader from './app-header/AppHeader';
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

            {/* <AdminTools /> */}

        </main>
    );

}