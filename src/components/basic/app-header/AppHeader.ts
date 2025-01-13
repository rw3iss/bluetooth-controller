import { LitElement, css, html, unsafeCSS } from 'lit';

import styles from './AppHeader.scss';
import { AppContext, appContext } from '../AppContext/AppContext.js';
import { consume } from '@lit/context';
import { property } from 'lit/decorators.js';

export class AppHeader extends LitElement {

    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
    }

    @consume({ context: appContext, subscribe: true })
    @property({ attribute: false })
    public app?: AppContext;

    render() {
        return html`
      <header class="app-header">
        <app-link to="/" class="logo">Rrroast</app-link>
        <app-link to="/roast">Roast</app-link>
        <app-link to="/profiles">Profiles</app-link>
        <app-link to="/history">History</app-link>
        <app-link to="/config">Config</app-link>
        ROUTE: ${this.app.route}
      </header>
    `;
    }
}