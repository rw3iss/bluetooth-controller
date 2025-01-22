import { Component } from 'preact';
import { useState } from 'preact/hooks';
import { Graph, GraphLayer } from './Graph';

interface LayerManagerProps {
    layers: GraphLayer[];
    graph: Graph;
    selectedTab: number;
    onSelect: (index: number) => void;
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

    toggleLayerVisibility = (index: number, visible: boolean) => {
        const newVisibility = [...this.state.visibility];
        newVisibility[index] = visible;
        this.setState({ visibility: newVisibility });
        this.props.graph.updateLayerVisibility(index, visible);
    };

    render() {
        const { layers, selectedTab, onSelect } = this.props;
        const { visibility } = this.state;

        return (
            <div class="layers">
                <div class="tabs" style={{ marginBottom: '10px' }}>
                    {layers.map((layer, index) => (
                        <CheckButton
                            key={index}
                            label={['Data 1', 'Data 2', 'Markers', 'Events'][index]}
                            onSelect={() => onSelect(index)}
                            onVisibilityChange={(visible) => this.toggleLayerVisibility(index, visible)}
                            visible={visibility[index]}
                        />
                    ))}
                </div>
                <div class="table">
                    {layers[selectedTab] && (
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
                    )}
                </div>
            </div>
        );
    }
}

interface CheckButtonProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

import { FunctionalComponent } from 'preact';

interface CheckButtonProps {
    label: string;
    onSelect: () => void;
    onVisibilityChange: (checked: boolean) => void;
    visible: boolean;
}

export const CheckButton: FunctionalComponent<CheckButtonProps> = ({ label, onSelect, onVisibilityChange, visible }) => {
    const [isChecked, setIsChecked] = useState(visible);

    const handleClick = () => {
        onSelect();
    };

    const handleChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        setIsChecked(target.checked);
        onVisibilityChange(target.checked);
    };

    return (
        <div style={{ display: 'inline-block', marginRight: '10px' }}>
            <button
                onClick={handleClick}
                style={{
                    padding: '5px 10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    backgroundColor: 'white'
                }}
            >
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleChange}
                    style={{ marginRight: '5px', verticalAlign: 'middle' }}
                />
                {label}
            </button>
        </div>
    );
};