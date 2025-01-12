import { LitElement, css, html, unsafeCSS } from 'lit';

import styles from './Accordian.scss';

export class Accordian extends LitElement {

    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    connectedCallback() {
        super.connectedCallback()
        const slot = this.shadowRoot.querySelector('slot');
        console.log(`slots`, this.shadowRoot);
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    handleSlotchange(e) {
        const childNodes = e.target.querySelectorAll('accordian-item');
        console.log(`slot change`, childNodes)
    }

    render() {
        return html`
      <div class="accordian">
        <slot @slotchange=${this.handleSlotchange}></slot>
      </div>
    `;
    }
}