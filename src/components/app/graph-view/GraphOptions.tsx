import { FunctionalComponent } from 'preact';
import { useState } from 'preact/hooks';
import { Button } from '../../basic/button/Button.js';

interface GraphOptionsProps {
    options: {},
    onOptionChange: (o, v) => void;

    onIntervalChange: (interval: number, isAveraged: boolean) => void;
    onExpandChange: (isExpanded: boolean) => void;

    timeInterval: number;
    isExpanded: boolean;
    isAveraged: boolean;
}

export const GraphOptions: FunctionalComponent<GraphOptionsProps> = ({ options, onOptionChange, onIntervalChange, onExpandChange, timeInterval, isAveraged, isExpanded }) => {
    //const [isExpanded, setIsExpanded] = useState(false);

    const handleIntervalChange = (e: Event) => {
        onOptionChange('timeInterval', Number(e.target.value));
    };

    const handleAverageChange = (e: Event) => {
        onOptionChange('average', e.target.checked);
    };

    const handleExpand = (e: Event) => {
        console.log(`expand`, e.target)
        onOptionChange('expanded', !options.expanded);
    };

    return (
        <div class="graph-options">

            <div class="item interval">
                <label htmlFor="intervalSelect">Time Interval: </label>
                <select id="intervalSelect" onChange={handleIntervalChange} value={options.timeInterval}>
                    <option value="1">1 second</option>
                    <option value="5">5 seconds</option>
                    <option value="10">10 seconds</option>
                    <option value="15">15 seconds</option>
                    <option value="30">30 seconds</option>
                    <option value="60">1 minute</option>
                </select>
                <label style={{ marginLeft: '10px' }}>
                    <input type="checkbox" checked={options.average} onChange={handleAverageChange} />
                    Average
                </label>
            </div>

            <div class="item expand">
                <Button onClick={handleExpand}>{options.expanded ? 'Collapse' : 'Expand'}</Button>
            </div>

        </div>
    );
};