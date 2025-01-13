import { LitElement, css, html, unsafeCSS } from 'lit';

import styles from './Accordian.scss';

export class Accordian extends LitElement {

    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    connectedCallback() {
        super.connectedCallback()
        const slot = this.shadowRoot.querySelector('accordian-item');
        console.log(`slots`, this.shadowRoot);
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    handleSlotchange(e) {
        const childNodes = e.target.querySelectorAll('accordian-item');
        console.log(`accordian slot change`, childNodes)

        console.log(this.shadowRoot.querySelector('accordian-item'));
    }

    render() {
        return html`
      <div class="accordian" @item-clicked=${(e) => this.dispatchEvent(e)}>
        <slot @slotchange=${this.handleSlotchange}></slot>
      </div>
    `;
    }
}