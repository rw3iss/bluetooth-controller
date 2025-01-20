import * as Plotly from 'plotly.js-dist';
import { Component } from 'preact';

import "./GraphWrapper.scss";

export interface GraphData {
    current: {
        isStarted: boolean;
        isPaused: boolean;
        timeStarted: Date | undefined;
        timeRunningMs: number;
        currentTemp: number;
        targetTemp: number;
        heaterOn: boolean;
        motorOn: boolean;
        exhaustOn: boolean;
        ejectOn: boolean;
        coolingOn: boolean;
    };
    data: Array<{
        time: string;
        temperature: number;
        motorSpeed: number;
        exhaustSpeed: number;
    }>;
    events: Array<{
        name: string;
        time: string;
    }>;
    markers: Array<{
        text: string;
        time: string;
    }>;
}

interface PlotlyWrapperProps {
    graphData: GraphData;
    layers: {
        temperature: boolean;
        motorSpeed: boolean;
        exhaustSpeed: boolean;
        events: boolean;
        markers: boolean;
    };
}

interface PlotlyWrapperState { }

class GraphWrapper extends Component<PlotlyWrapperProps, PlotlyWrapperState> {
    private plotRef: HTMLDivElement | null = null;
    private plot: Plotly.PlotlyHTMLElement | null = null;

    componentDidMount() {
        if (this.plotRef) {
            this.plot = Plotly.newPlot(this.plotRef, this.getPlotData(), this.getLayout(), this.getConfig());
        }
    }

    componentDidUpdate(prevProps: PlotlyWrapperProps) {
        if (this.plot && (prevProps.graphData !== this.props.graphData || prevProps.layers !== this.props.layers)) {
            Plotly.update(this.plot, this.getPlotData(), this.getLayout(), this.getConfig());
        }
    }

    getConfig = () => ({
        displayModeBar: false, // to avoid white modebar if it's visible
        responsive: true,
        dragmode: 'pan'
    });

    getLayout = () => ({
        font: {
            family: 'Coffee Menu'
        },
        title: {
            text: 'Data Visualization',
            font: {
                color: '#B0C4DE'
            } // Light Steel Blue for text
        },
        paper_bgcolor: '#123', // Dark background as requested
        plot_bgcolor: '#123', // Midnight Blue for plot area
        xaxis: {
            title: 'Time',
            type: 'date',
            color: '#B0C4DE', // Light Steel Blue for axis labels
            gridcolor: '#4682B4', // Steel Blue for grid lines
            linecolor: '#4682B4', // Steel Blue for axis lines
            zerolinecolor: '#4682B4', // Zero line color
        },
        yaxis: {
            title: 'Value',
            color: '#B0C4DE', // Light Steel Blue for axis labels
            gridcolor: '#4682B4', // Steel Blue for grid lines
            linecolor: '#4682B4', // Steel Blue for axis lines
            zerolinecolor: '#4682B4', // Zero line color
        },
        font: {
            color: '#B0C4DE' // Default text color
        }
    });

    getPlotData = () => {
        const { data, events, markers } = this.props.graphData;
        const { temperature, motorSpeed, exhaustSpeed } = this.props.layers;

        const traces: any = [];

        const lineColor = '#4169E1'; // Royal Blue for lines
        const markerColor = '#6495ED'; // Cornflower Blue for markers

        if (temperature) {
            traces.push({
                x: data.map(d => new Date(d.time)),
                y: data.map(d => d.temperature),
                type: 'scatter',
                mode: 'lines',
                name: 'Temperature',
                line: { color: lineColor }
            });
        }

        if (motorSpeed) {
            traces.push({
                x: data.map(d => new Date(d.time)),
                y: data.map(d => d.motorSpeed),
                type: 'scatter',
                mode: 'lines',
                name: 'Motor Speed',
                line: { color: lineColor }
            });
        }

        if (exhaustSpeed) {
            traces.push({
                x: data.map(d => new Date(d.time)),
                y: data.map(d => d.exhaustSpeed),
                type: 'scatter',
                mode: 'lines',
                name: 'Exhaust Speed',
                line: { color: lineColor }
            });
        }

        if (this.props.layers.events) {
            traces.push({
                x: events.map(e => new Date(e.time)),
                y: events.map(() => null),
                mode: 'markers',
                type: 'scatter',
                name: 'Events',
                text: events.map(e => e.name),
                marker: {
                    color: markerColor,
                    size: 12,
                    symbol: 'line-ns-open'
                }
            });
        }

        if (this.props.layers.markers) {
            traces.push({
                x: markers.map(m => new Date(m.time)),
                y: markers.map(() => null),
                mode: 'markers',
                type: 'scatter',
                name: 'Markers',
                text: markers.map(m => m.text),
                marker: {
                    color: markerColor,
                    size: 10,
                    symbol: 'circle-open'
                }
            });
        }

        return traces;
    };

    render() {
        return (
            <div class="graph-wrapper" ref={el => this.plotRef = el} style={{
                width: '100%',
                height: 'calc(100% - 50px)',
                backgroundColor: '#123' // Ensure background matches the plot's paper_bgcolor
            }} />
        );
    }
}

export default GraphWrapper;