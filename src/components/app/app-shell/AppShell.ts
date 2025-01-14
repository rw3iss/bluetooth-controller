import { LitElement, css, html, unsafeCSS } from 'lit';
import styles from './AppShell.scss';

export class AppShell extends LitElement {

    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    render() {
        return html`
      <main class="app-shell">

        <app-header></app-header>

        <route-context></route-context>

      </main>
    `;
    }
}
