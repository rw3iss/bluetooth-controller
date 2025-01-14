import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export class MenuItem extends LitElement {

    static get styles() {
        return css`:host {
        background: inherit;
        }`;
    }

    @property({ type: Boolean }) active? = false;

    render() {
        return html`
            <slot></slot>
        `;
    }
}
