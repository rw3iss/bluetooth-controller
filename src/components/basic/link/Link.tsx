
import { router } from 'lib/Router';

const Link = ({ to, children, target = null, className = '' }) => {

    function onClick(e) {
        if (e.getModifierState('Control') || e.getModifierState('Meta')) return; // allow control-click or cmd-click (mac) to work as usual
        e?.preventDefault();
        router.navigate(to);
    }

    return (
        <a href={`${to}`} onClick={onClick} class={`${className}`}>{children}</a>
    );

}

export default Link;


// export class Link extends LitElement {
//     @property({ type: String }) to = '';

//     static styles = css`
//         :host a {
//             color: inherit;
//             text-decoration: inherit;
//         }
//     `;

//     // constructor() {
//     //     super();
//     // }

//     static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

//     connectedCallback() {
//         super.connectedCallback()
//         this.addEventListener('click', this.onClick.bind(this));
//     }

//     disconnectedCallback() {
//         super.disconnectedCallback()
//         this.removeEventListener('click', this.onClick);
//     }

//     onClick(e) {
//         if (e.getModifierState('Control') || e.getModifierState('Meta')) return; // allow control-click or cmd-click (mac) to work as usual
//         e?.preventDefault();
//         router.navigate(this.to);
//         return false;
//     }

//     render() {
//         return html`
//         <a href="${this.to}">
//             <slot></slot>
//         </a>
//     `;
//     }
// }
