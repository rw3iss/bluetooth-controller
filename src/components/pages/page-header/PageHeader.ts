import { css, html, LitElement, unsafeCSS } from 'lit';

import styles from './PageHeader.scss';

export class PageHeader extends LitElement {

    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    render() {
        return html`

        <h4><slot></slot></h4>

        `;
    }
}
