import * as Plotly from 'plotly.js-dist';
import { filterDataByInterval, formatTime } from './graphUtils.js';
import { GraphViewOptions } from './GraphView';

export interface GraphLayer {
    type: 'data' | 'markers' | 'events';
    name: string;
    data: Array<{ time: number; value?: number; text?: string }>;
    color?: string;
    dash?: boolean;
    width?: number;
    colName?: string;
}

export interface DataPoint {
    time: number;
    value?: number;
    text?: string;
}

export class Graph {
    public plotlyInstance: Promise<Plotly.PlotlyHTMLElement>;
    private layers: GraphLayer[];
    private showControls: boolean = false;
    private maxTime: number;
    private resizeObserver: ResizeObserver;

    constructor(private container: HTMLDivElement, private originalLayers: GraphLayer[], private graphOptions: GraphViewOptions) {
        this.layers = [...originalLayers]; // Create a copy of the original layers
        this.plotlyInstance = this.createGraph();


        // Set up ResizeObserver
        this.resizeObserver = new ResizeObserver(entries => {
            console.log(`resize`, entries)
            for (let entry of entries) {
                if (entry.contentRect) {
                    this.updateGraphSize(entry.contentRect.height, entry.contentRect.width);
                }
            }
        });
        this.resizeObserver.observe(this.container);
    }

    private async createGraph(): Promise<Plotly.PlotlyHTMLElement> {
        //console.log(`createGraph()`, this.graphOptions)
        const data = this.layers.filter(layer => layer.type !== 'markers' && layer.type !== 'events').map((layer, index) => {
            return {
                x: layer.data.map(item => item.time),
                y: layer.data.map(item => item.value),
                mode: 'lines',
                type: 'scatter',
                line: {
                    color: layer.color,
                    width: layer.width,
                    dash: layer.dash
                },
                name: layer.name,
                visible: this.graphOptions.layers[layer.name],
                showlegend: false,
                hovertemplate: `<b>%{y:.0f}</b>`
            };
        });

        // Collect annotations for markers and events
        const annotations: Partial<Plotly.Annotation>[] = this.layers.filter(layer => ['markers', 'events'].includes(layer.type)).flatMap(layer => {
            return layer.data.map(item => {
                return {
                    x: item.time,
                    y: 0.5, // Middle of y-axis for visibility
                    xref: 'x',
                    yref: 'paper',
                    text: item.text || layer.type, // Default text if no text provided
                    showarrow: false,
                    ax: 0,
                    ay: -40, // Adjust this to position the tooltip
                    visible: this.graphOptions.layers[layer.name],
                    // Custom styling for tooltip
                    font: {
                        size: 10,
                        color: '#ffffff',
                        weight: '600'
                    },
                    bgcolor: layer.color, // Use layer color for background
                    borderwidth: 0,
                    borderpad: 4,
                    opacity: 1
                };
            });
        });

        // Collect shapes for markers and events
        const shapes: Partial<Plotly.Shape>[] = this.layers.filter(layer => ['markers', 'events'].includes(layer.type)).flatMap(layer => {
            return layer.data.map(item => {
                return {
                    type: 'line',
                    xref: 'x',
                    yref: 'paper',
                    x0: item.time,
                    y0: 0,
                    x1: item.time,
                    y1: 1,
                    line: {
                        color: layer.color,
                        width: 2,
                        dash: 'solid'
                    },
                    visible: this.graphOptions.layers[layer.name]
                };
            });
        });

        this.maxTime = Math.max(...this.layers.flatMap(layer => layer.data.map(item => item.time)));
        const maxTemp = Math.max(...this.layers.flatMap(layer => layer.data.map(item => item.value || 0)));
        const tickDiv = this.graphOptions.timeInterval < 10 ? 15 : this.graphOptions.timeInterval; // default tick val is 15, lowest val we let is 10.
        const tickVals = Array.from({ length: Math.ceil(this.maxTime / tickDiv) + 1 }, (_, i) => i * tickDiv);
        const tickText = tickVals.map(formatTime);

        const layout: Partial<Plotly.Layout> = {
            title: {
                text: 'Roast History',
                pad: { t: 5 },
                font: {
                    weight: 900
                }
            },
            paper_bgcolor: '#001f3f',
            plot_bgcolor: '#001f3f',
            margin: { t: 40, r: 0, b: 50, l: 50 },
            xaxis: {
                title: {
                    font: {
                        size: 14, weight: 900
                    },
                    text: 'Time',
                    xanchor: 'left',
                    x: 0,
                    y: -15,
                    standoff: 15,
                    // Ensure the title is not centered
                    side: 'bottom'
                },
                type: 'linear',
                autorange: false,
                //fixedrange: true,
                range: [0, this.maxTime + 50],
                tickfont: { size: 10 },
                gridcolor: '#234',
                linecolor: '#666666',
                tickcolor: '#666666',
                tickvals: tickVals,
                ticktext: tickText,
                minallowed: 0,
                maxallowed: this.maxTime + 50
            },
            yaxis: {
                title: 'Temperature',
                type: 'linear',
                autorange: false,
                //fixedrange: true,
                range: [0, maxTemp + 10],
                titlefont: { size: 14, weight: 900 },
                tickfont: { size: 10 },
                gridcolor: '#234',
                linecolor: '#666666',
                tickcolor: '#666666',
                minallowed: 0,
                maxallowed: maxTemp
            },
            font: {
                color: '#abc' // White text for better visibility on dark background
            },
            hovermode: 'closest',
            showlegend: false,
            dragmode: 'pan', // Disable drag mode entirely
            shapes: shapes,
            annotations: annotations
        };

        const config: Partial<Plotly.Config> = {
            responsive: true,
            displaylogo: false,
            scrollZoom: true, // Enable zoom with mouse wheel
            displayModeBar: this.showControls,
            modeBarButtonsToRemove: ['zoom2d', 'zoomIn2d', 'zoomOut2d', 'pan2d', 'select2d', 'lasso2d'],
            doubleClick: 'reset',
            editable: false // Prevent any editing of the graph
        };

        const plotlyInstance = await Plotly.newPlot(this.container, data, layout, config);

        this.updateData();

        // Store reference to shapes for later manipulation
        //this.plotlyInstance = Promise.resolve(plotlyInstance);

        return plotlyInstance;
    }

    private async updateGraphSize(newHeight: number, newWidth: number) {
        const instance = await this.plotlyInstance;
        Plotly.relayout(instance, { height: newHeight, width: newWidth });
    }

    // Update toggleLayerVisibility to handle annotations
    public async toggleLayerVisibility(layerName: string, visible: boolean) {
        const instance = await this.plotlyInstance;
        const layerIndex = this.layers.findIndex(l => l.name == layerName);
        const layer = this.layers[layerIndex];
        if (layer) {
            if (['markers', 'events'].includes(layer.type)) {
                // For markers and events, we need to update the annotations
                const annotations = instance.layout.annotations as Partial<Plotly.Annotation>[];
                annotations.filter(annotation => annotation.bgcolor === layer.color).forEach(annotation => {
                    annotation.visible = visible;
                });
                const shapes = instance.layout.shapes as Partial<Plotly.Annotation>[];
                shapes.filter(shape => shape.line.color === layer.color).forEach(shape => {
                    shape.visible = visible;
                });

                Plotly.relayout(instance, { annotations, shapes });
            } else {
                // For data layers, we use restyle
                Plotly.restyle(instance, { visible }, [layerIndex]);
            }
        }
    }

    // Method to update data based on interval
    private async updateData() {
        this.layers = this.originalLayers.map(layer => {
            if (layer.type === 'data') {
                return {
                    ...layer,
                    data: filterDataByInterval(layer.data, this.graphOptions.timeInterval, this.graphOptions.isAveraged)
                };
            }
            return layer;
        });
        await this.redrawGraph();
    }

    // Method to redraw the graph with updated data
    public async redrawGraph() {
        const instance = await this.plotlyInstance;
        const data = this.layers.filter(layer => layer.type !== 'markers' && layer.type !== 'events').map((layer, index) => {
            return {
                x: layer.data.map(item => item.time),
                y: layer.data.map(item => item.value),
                mode: 'lines',
                type: 'scatter',
                line: {
                    color: layer.color,
                    width: layer.width,
                    dash: layer.dash
                },
                name: layer.name,
                visible: this.graphOptions.layers[layer.name]
            };
        });

        const annotations = this.layers.filter(layer => ['markers', 'events'].includes(layer.type)).flatMap(layer => {
            return layer.data.map(item => {
                return {
                    x: item.time,
                    y: 0.5,
                    xref: 'x',
                    yref: 'paper',
                    text: item.text || layer.type,
                    showarrow: false,
                    ax: 0,
                    ay: -40,
                    font: {
                        size: 12,
                        color: '#ffffff'
                    },
                    bgcolor: layer.color,
                    bordercolor: '#ffffff',
                    borderwidth: 2,
                    borderpad: 4,
                    opacity: 0.8,
                    visible: this.graphOptions.layers[layer.name]
                };
            });
        });

        // Update the layout with new annotations
        const layout = {
            ...instance.layout,
            annotations: annotations
        };

        //const maxTime = Math.max(...this.layers.flatMap(layer => layer.data.map(item => item.time)));

        const tickDiv = this.graphOptions.timeInterval < 10 ? 15 : this.graphOptions.timeInterval;
        const tickVals = Array.from({ length: Math.ceil(this.maxTime / tickDiv) + 1 }, (_, i) => i * tickDiv);
        const tickText = tickVals.map(formatTime);

        layout.xaxis.tickvals = tickVals;
        layout.xaxis.ticktext = tickText;

        // Redraw the graph with updated data and layout
        Plotly.react(instance, data, layout);
        Plotly.restyle(instance, data, layout);
    }

    // Public method to change interval
    public intervalChanged(timeInterval, isAveraged) {
        this.graphOptions.timeInterval = timeInterval;
        this.graphOptions.isAveraged = isAveraged;
        //console.log(`interval changed`, this.graphOptions)
        this.updateData();
    }

    public async toggleControls() {
        this.showControls = !this.showControls;
        const instance = await this.plotlyInstance;
        Plotly.relayout(instance, { 'modebar.display': this.showControls });
    }

    public async updateHighlight(traceIndex: number, pointIndex?: number) {
        const instance = await this.plotlyInstance;
        if (pointIndex !== undefined) {
            Plotly.restyle(instance, {
                'marker.color': [[this.layers[traceIndex].color || '#ff0000', ...Array(this.layers[traceIndex].data.length - 1).fill(this.layers[traceIndex].color || '#0000ff')]],
                'marker.size': [[10, ...Array(this.layers[traceIndex].data.length - 1).fill(5)]]
            }, [traceIndex]);
        } else {
            Plotly.restyle(instance, {
                'marker.color': Array(this.layers[traceIndex].data.length).fill(this.layers[traceIndex].color || '#ff0000'),
                'marker.size': Array(this.layers[traceIndex].data.length).fill(10)
            }, [traceIndex]);
        }
    }
}