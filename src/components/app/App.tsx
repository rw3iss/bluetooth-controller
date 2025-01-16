import { RouteContext } from 'components/app/route-context/RouteContext';
import { AdminTools } from 'components/basic/ui-admin-tools/AdminTools';
import AppHeader from './app-header/AppHeader';
import "./App.scss";

const App = ({ app }) => {

    return (
        <main id="app">

            <AppHeader />

            <div className="context">
                <RouteContext />
            </div>

            <AdminTools app={app} />

        </main>
    );

}

export default App;