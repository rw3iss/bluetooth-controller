import { createRef } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import Graph from './graph/Graph';

import './CanvasGraph.scss';

function CanvasGraph({ getData, config }) {
    const [graph, setGraph] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [size, setSize] = useState({ w: 0, h: 0 });
    const container = createRef();
    const canvas = createRef();

    useEffect(() => {
        //window.addEventListener("resize", updateSize);
        return () => {
            //window.removeEventListener("resize", updateSize);
        }
    }, []);

    useEffect(() => {
        if (container?.current && canvas?.current && !graph) initGraph();
    }, [container, canvas]);

    const initGraph = async () => {
        if (canvas.current) {
            const g = new Graph(canvas.current.getContext("2d"), config);
            const { w, h } = updateSize();

            container.current.addEventListener("resize", updateSize);

            let data = await getData();
            console.log(`GOT DATA`, data)
            g.setData(data);
            g.setMinMax(35000, 55000); // todo: determine

            setGraph(g);
            setLoading(false);

            g.resize(w, h);
        }
    }

    const updateSize = (e?) => {
        console.log(`updateSize`, container, canvas)
        if (container.current && canvas.current) {
            let w = container.current.offsetWidth;
            let h = container.current.offsetHeight;
            if (config.width) w = Math.max(w, config.width);
            if (config.height) h = Math.max(h, config.height);
            canvas.current.setAttribute('width', w);
            canvas.current.setAttribute('height', h);
            console.log(`SIZE`, w, h, graph)
            if (graph) graph.resize(w, h);
            return { w, h };
        }
    }

    //if (graph) graph.render();

    return (
        <div class="canvas-graph" ref={container}>
            {loading && <div>Loading...</div>}
            <canvas ref={canvas} style={`opacity: ${loading ? 0 : 1}`} />
        </div>
    );
}

// class CanvasGraph extends Component {

//     container = createRef();
//     canvas = createRef();

//     graph = undefined;

//     state = {
//         loading: true
//     }

//     componentWillMount() {
//         this.bindEvents();
//     }

//     setDimensions() {
//         let w = this.container.current.offsetWidth;
//         let h = this.container.current.offsetHeight;

//         if (this.props.width) w = Math.max([w, this.props.width]);
//         if (this.props.height) h = Math.max([h, this.props.height]);

//         this.canvas.current.setAttribute('width', w);
//         this.canvas.current.setAttribute('height', h);

//         this.graph.resize(w, h);
//     }

//     bindEvents() {
//         window.onresize = (e) => this.setDimensions();
//     }

//     async componentDidMount() {
//         this.graph = new Graph(this.canvas.current.getContext("2d"), {
//             style: this.props.style || "bar"
//         });
//         this.setDimensions();

//         // get and set data
//         let data = await this.props.getData();
//         console.log(`GOT DATA`, data)
//         this.graph.setData(data);
//         this.graph.setMinMax(35000, 55000); // todo: determine

//         // add some widgets
//         //this.graph.addWidget(new MinMaxAvgWidget());

//         // done
//         this.setState({ loading: false });
//     }

//     render() {

//         if (this.graph)
//             this.graph.render();

//         return (
//             <div class="canvas-graph" ref={this.container}>

//                 {this.state.loading && <div>Loading...</div>}

//                 <canvas ref={this.canvas} style={`opacity: ${this.state.loading ? 0 : 1}`} />

//             </div>
//         );
//     }

// }

export default CanvasGraph;