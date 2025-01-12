import { css, html, LitElement, unsafeCSS } from 'lit';

import styles from './PageProfiles.scss';

export class PageProfiles extends LitElement {

    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    render() {
        return html`

        <h4>PROFILES</h4>

        `;
    }
}
