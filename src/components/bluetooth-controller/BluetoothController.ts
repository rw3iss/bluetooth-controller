import { css, html, LitElement, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';

import styles from './bluetooth-controller.module.scss';

export class BluetoothController extends LitElement {
    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    @property({ type: String }) header = 'Bluetooth Control';

    @property({ type: Number }) counter = 5;

    __increment() {
        this.counter += 1;
    }

    render() {
        return html`
        Counter: ${this.counter}
        <br />
      <button @click=${this.__increment}>increment</button>
    `;
    }
}
