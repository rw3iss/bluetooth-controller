import { FunctionalComponent } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { Graph, GraphLayer } from './Graph';
import { LayerManager } from './LayerManager';
import './GraphView.scss';
import { GraphOptions } from './GraphOptions.js';

interface GraphViewProps {
    layers: GraphLayer[];
}

export const GraphView: FunctionalComponent<{ layers: GraphLayer[] }> = ({ layers }: GraphViewProps) => {
    const graphContainerRef = useRef<HTMLDivElement>(null);
    const [graph, setGraph] = useState<Graph | null>(null);
    const [selectedItem, setSelectedItem] = useState<{ layerIndex: number; itemIndex: number } | null>(null);
    const [selectedTab, setSelectedTab] = useState(0);

    useEffect(() => {
        if (graphContainerRef.current) {
            const newGraph = new Graph(graphContainerRef.current, layers);
            setGraph(newGraph);

            newGraph.plotlyInstance.then(instance => {
                instance.on('plotly_click', handleGraphClick);
                instance.on('plotly_hover', handleGraphHover);
                instance.on('plotly_unhover', handleGraphUnhover);

                // const controlToggle = document.createElement('button');
                // controlToggle.textContent = 'Controls';
                // controlToggle.style.position = 'absolute';
                // controlToggle.style.right = '10px';
                // controlToggle.style.top = '10px';
                // controlToggle.style.zIndex = '1000';
                // controlToggle.addEventListener('click', () => newGraph.toggleControls());
                // graphContainerRef.current?.appendChild(controlToggle);

                // Cleanup function
                return () => {
                    instance.removeAllListeners('plotly_click');
                    instance.removeAllListeners('plotly_hover');
                    instance.removeAllListeners('plotly_unhover');
                    //graphContainerRef.current?.removeChild(controlToggle);
                };
            });
        }
    }, [layers]);

    const handleIntervalChange = (interval: number, average: boolean) => {
        if (graph) {
            graph.changeInterval(interval, average);
        }
    };
    const handleGraphClick = (data: any) => {
        if (data.points && data.points.length > 0) {
            const point = data.points[0];
            setSelectedItem({ layerIndex: point.curveNumber, itemIndex: point.pointNumber });
        }
    };

    const handleGraphHover = (data: any) => {
        if (data.points && data.points.length > 0) {
            const point = data.points[0];
            graph?.updateHighlight(point.curveNumber, point.pointNumber);
        }
    };

    const handleGraphUnhover = () => {
        graph?.updateHighlight(selectedItem?.layerIndex || 0);
    };

    const handleSelect = (index: number) => {
        setSelectedTab(index);
    };

    return (
        <div style={{ position: 'relative' }} class="graph-view">
            <div class="graph-wrapper" ref={graphContainerRef} style={{ width: '100%', minHeight: '400px', height: '50vh' }} />
            {graph && <GraphOptions onIntervalChange={handleIntervalChange} />}
            {graph &&
                <LayerManager
                    layers={layers}
                    graph={graph}
                    selectedTab={selectedTab}
                    onSelect={handleSelect}
                />
            }
        </div>
    );
};

export default GraphView;