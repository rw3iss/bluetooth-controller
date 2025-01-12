import { css, html, LitElement, unsafeCSS } from 'lit';

import styles from './PageRoastHistory.scss';

export class PageRoastHistory extends LitElement {

    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    render() {
        return html`

        <h4>ROAST HISTORY</h4>

        `;
    }
}
