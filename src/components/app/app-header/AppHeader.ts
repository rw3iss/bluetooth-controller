import EventService from 'lib/EventService';
import { LitElement, css, html, unsafeCSS } from 'lit';
import styles from './AppHeader.scss';

export class AppHeader extends LitElement {

    private activePage = "";

    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    connectedCallback() {
        super.connectedCallback();
        EventService.subscribe('route-change', (e) => {
            this.activePage = e.target.route;
            this.requestUpdate();
        });
    }

    render() {
        return html`
      <header class="app-header">
        <x-menu>
            <app-link to="/" class="logo"}>Rrroast</app-link>
            <app-link to="/roast" class=${this.activePage == '/roast' ? "active" : ""}>Roast</app-link>
            <app-link to="/profiles" class=${this.activePage == '/profiles' ? "active" : ""}>Profiles</app-link>
            <app-link to="/history" class=${this.activePage == '/history' ? "active" : ""}>History</app-link>
            <app-link to="/config" class=${this.activePage == '/config' ? "active" : ""}>Config</app-link>
        </x-menu>
      </header>
    `;
    }

}