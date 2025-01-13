import { LitElement, css, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { provide } from '@lit/context';


import styles from './AppShell.scss';
import { AppContext, appContext } from '../AppContext/AppContext.js';

//@customElement('app-shell')
export class AppShell extends LitElement {

    @property({ type: String }) header = 'Bluetooth Controller';

    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    createRenderRoot() {
        return this;
    }

    @provide({ context: appContext })
    app = new AppContext();

    render() {
        return html`
      <main class="app-shell">

        <app-header></app-header>

        <app-router></app-router>

      </main>
    `;
    }
}
