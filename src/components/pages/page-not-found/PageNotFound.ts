import { css, html, LitElement, unsafeCSS } from 'lit';

import styles from './PageNotFound.scss';

export class PageNotFound extends LitElement {

    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    render() {
        return html`

        <h4>PAGE NOT FOUND</h4>

        `;
    }
}
