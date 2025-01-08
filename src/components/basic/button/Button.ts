import { css, html, LitElement, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';

import styles from './Button.scss';

export class Button extends LitElement {

    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    @property({ type: String }) label = 'Button';

    // connectedCallback() {
    //     super.connectedCallback()
    //     window.addEventListener('keydown', this._handleKeydown);
    // }

    // disconnectedCallback() {
    //     super.disconnectedCallback()
    //     window.removeEventListener('keydown', this._handleKeydown);
    //   }

    _handleClick() {
        console.log(`click2`)
    }

    render() {
        return html`
        <div className="wc-button">
            ${this.label}
        </div>
    `;
    }
}
