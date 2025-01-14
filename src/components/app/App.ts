import EventService from 'lib/EventService';
import { Router } from 'lib/Router';
import { LitElement, html } from 'lit';

export const router = new Router();

// main app (virtual) wrapper, for context, routing, etc.
export class App extends LitElement {

    connectedCallback() {
        super.connectedCallback();
        console.log(`app.`)
        EventService.subscribe('route-change', (e) => {
            console.log(`route change in app`, e)
        });
    }

    render() {
        return html`
        <app-shell></app-shell>
    `;
    }

}
