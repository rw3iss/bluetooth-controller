import { LitElement, css, html, unsafeCSS } from 'lit';

import styles from './Accordian.scss';

export class Accordian extends LitElement {

    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    connectedCallback() {
        super.connectedCallback()
        // const slot = this.shadowRoot.querySelector('accordian-item');
        // console.log(`slots`, slot);
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    render() {
        return html`
      <div class="accordian">
        <slot></slot>
      </div>
    `;
    }
}