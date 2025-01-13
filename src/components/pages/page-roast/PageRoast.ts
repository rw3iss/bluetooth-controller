import { capitalize } from 'lib/StrUtils';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { RoastController } from '../../lib/RoastController';
import styles from './PageRoast.scss';

export class PageRoast extends LitElement {

    private roast = new RoastController(this);

    private viewState = {
        "sections": {
            "current": {
                isOpen: false
            },
            "set": {
                isOpen: false
            },
            "auto-eject": {
                isOpen: false
            },
            "profile": {
                isOpen: false
            }
        }
    }

    static get styles() {
        return css`${unsafeCSS(styles)}`;
    }

    connectedCallback() {
        super.connectedCallback()
        //this.viewState = loadViewState('page-roast');
        //this.requestUpdate();
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    private handleSectionClick(e: CustomEvent) {
        console.log(`menu item click`, e.detail.key);
        this.viewState.sections[e.detail.key].isOpen = !this.viewState.sections[e.detail.key].isOpen;
        this.requestUpdate();
    }

    private isOpen = (s) => this.viewState.sections[s].isOpen;

    renderMenuItem = (s) => html`<accordian-item .open=${this.isOpen(s)} .key=${s} .title=${capitalize(s)} @item-clicked=${this.handleSectionClick}>
        ${s} content
    </accordian-item>`;

    render() {
        return html`
        <h4>ROAST</h4>

        <div class="panel-menu">
            <accordian-list>
                ${Object.keys(this.viewState.sections).map(s => this.renderMenuItem(s))}
            </accordian-list>
        </div>

        `;
    }
}
