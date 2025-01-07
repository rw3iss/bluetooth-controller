import { css, html, LitElement, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';

import styles from './BLEDevice.scss';

export class BLEDevice extends LitElement {
    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    @property({ type: String }) header = 'BLE Device';

    @property({ type: Number }) counter = 5;

    __increment() {
        this.counter += 1;
    }

    render() {
        return html`

        BLE DEVICE SELECT

        `;
    }
}
