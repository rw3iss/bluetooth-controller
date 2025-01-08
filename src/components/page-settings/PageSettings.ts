import { css, html, LitElement, unsafeCSS } from 'lit';

import styles from './PageSettings.scss';

export class PageSettings extends LitElement {

    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    render() {
        return html`

        <h4>SETTINGS</h4>

        `;
    }
}
