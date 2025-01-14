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

    async connectedCallback() {
        super.connectedCallback()
        const s = await vs.load();
        if (s) {
            this.viewState = s;
            this.requestUpdate();
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    private async onSectionClick(e: CustomEvent) {
        this.viewState.sections[e.detail.key].isOpen = !this.viewState.sections[e.detail.key].isOpen;
        await vs.save(this.viewState);
        this.requestUpdate();
    }

    renderMenuItem = (s) => html`<accordian-item
            .key=${s}
            .open=${this.viewState.sections[s].isOpen}
            .title=${capitalize(s)}
            @item-clicked=${this.onSectionClick}>
                ${s} content
    </accordian-item>`;

    render() {
        return html`

        <page-header>Roast</page-header>

        <div class="dashboard">
            <div class="col-a">
                <accordian-list>
                    ${Object.keys(this.viewState.sections).map(s => this.renderMenuItem(s))}
                </accordian-list>
            </div>
            <div class="col-b">
                COL B
            </div>
        </div>

        `;
    }
}
