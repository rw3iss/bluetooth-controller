import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';


export class AppContext extends LitElement {

    @property({ type: String }) route = '/';

    // public changeRoute = (url) => {
    //     console.log(`change route`, url)
    // }

    // public loadRoute = (url) => {
    //     // todo: try to match regex patterns
    //     this.route = url;
    //     let c = routes.for
    // }

    connectedCallback() {
        console.log(`AppContext connected`, window.url);
        super.connectedCallback()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    render() {
        return html`
            <slot></slot>
       `;
    }
}
