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
        // Update visibility in Graph
        this.props.graph.toggleLayerVisibility(index, visible);
        // Update local state which will trigger re-render
        this.setState(prevState => {
            const newVisibility = [...prevState.visibility];
            newVisibility[index] = visible;
            return { visibility: newVisibility };
        });
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
                            label={layer.name || 'Data'}
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
    onSelect: () => void;
    onVisibilityChange: (checked: boolean) => void;
    visible: boolean;
}

import { FunctionalComponent } from 'preact';

interface CheckButtonProps {
    label: string;
    onSelect: () => void;
    onVisibilityChange: (checked: boolean) => void;
    visible: boolean;
}

export const CheckButton: FunctionalComponent<CheckButtonProps> = ({ label, onSelect, onVisibilityChange, visible }) => {
    // Use local state to manage the checkbox state
    const [isChecked, setIsChecked] = useState(visible);

    // Handle click on the button
    const handleClick = (e) => {
        if (e.target.type == 'checkbox') return;
        onSelect();
    };

    // Handle change on the checkbox
    const handleCheck = (e: Event) => {
        const target = e.target as HTMLInputElement;
        setIsChecked(target.checked);
        onVisibilityChange(target.checked);
    };

    return (
        <div class="check-button button"
            onClick={handleClick}
            style={{ display: 'flex', flex: '1', marginRight: '10px' }}>
            <div
                style={{
                }}
            >
                {label}
            </div>
            <input class="checkbox"
                type="checkbox"
                checked={isChecked} // Use state for checked prop
                onChange={handleCheck}
                style={{ marginRight: '5px', verticalAlign: 'middle' }}
            />
        </div>
    );
};