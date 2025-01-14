
    @property({ type: Boolean }) open = false;

    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    connectedCallback() {
        super.connectedCallback()
        const slot = this.shadowRoot.querySelector('slot');
        console.log(`slots`, this.shadowRoot);
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    createRenderRoot() {
        return this;
      }
