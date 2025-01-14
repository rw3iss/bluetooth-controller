import { css, html, LitElement, unsafeCSS } from 'lit';

import styles from './Menu.scss';

export class Menu extends LitElement {

    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    render() {
        return html`
            <slot></slot>
        `;
    }
}
