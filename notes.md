import { LitElement, css } from 'lit';
import { property } from 'lit/decorators.js';

class WC extends LitElement {

    @property({ type: Boolean }) open = false;

    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    createRenderRoot() {
        return this;
    }

    connectedCallback() {
        super.connectedCallback()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    handleSlotchange(e) {
        console.log(this.shadowRoot.querySelector('accordian-item'));
    }

}