import { LitElement, css, html, unsafeCSS } from 'lit';

import styles from './AppHeader.scss';

export class AppHeader extends LitElement {

    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    render() {
        return html`
      <header class="app-header">
        <app-link to="/" class="logo">Rrroast</app-link>
        <app-link to="/roast">Roast</app-link>
        <app-link to="/profiles">Profiles</app-link>
        <app-link to="/history">History</app-link>
        <app-link to="/config">Config</app-link>
      </header>
    `;
    }
}