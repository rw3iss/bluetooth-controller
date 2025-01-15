import { RouteContext } from 'components/app/route-context/RouteContext';
import AppHeader from './app-header/AppHeader';
import "./App.scss";

const App = (props = {}) => {

    return (
        <main id="app">

            <AppHeader />

            <RouteContext />

        </main>
    );

}

export default App;