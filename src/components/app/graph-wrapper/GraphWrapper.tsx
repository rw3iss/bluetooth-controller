import * as Plotly from 'plotly.js-dist';
import { Component } from 'preact';

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
            this.plot = Plotly.newPlot(this.plotRef, this.getPlotData(), this.getLayout());
        }
    }

    componentDidUpdate(prevProps: PlotlyWrapperProps) {
        if (this.plot && prevProps.graphData !== this.props.graphData || prevProps.layers !== this.props.layers) {
            Plotly.update(this.plot, this.getPlotData(), this.getLayout());
        }
    }

    getPlotData = () => {
        const { data, events, markers } = this.props.graphData;
        const { temperature, motorSpeed, exhaustSpeed } = this.props.layers;

        const traces = [];

        if (temperature) {
            traces.push({
                x: data.map(d => new Date(d.time)),
                y: data.map(d => d.temperature),
                type: 'scatter',
                mode: 'lines',
                name: 'Temperature'
            });
        }

        if (motorSpeed) {
            traces.push({
                x: data.map(d => new Date(d.time)),
                y: data.map(d => d.motorSpeed),
                type: 'scatter',
                mode: 'lines',
                name: 'Motor Speed'
            });
        }

        if (exhaustSpeed) {
            traces.push({
                x: data.map(d => new Date(d.time)),
                y: data.map(d => d.exhaustSpeed),
                type: 'scatter',
                mode: 'lines',
                name: 'Exhaust Speed'
            });
        }

        if (this.props.layers.events) {
            traces.push({
                x: events.map(e => new Date(e.time)),
                y: events.map(() => null), // Placeholder for y-axis since events have no numerical value
                mode: 'markers',
                type: 'scatter',
                name: 'Events',
                text: events.map(e => e.name),
                marker: { size: 12, symbol: 'line-ns-open' }
            });
        }

        if (this.props.layers.markers) {
            traces.push({
                x: markers.map(m => new Date(m.time)),
                y: markers.map(() => null), // Similar to events, no numerical y value
                mode: 'markers',
                type: 'scatter',
                name: 'Markers',
                text: markers.map(m => m.text),
                marker: { size: 10, symbol: 'circle-open' }
            });
        }

        return traces;
    };

    getLayout = () => ({
        title: 'Data Visualization',
        xaxis: {
            title: 'Time',
            type: 'date'
        },
        yaxis: {
            title: 'Value'
        }
    });

    render() {
        return (
            <div ref={el => this.plotRef = el} style={{ width: '100%', height: '400px' }} />
        );
    }
}

export default GraphWrapper;