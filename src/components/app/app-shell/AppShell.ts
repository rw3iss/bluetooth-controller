import idb from 'lib/stores/IDB/IDB';
import { LitElement, css, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './AppShell.scss';

export class AppShell extends LitElement {

    @property({ type: Boolean })
    ready = false;

    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    connectedCallback() {
        super.connectedCallback();
        const self = this;
        idb.onReady((e) => {
            self.ready = true;
            self.requestUpdate();
        });
    }

    render() {
        return html`
      <main class="app-shell">

        <app-header></app-header>

        ${this.ready ? html`<route-context></route-context>` : ``}

      </main>
    `;
    }
}
