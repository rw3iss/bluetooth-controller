import { css, html, LitElement, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';

import styles from './Button.module.scss';

export class Button extends LitElement {

    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    @property({ type: String }) label = 'Button';

    render() {
        return html`
        <div className="wc-button">
            ${this.label}
        </div>
        `;
    }
}
