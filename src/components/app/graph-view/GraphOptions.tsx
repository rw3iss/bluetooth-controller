import { FunctionalComponent } from 'preact';
import { Button } from '../../basic/button/Button.js';
import { GraphViewOptions } from './GraphView';

interface GraphOptionsProps {
    options: GraphViewOptions,
    onOptionChange: (o, v) => void;

    // onIntervalChange: (interval: number, isAveraged: boolean) => void;
    // onExpandChange: (isExpanded: boolean) => void;

    // timeInterval: number;
    // isExpanded: boolean;
    // isAveraged: boolean;
}

export const GraphOptions: FunctionalComponent<GraphOptionsProps> = ({ options, onOptionChange }) => {
    //const [isExpanded, setIsExpanded] = useState(false);

    const handleIntervalChange = (e: Event) => {
        onOptionChange('timeInterval', Number(e.target.value));
    };

    const handleAverageChange = (e: Event) => {
        onOptionChange('isAveraged', e.target.checked);
    };

    const handleExpand = (e: Event) => {
        console.log(`expand`, e.target)
        onOptionChange('isExpanded', !options.isExpanded);
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
                    <input type="checkbox" checked={options.isAveraged} onChange={handleAverageChange} />
                    Average
                </label>
            </div>

            <div class="item expand">
                <Button onClick={handleExpand}>{options.isExpanded ? <img src="/public/images/icon_table.svg" /> : <img src="/public/images/icon_collapse.svg" />}</Button>
            </div>

        </div>
    );
};