import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';

export class Link extends LitElement {

    @property({ type: String }) to = '';

    onClick(e) {
        e.stopPropagation();
        e.preventDefault();
        console.log(`link click`, this.to)
        // signal to router to change url..
        location.pathname = this.to;
        return false;
    }

    render() {
        return html`
        <a href="${this.to}" @click="${this.onClick}">
            <slot></slot>
        </a>
    `;
    }
}
