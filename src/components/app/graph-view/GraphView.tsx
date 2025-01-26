import { FunctionalComponent } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { Graph, GraphLayer } from './Graph';
import { GraphOptions } from './GraphOptions.js';
import './GraphView.scss';
import { LayerManager } from './LayerManager';

export interface LayerViewProps {
    visible: boolean;
}

export interface GraphViewOptions {
    isExpanded: boolean;
    timeInterval: number;
    isAveraged: boolean;
    layers: LayerViewProps;
}

interface GraphViewProps {
    layers: GraphLayer[];       // layer data
    options: GraphViewOptions;  // view options
    onOptionChange: (o, v) => void;
    onLayerChange: (i, v) => void;
}

export const GraphView: FunctionalComponent<GraphViewProps> = ({ layers, options, onOptionChange, onLayerChange }: GraphViewProps) => {
    const graphContainerRef = useRef<HTMLDivElement>(null);
    const [graph, setGraph] = useState<Graph | null>(null);
    //const [selectedItem, setSelectedItem] = useState<{ layerIndex: number; itemIndex: number } | null>(null);
    //const [selectedTab, setSelectedTab] = useState(0);

    useEffect(() => {
        if (graphContainerRef.current) {
            const newGraph = new Graph(graphContainerRef.current, layers, options);
            setGraph(newGraph);
            // newGraph.plotlyInstance.then(instance => {
            //     //instance.on('plotly_click', handleGraphClick);
            //     // instance.on('plotly_hover', handleGraphHover);
            //     // instance.on('plotly_unhover', handleGraphUnhover);

            //     // const controlToggle = document.createElement('button');
            //     // controlToggle.textContent = 'Controls';
            //     // controlToggle.style.position = 'absolute';
            //     // controlToggle.style.right = '10px';
            //     // controlToggle.style.top = '10px';
            //     // controlToggle.style.zIndex = '1000';
            //     // controlToggle.addEventListener('click', () => newGraph.toggleControls());
            //     // graphContainerRef.current?.appendChild(controlToggle);

            //     // Cleanup function
            //     return () => {
            //         instance.removeAllListeners('plotly_click');
            //         // instance.removeAllListeners('plotly_hover');
            //         // instance.removeAllListeners('plotly_unhover');
            //         //graphContainerRef.current?.removeChild(controlToggle);
            //     };
            // });
        }
    }, [layers]);

    const handleOptionChange = async (o: string, v: any) => {
        onOptionChange(o, v);
        if (graph && o == 'timeInterval') graph.intervalChanged(v, options.isAveraged);
        if (graph && o == 'isAveraged') graph.intervalChanged(options.timeInterval, v);
    };

    /*
        // const handleGraphClick = (data: any) => {
        //     if (data.points && data.points.length > 0) {
        //         const point = data.points[0];
        //         setSelectedItem({ layerIndex: point.curveNumber, itemIndex: point.pointNumber });
        //     }
        // };

        // const handleGraphHover = (data: any) => {
        //     if (data.points && data.points.length > 0) {
        //         const point = data.points[0];
        //         graph?.updateHighlight(point.curveNumber, point.pointNumber);
        //     }
        // };

        // const handleGraphUnhover = () => {
        //     graph?.updateHighlight(selectedItem?.layerIndex || 0);
        // };
    */

    const onToggleLayerVisibility = (name: string, visible: boolean) => {
        console.log(`onToggleLayerVisibility`, name, visible)
        //setSelectedTab(index);
        onLayerChange(name, visible);
    };

    return (
        <div class={`${options.isExpanded ? 'expanded' : ''} graph-view`}>
            <div class="graph-wrapper" ref={graphContainerRef} style={{ width: '100%', minHeight: '400px', height: options.isExpanded ? 'auto' : '50%' }} />
            {graph && <GraphOptions options={options} onOptionChange={handleOptionChange} />}
            {graph &&
                <LayerManager
                    graph={graph}
                    layers={layers}
                    options={options}
                    //selectedTab={selectedTab}
                    onToggleLayerVisibility={onToggleLayerVisibility}
                />
            }
        </div>
    );
};

export default GraphView;