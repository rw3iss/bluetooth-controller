import { css, html, LitElement, unsafeCSS } from 'lit';

import styles from './PageConfig.scss';

export class PageConfig extends LitElement {

    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    render() {
        return html`

        <h4>CONFIG</h4>

        `;
    }
}
