import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { router } from '../app-router/AppRouter.js';

export class Link extends LitElement {

    @property({ type: String }) to = '';

    onClick(e) {
        e.stopPropagation();
        e.preventDefault();
        router.navigate(this.to);
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
