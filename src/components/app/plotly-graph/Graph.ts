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
        const data = this.layers.map((layer, index) => {
            const trace: Partial<Plotly.ScatterData> = {
                x: layer.data.map(item => item.time),
                mode: layer.type === 'data' ? 'lines' : 'lines',
                line: {
                    width: layer.type === 'data' ? 1 : 2,
                    color: layer.color || '#0000ff',
                    dash: layer.type === 'markers' ? 'dash' : 'solid',
                    shape: layer.type === 'data' ? 'spline' : 'linear',
                    simplify: false
                },
                hoverinfo: layer.type === 'data' ? 'x+y' : layer.type === 'markers' ? 'text' : 'none',
                editable: false // Prevent line editing (dragging)
            };

            if (layer.type === 'data') {
                trace.y = layer.data.map(item => item.value);
            } else {
                trace.x = layer.data.map(item => item.time);//Array(100).fill(layer.data.map);
                trace.text = layer.data.map(item => item.text || '');
                trace.hoverlabel = { bgcolor: 'white', bordercolor: 'black', font: { color: 'black' } };
            }

            return trace;
        });

        const maxTime = Math.max(...this.layers.flatMap(layer => layer.data.map(item => item.time)));
        const maxTemp = Math.max(...this.layers.flatMap(layer => layer.data.map(item => item.value || 0)));
        // Generate tick values every 15 seconds
        const tickVals = Array.from({ length: Math.ceil(maxTime / 15) + 1 }, (_, i) => i * 15);
        // Format each tick value
        const tickText = tickVals.map(formatTime);


        const layout: Partial<Plotly.Layout> = {
            title: {
                text: 'Roast History',
                // Reduce spacing above the title
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
            dragmode: false // Disable drag mode entirely
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


        // Create the graph
        const plotlyInstance = await Plotly.newPlot(this.container, data, layout, config);

        // Set up event listeners for zooming
        //plotlyInstance.on('plotly_relayout', this.handleZoom.bind(this));

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