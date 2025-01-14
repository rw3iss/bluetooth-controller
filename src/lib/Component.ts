export default class Component {

    private props;
    private state;

    constructor(props?, state?) {
        this.props = props || {};
        this.state = state || {};
    }

    render() {
        throw new ReferenceError('You must define your own render function.');
    }

    onUpdate(state?) {
        this.render(this.props);
        // render(
        //     <TitleContent name={state.name} />,
        //     this.el
        // );
    }

    setState(handler) {
        if (typeof handler !== 'function') {
            this.state = { ...this.state, ...handler };
            if (!this.onUpdate) return this.state;
            return this.onUpdate(this.state);
        }

        this.state = handler(this.state)
        if (!this.onUpdate) return this.state;
        return this.onUpdate(this.state);
    }
}

Component.isClass = true;