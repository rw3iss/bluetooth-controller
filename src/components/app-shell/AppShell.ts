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
      <main>

        <h1>${this.header}</h1>

        <ble-device></ble-device>

      </main>
    `;
    }
}
