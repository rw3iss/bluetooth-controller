/* Create virtual element:

  function createVElement(tag, config) {
  const className = config.class;

  return {
    tag: tag,
    className: className,
    dom: null,
  }

*/

// type VNodeList = Array<any>;

// type VElement = {
//     tag: string,
//     props: {
//       children: VNodeList | undefined
//     },
//     className: string,
//     style: string,
//     dom: HTMLElement
// }

export function v(type, props, ...children) {
    let container: HTMLElement;

    // define a default value for props
    props = props || {};
    // if _children is an array of array take the first value, else take the full array

    //console.log("props?", props)
    const componentProps = { ...props, children: (props.children || []).concat(children) };
    //console.log("component props", componentProps);

    // if argument is a component, instantiate it, and return it's rendered string
    if (typeof type == 'function') {
        // todo: check if Class vs function?
        const component = new type(componentProps);
        const element = component.render(componentProps);
        return element;
    }

    const element = document.createElement(type);
    Object.entries(props).forEach(([name, value]) => {
        console.log("prop", name, value);
        if (name === 'children') {
            //console.log("append children?",value);
            return (value as [])
                .map(child => typeof child === 'string' ? document.createTextNode(child) : child)
                .forEach(child => { if (child) element.appendChild(child) });
        }

        if (!isEvent(name)) return element.setAttribute(name, value);

        const eventName = getEventName(name);
        console.log("adding event", name, eventName, value)

        element.addEventListener(eventName, value);
    });

    // merge child arrays
    const _children = [].concat.apply([], children);

    // append children
    //console.log("append _children?",_children);
    _children
        .map(child => typeof child === 'string' ? document.createTextNode(child) : child)
        .forEach(child => { if (child) element.appendChild(child) });

    // children.forEach((child, i) => {
    //     if (child == undefined) return;

    //     switch (typeof child) {
    //         case 'string':
    //             container.innerHTML += child;
    //             break;
    //         case 'object': // an array/spread was passed, usually to map multiple components
    //             if (Array.isArray(child)) {
    //                 //
    //                 child.forEach((ic, i) => {
    //                     container.innerHTML += ic;
    //                 })
    //             }
    //             break;
    //         default:
    //             console.log("Unknown child component", i, typeof child, child)
    //     }
    // });

    return element;//.outerHTML;
}


// mount a virtual element
export function mount(vElement, parentDOMNode) {
    //const { tag, className } = vElement;

    //create a native DOM node
    // const domNode = document.createElement(tag);

    // // for later reference save the DOM node on our vElement
    // vElement.dom = domNode;

    // //add className to native node
    // if (className !== undefined) {
    //     domNode.className = className;
    // }

    //Append domNode to the DOM
    parentDOMNode.appendChild(vElement)
    return parentDOMNode;
}



// check if it's an event if it starts with a `on` and followed with a capitalized character (eg. onClick)
function isEvent(attr) {
    return (attr.startsWith('on') || attr.startsWith('@'))
}

// get the name of the event without the `on` (eg. click instead of onClick)
function getEventName(attr) {
    return attr.split('').splice(2).join('').toLowerCase();
}