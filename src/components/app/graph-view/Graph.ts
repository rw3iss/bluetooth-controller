import * as Plotly from 'plotly.js-dist';
import { filterDataByInterval, formatTime } from './graphUtils.js';

export interface GraphLayer {
    type: 'data' | 'markers' | 'events';
    data: Array<{ time: number; value?: number; text?: string }>;
    color?: string;
    dash?: boolean;
    width?: number;
    name?: string;
    unitName?: string;
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
    private currentInterval: number = 5; // Default interval
    private isAveraged: boolean = false;
    private maxTime: number;
    private resizeObserver: ResizeObserver;

    constructor(private container: HTMLDivElement, private originalLayers: GraphLayer[]) {
        this.layers = [...originalLayers]; // Create a copy of the original layers
        this.plotlyInstance = this.createGraph();


        // Set up ResizeObserver
        this.resizeObserver = new ResizeObserver(entries => {
            console.log(`resize`, entries)
            for (let entry of entries) {
                if (entry.contentRect) {
                    this.updateGraphSize(entry.contentRect.height);
                }
            }
        });
        this.resizeObserver.observe(this.container);
    }

    private async createGraph(): Promise<Plotly.PlotlyHTMLElement> {
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
                visible: true,
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
                    visible: true,
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
                    visible: true
                };
            });
        });

        this.maxTime = Math.max(...this.layers.flatMap(layer => layer.data.map(item => item.time)));
        const maxTemp = Math.max(...this.layers.flatMap(layer => layer.data.map(item => item.value || 0)));
        const tickDiv = this.currentInterval < 15 ? 20 : this.currentInterval;
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
                title: 'Time',
                type: 'linear',
                autorange: false,
                //fixedrange: true,
                range: [0, this.maxTime + 50],
                titlefont: { size: 14, weight: 900 },
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

        // Store reference to shapes for later manipulation
        //this.plotlyInstance = Promise.resolve(plotlyInstance);

        return plotlyInstance;
    }

    private async updateGraphSize(newHeight: number) {
        const instance = await this.plotlyInstance;
        Plotly.relayout(instance, { height: newHeight });
    }

    // private handleZoom = (eventData: any) => {
    //     console.log(`zoom`)
    //     const { 'xaxis.range[0]': xMin, 'xaxis.range[1]': xMax, 'yaxis.range[0]': yMin, 'yaxis.range[1]': yMax } = eventData;

    //     // Define your min and max zoom levels here
    //     const minZoomX = 60; // Example: 1 minute minimum zoom level
    //     const maxZoomX = this.layers.flatMap(layer => layer.data.map(item => item.time)).reduce((a, b) => Math.max(a, b), 0);
    //     const minZoomY = 10; // Example: minimum y-axis range
    //     const maxZoomY = Math.max(...this.layers.flatMap(layer => layer.data.map(item => item.value || 0)));

    //     // Check and adjust x-axis zoom
    //     if (xMax - xMin < minZoomX) {
    //         Plotly.relayout(this.plotlyInstance, { 'xaxis.range': [xMin, xMin + minZoomX] });
    //     } else if (xMax - xMin > maxZoomX) {
    //         Plotly.relayout(this.plotlyInstance, { 'xaxis.range': [0, maxZoomX] });
    //     }

    //     // Check and adjust y-axis zoom
    //     if (yMax - yMin < minZoomY) {
    //         Plotly.relayout(this.plotlyInstance, { 'yaxis.range': [yMin, yMin + minZoomY] });
    //     } else if (yMax - yMin > maxZoomY) {
    //         Plotly.relayout(this.plotlyInstance, { 'yaxis.range': [0, maxZoomY] });
    //     }
    // }

    // Update toggleLayerVisibility to handle annotations
    public async toggleLayerVisibility(layerIndex: number, visible: boolean) {
        const instance = await this.plotlyInstance;
        if (layerIndex < this.layers.length) {
            const layer = this.layers[layerIndex];
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
    private updateData(interval: number, average: boolean) {
        this.layers = this.originalLayers.map(layer => {
            if (layer.type === 'data') {
                return {
                    ...layer,
                    data: filterDataByInterval(layer.data, interval, average)
                };
            }
            return layer;
        });
        this.currentInterval = interval;
        this.isAveraged = average;
        this.redrawGraph();
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
                visible: true
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
                    visible: true
                };
            });
        });

        // Update the layout with new annotations
        const layout = {
            ...instance.layout,
            annotations: annotations
        };

        //const maxTime = Math.max(...this.layers.flatMap(layer => layer.data.map(item => item.time)));
        const tickDiv = this.currentInterval < 15 ? 20 : this.currentInterval;
        const tickVals = Array.from({ length: Math.ceil(this.maxTime / tickDiv) + 1 }, (_, i) => i * tickDiv);
        const tickText = tickVals.map(formatTime);

        layout.xaxis.tickvals = tickVals;
        layout.xaxis.ticktext = tickText;

        // Redraw the graph with updated data and layout
        Plotly.react(instance, data, layout);
    }

    // Public method to change interval
    public changeInterval(interval: number, average: boolean) {
        this.updateData(interval, average);
    }

    public async toggleControls() {
        this.showControls = !this.showControls;
        const instance = await this.plotlyInstance;
        Plotly.relayout(instance, { 'modebar.display': this.showControls });
    }

    public async updateLayerVisibility(index: number, visible: boolean) {
        const instance = await this.plotlyInstance;
        Plotly.restyle(instance, { visible: visible ? true : 'legendonly' }, [index]);
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