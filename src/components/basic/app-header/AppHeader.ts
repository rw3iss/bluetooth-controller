import { LitElement, css, html, unsafeCSS } from 'lit';

import styles from './AppHeader.scss';

export class AppHeader extends LitElement {

    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    render() {
        return html`
      <header class="app-header">
        HEADER

        <app-link to="/">Home</app-link>
        <app-link to="/settings">Settings</app-link>

      </header>
    `;
    }
}
