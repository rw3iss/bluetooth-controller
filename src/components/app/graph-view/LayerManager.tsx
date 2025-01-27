import { CheckButton } from 'components/basic/check-button/CheckButton.js';
import { Component } from 'preact';
import { Graph, GraphLayer } from './Graph';
import { formatTemp, formatTime } from './graphUtils.js';
import { GraphViewOptions } from './GraphView';

interface LayerManagerProps {
    layers: GraphLayer[];
    graph: Graph;
    options: GraphViewOptions;
    //selectedTab: number;
    onToggleLayerVisibility: (name: string, visible: boolean) => void;
}

interface LayerManagerState {
    visibility: boolean[];
}

export class LayerManager extends Component<LayerManagerProps, LayerManagerState> {

    constructor(props: LayerManagerProps) {
        super(props);
        this.state = {
            visibility: props.layers.map(() => true) // Initially all layers are visible
        };
    }

    toggleLayerVisibility = (name: string, visible: boolean) => {
        // Update visibility in Graph
        this.props.graph.toggleLayerVisibility(name, visible);
        this.props.onToggleLayerVisibility(name, visible);
        // Update local state which will trigger re-render
        // this.setState(prevState => {
        //     const newVisibility = [...prevState.visibility];
        //     newVisibility[index] = visible;
        //     return { visibility: newVisibility };
        // });
    };


    render() {
        const { layers, options } = this.props;

        return (
            <div class="layers">

                <div class="tab-columns">
                    {layers.map((layer: GraphLayer, index) => (
                        <div class="column">
                            <CheckButton
                                key={index}
                                label={layer.name || 'Data'}
                                checkOnClick={true}
                                onCheck={(visible) => this.toggleLayerVisibility(layer.name, visible)}
                                checked={options.layers[layer.name]}
                            />
                            <div class="table">
                                <table>
                                    <thead>
                                        <tr>
                                            {/* <th class="index">#</th> */}
                                            <th class="time">Time</th>
                                            <th class="value">{layer.colName /*layer.type === 'data' ? 'Value' : 'Text'*/}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {layer.data.map((item, itemIndex) => (
                                            <tr key={itemIndex}>
                                                {/* <td class="index">{itemIndex}</td> */}
                                                <td class="time">{formatTime(item.time)}</td>
                                                <td class="value">{(item.value ? formatTemp(item.value) : item.text)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>

                {/* {layers[selectedTab] && (
                        <table>
                            <thead>
                                <tr>
                                    <th>Index</th>
                                    <th>Time</th>
                                    <th>{layers[selectedTab].type === 'data' ? 'Value' : 'Text'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {layers[selectedTab].data.map((item, itemIndex) => (
                                    <tr key={itemIndex}>
                                        <td>{itemIndex}</td>
                                        <td>{item.time}</td>
                                        <td>{item.value || item.text}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )} */}

            </div>
        );
    }
}
