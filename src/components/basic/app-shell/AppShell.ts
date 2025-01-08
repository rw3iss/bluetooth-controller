import { LitElement, css, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';

import styles from './AppShell.scss';

//@customElement('app-shell')
export class AppShell extends LitElement {
    @property({ type: String }) header = 'Bluetooth Controller';

    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    render() {
        return html`
      <main class="app-shell">

        <app-context>

            <app-header></app-header>

            <app-router></app-router>

        </app-context>

      </main>
    `;
    }
}
