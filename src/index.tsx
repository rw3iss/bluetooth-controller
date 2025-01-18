import { render } from 'preact';
import App from './components/app/App.js';

// initialize app db.
const initApp = async () => {

    render(<App />, document.body);

}

initApp();