import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';

import styles from './AccordianItem.scss';

export class AccordianItem extends LitElement {

    @property({ type: Boolean }) open = false;
    @property({ type: String }) title = "";
    @property({ type: String }) key = "";

    static get styles() {
        return styles;
    };

    private onClick(section, e: MouseEvent) {
        console.log(`item click`, section);
        //this.viewState.sections[section].isOpen = !this.viewState.sections[section].isOpen;
        this.dispatchEvent(new CustomEvent("item-clicked", { detail: { key: this.key } }));
        this.requestUpdate();
    }

    render() {
        return html`
      <div class="accordian-item ${this.open ? "open" : ""}">
        <div class="title" @click=${(e) => this.onClick(this.key, e)}>
            ${this.title}
        </div>
        <div class="content">
             <slot></slot>
        </div>
      </div>
    `;
    }
}