import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';

//@customElement('app-shell')
export class AppShell extends LitElement {
    @property({ type: String }) header = 'Bluetooth Controller';

    static styles = css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
      background-color: var(--app-shell-background-color);
    }

    main {
      flex-grow: 1;
      text-align: left;
    }

    .logo {
      margin-top: 36px;
      animation: app-logo-spin infinite 20s linear;
    }

    @keyframes app-logo-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }
  `;

    render() {
        return html`
      <main>
        <h1>${this.header}</h1>

        <bluetooth-controller></bluetooth-controller>

      </main>
    `;
    }
}
