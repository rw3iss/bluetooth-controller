import { h, FunctionalComponent } from 'preact';
import { useState } from 'preact/hooks';
import { Button } from '../../basic/button/Button.js';

interface GraphOptionsProps {
    onIntervalChange: (interval: number, isAveraged: boolean) => void;
    onExpandChange: (isExpanded: boolean) => void;
}

export const GraphOptions: FunctionalComponent<GraphOptionsProps> = ({ onIntervalChange, onExpandChange }) => {
    const [selectedInterval, setSelectedInterval] = useState('5'); // Default to 15 seconds
    const [isAveraged, setIsAveraged] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleIntervalChange = (e: Event) => {
        const target = e.target as HTMLSelectElement;
        const intervalValue = target.value;
        setSelectedInterval(intervalValue);
        onIntervalChange(Number(intervalValue), isAveraged);
    };

    const handleAverageChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        setIsAveraged(target.checked);
        onIntervalChange(Number(selectedInterval), target.checked);
    };

    const handleExpand = (e: Event) => {
        setIsExpanded(!isExpanded);
        onExpandChange(!isExpanded);
    };

    return (
        <div class="graph-options">
            <div class="item interval">
                <label htmlFor="intervalSelect">Time Interval: </label>
                <select id="intervalSelect" onChange={handleIntervalChange} value={selectedInterval}>
                    <option value="1">1 second</option>
                    <option value="5">5 seconds</option>
                    <option value="10">10 seconds</option>
                    <option value="15">15 seconds</option>
                    <option value="30">30 seconds</option>
                    <option value="60">1 minute</option>
                </select>
                <label style={{ marginLeft: '10px' }}>
                    <input type="checkbox" checked={isAveraged} onChange={handleAverageChange} />
                    Average
                </label>
            </div>

            <div class="item expand">
                <Button onClick={handleExpand}>{isExpanded ? 'Collapse' : 'Expand'}</Button>
            </div>
        </div>
    );
};