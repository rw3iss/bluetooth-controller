import { GraphLayer } from './Graph';
import { DataPoint } from "./Graph.js";

export const graphConfig = {
    style: 'line',
    axes: {
        x: {
            title: "Time"
        },
        y: {
            title: "Value"
        }
    },
    layers: [
        { id: "temp", visible: true, color: "yellow" },
        { id: "other", visible: true, color: "blue" }
    ]
}


const totalSeconds = 15 * 60; // 15 minutes in seconds

export function generateCurvedTemperatureData(totalSeconds: number): Array<{ time: number; value: number }> {
    return Array.from({ length: totalSeconds }, (_, index) => {
        const time = index; // Time in seconds
        const maxTemp = 400; // Maximum temperature in Fahrenheit, adjusted to 400F
        const baseTemp = 0; // Starting temperature

        // Use a sigmoid-like function for a curved temperature increase
        // This function starts slow, rises quickly in the middle, then tapers off
        const k = 0.005; // Control the steepness of the curve
        const temperature = maxTemp / (1 + Math.exp(-k * (index - totalSeconds / 2))) + (Math.random() - 0.5) * 5;

        // Clamp the temperature to ensure it stays between baseTemp and maxTemp
        const finalTemperature = Math.min(maxTemp, Math.max(baseTemp, temperature));

        return { time, value: finalTemperature };
    });
}

export function graphData() {
    const layers: GraphLayer[] = [
        {
            name: 'Temperature',
            unitName: 'Temp',
            type: 'data',
            data: generateCurvedTemperatureData(totalSeconds),
            color: '#fcba03',
        },
        // {
        //     name: 'Data 2',
        //     type: 'data',
        //     data: generateCurvedTemperatureData(totalSeconds),
        //     color: '#03adfc'
        // },
        {
            name: 'Markers',
            unitName: 'Marker',
            type: 'markers',
            data: [
                { time: 120, text: 'Event A' },
                { time: 380, text: 'Event B' }
            ],
            color: 'rgb(209, 199, 106)',
            dash: true,
            width: 2
        },
        {
            name: 'Events',
            unitName: 'Event',
            type: 'events',
            data: [
                { time: 200, text: 'Major Update' },
                { time: 400, text: 'System Overload' }
            ],
            color: 'rgb(100, 212, 178)',
            dash: false,
            width: 1
        }
    ];
    return layers;
}

export const formatTemp = (v) => {
    return v.toFixed(0);
}

// Helper function to format seconds into "XhYmZs" format, excluding '0' values
export function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    let result = '';
    if (hours > 0) result += `${hours}h`;
    if (minutes > 0) result += `${minutes}m`;
    if (secs > 0 || (hours === 0 && minutes === 0)) result += `${secs}s`;

    return result;
}

// Helper function to filter data based on interval
export function filterDataByInterval(data: DataPoint[], interval: number, average: boolean): DataPoint[] {
    if (average) {
        return data.reduce((acc, _, index) => {
            if (index % interval === 0) {
                const start = Math.max(0, index - Math.floor(interval / 2));
                const end = Math.min(data.length, index + Math.floor(interval / 2) + 1);
                const valuesToAverage = data.slice(start, end).map(item => item.value || 0);
                const avgValue = valuesToAverage.reduce((sum, value) => sum + value, 0) / valuesToAverage.length;

                acc.push({
                    time: data[index].time,
                    value: avgValue
                });
            }
            return acc;
        }, [] as DataPoint[]);
    } else {
        return data.filter((_, index) => index % interval === 0);
    }
}