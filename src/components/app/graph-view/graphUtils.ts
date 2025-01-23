import { DataPoint } from "./Graph.js";

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