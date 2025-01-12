import { css, html, LitElement, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';

import styles from './BLEDevice.scss';

export class BLEDevice extends LitElement {

    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    @property({ type: String }) header = 'BLE Device Select';

    device = undefined;

    async _handleClick() {
        if (navigator.bluetooth) {
            navigator.bluetooth.requestDevice({ acceptAllDevices: true })
                .then(device => {
                    console.log(`Got device:`, device)
                    // todo: save state so refresh restores?
                    this.device = device;
                })
                .catch(error => { console.error(error); });
        } else {
            alert("No bluetooth?");
        }

        // const btPermission = await navigator.permissions.query({ name: "bluetooth" });
        // if (btPermission.state !== "denied") {
        //     console.log(`ok`)
        // } else {
        //     alert("Bluetooth permission denied.");
        // }
    }

    render() {
        return html`

        <h4>${this.header}</h4>

        <button @click="${this._handleClick}">Select Bluetooth Device</button>

        `;
    }
}
