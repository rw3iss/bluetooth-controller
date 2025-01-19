import Application from 'Application';
import { render } from 'preact';
import { App } from './components/app/App';

// initialize app db.
const initApp = async () => {

    await Application.init();

    render(<App />, document.body);

}

initApp();