import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { router } from '../app-router/AppRouter.js';

export class Link extends LitElement {

    @property({ type: String }) to = '';

    static styles = css`
        //a { color: white; text-decoration: none; }
    `;

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('click', this.onClick.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('click', this.onClick);
    }


    onClick(e) {
        console.log(`click`)
        if (e.getModifierState('Control') || e.getModifierState('Meta')) return; // allow control-click or cmd-click (mac) to work as usual
        e?.preventDefault();
        console.log(this.to);
        router.navigate(this.to);
        return false;
    }

    render() {
        return html`
        <a href="${this.to}">
            <slot></slot>
        </a>
    `;
    }
}
