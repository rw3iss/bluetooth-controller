import IDbOrCacheStore from 'lib/stores/IDbOrCacheStore';
import { capitalize } from 'lib/utils/StrUtils';
import { css, html, LitElement, unsafeCSS } from 'lit';
import styles from './PageRoast.scss';

class ViewState {

    private id: any;
    private store: IDbOrCacheStore;

    constructor(id) {
        this.id = id;
        this.store = new IDbOrCacheStore('view-state');
    }

    public async load() {
        return await this.store.get(this.id);
    }

    public async save(state) {
        return await this.store.set(this.id, state);
    }

}

const vs = new ViewState('page-roast');

export class PageRoast extends LitElement {

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
        const load = async () => {
            const s = await vs.load();
            console.log(`See state:`, s)
            if (s) {
                this.viewState = s;
                this.requestUpdate();
            }
        }
        load();
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    private async handleSectionClick(e: CustomEvent) {
        console.log(`menu item click`, e.detail.key);
        this.viewState.sections[e.detail.key].isOpen = !this.viewState.sections[e.detail.key].isOpen;
        await vs.save(this.viewState);
        const s = await vs.load();
        console.log(`saved?`, s)
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
