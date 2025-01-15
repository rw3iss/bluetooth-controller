
import { router } from 'lib/Router';
import { useEffect, useRef } from 'preact/hooks';

const Link = ({ to, children, target = null }) => {
    const ref = useRef();

    useEffect(() => {
        return () => {

        };
    });

    onClick = (e) => {
        if (e.getModifierState('Control') || e.getModifierState('Meta')) return; // allow control-click or cmd-click (mac) to work as usual
        e?.preventDefault();
        console.log(`click`, e, to);
        router.navigate(to);
        //         return false;
    }

    return (
        <a href={`#${to}`} onClick={onClick} ref={ref}>{children}</a>
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
