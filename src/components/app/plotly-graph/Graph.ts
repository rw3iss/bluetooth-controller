import * as Plotly from 'plotly.js-dist';

// Helper function to format seconds into "XhYmZs" format, excluding '0' values
function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    let result = '';
    if (hours > 0) result += `${hours}h`;
    if (minutes > 0) result += `${minutes}m`;
    if (secs > 0 || (hours === 0 && minutes === 0)) result += `${secs}s`;

    return result;
}

export interface GraphLayer {
    type: 'data' | 'markers' | 'events';
    data: Array<{ time: number; value?: number; text?: string }>;
    color?: string;
}

interface DataPoint {
    time: number;
    value?: number;
    text?: string;
}

export class Graph {
    private plotlyInstance: Promise<Plotly.PlotlyHTMLElement>;
    private layers: GraphLayer[];
    private showControls: boolean = false;

    constructor(private container: HTMLDivElement, layers: GraphLayer[]) {
        this.layers = layers;
        this.plotlyInstance = this.createGraph();
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
                visible: true // Initially all layers are visible
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
                    text: item.text || 'Event', // Default text if no text provided
                    showarrow: false,
                    ax: 0,
                    ay: -40, // Adjust this to position the tooltip
                    visible: true,
                    // Custom styling for tooltip
                    font: {
                        size: 12,
                        color: '#ffffff'
                    },
                    bgcolor: layer.color, // Use layer color for background
                    bordercolor: '#ffffff',
                    borderwidth: 2,
                    borderpad: 4,
                    opacity: 0.8
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

        const maxTime = Math.max(...this.layers.flatMap(layer => layer.data.map(item => item.time)));
        const maxTemp = Math.max(...this.layers.flatMap(layer => layer.data.map(item => item.value || 0)));
        const tickVals = Array.from({ length: Math.ceil(maxTime / 15) + 1 }, (_, i) => i * 15);
        const tickText = tickVals.map(formatTime);

        const layout: Partial<Plotly.Layout> = {
            title: {
                text: 'Roast History',
                pad: { t: 5 }
            },
            paper_bgcolor: '#123',
            plot_bgcolor: '#234',
            margin: { t: 40, r: 10, b: 80, l: 60 },
            xaxis: {
                title: 'Time',
                type: 'linear',
                autorange: false,
                //fixedrange: true,
                range: [0, maxTime + 50],
                titlefont: { size: 14 },
                tickfont: { size: 10 },
                gridcolor: '#444444',
                linecolor: '#666666',
                tickcolor: '#666666',
                tickvals: tickVals,
                ticktext: tickText,
                minallowed: 0,
                maxallowed: maxTime + 50
            },
            yaxis: {
                title: 'Temp',
                type: 'linear',
                autorange: false,
                //fixedrange: true,
                range: [0, maxTemp + 10],
                titlefont: { size: 14 },
                tickfont: { size: 10 },
                gridcolor: '#444444',
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
            dragmode: false, // Disable drag mode entirely
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
        this.plotlyInstance = Promise.resolve(plotlyInstance);
        return plotlyInstance;
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
                Plotly.relayout(instance, { annotations: annotations });
            } else {
                // For data layers, we use restyle
                Plotly.restyle(instance, { visible: visible }, [layerIndex]);
            }
        }
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