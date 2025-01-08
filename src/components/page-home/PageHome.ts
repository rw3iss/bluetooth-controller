import { css, html, LitElement, unsafeCSS } from 'lit';

import styles from './PageHome.scss';

export class PageHome extends LitElement {

    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    render() {
        return html`

        <h4>HOME</h4>

        `;
    }
}
