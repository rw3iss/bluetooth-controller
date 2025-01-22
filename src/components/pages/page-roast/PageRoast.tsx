import Application from 'Application';
import { ReadVar } from 'components/app/vars/ReadVar';
import { WriteVar } from 'components/app/vars/WriteVar';
import { Menu } from 'components/basic/menu/Menu';
import { MenuItem } from 'components/basic/menu/MenuItem';
import { useRoastController } from 'lib/hooks/useRoastController.js';
import { useSavedState } from 'lib/hooks/useSavedState.js';
import Notification from 'lib/NotificatonService';
import { capitalize } from 'lib/utils/StrUtils';
import { useState } from 'preact/hooks';
import { GraphLayer } from '../../app/plotly-graph/Graph';
import { CanvasGraph } from '../../app/plotly-graph/PlotlyGraph';
import { Button } from '../../basic/button/Button';
import Toggle from '../../basic/toggle/Toggle.js';
import './PageRoast.scss';

const DEFAULT_VIEW_STATE = {
    "sections": {
        "current": {
            isOpen: true
        },
        "set": {
            isOpen: true
        },
        "automation": {
            isOpen: true
        },
        "profile": {
            isOpen: true
        }
    }
}

// {
//     isStarted: false,
//     isPaused: false,
//     timeStarted: undefined,
//     timeRunningMs: 0,
//     currentTemp: 0,
//     targetTemp: 0,
//     heaterOn: false,
//     motorOn: false,
//     exhaustOn: false,
//     ejectOn: false,
//     coolingOn: false
// }

/*
RoastController - instantiated and state auto-loaded on App start.

Other components - useEffect((), [roastState]); - when state changes, the views will be updated.

*/

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const graphConfig = {
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
const dataArray = (): Array<{ time: number; value: number }> => {
    return Array.from({ length: totalSeconds }, (_, index) => {
        const time = index; // time in seconds
        // Here, we'll generate a value that oscillates with some noise for demonstration
        const value = Math.sin(time / 10) * 50 + (Math.random() - 0.5) * 5; // Oscillating function with noise
        return { time, value };
    });
}

function generateCurvedTemperatureData(totalSeconds: number): Array<{ time: number; value: number }> {
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

function graphData() {
    const layers: GraphLayer[] = [
        {
            type: 'data',
            data: generateCurvedTemperatureData(totalSeconds),
            color: '#fcba03' // Green
        },
        // {
        //     type: 'data',
        //     data: generateCurvedTemperatureData(totalSeconds),
        //     color: '#03adfc' // Red
        // },
        {
            type: 'markers',
            data: [
                { time: 120, text: 'Event A' },
                { time: 380, text: 'Event B' }
            ],
            color: '#bab375'
        },
        {
            type: 'events',
            data: [
                { time: 200, text: 'Major Update' },
                { time: 400, text: 'System Overload' }
            ],
            color: '#68a693'
        }
    ];
    return layers;
}

export function PageRoast(props) {
    const ctrl = Application.roastController;
    const roast = ctrl.roast;
    const { roastState, setRoastState, updateRoastValue, startRoast, togglePause, stopRoast } = useRoastController();
    const { state: viewState, setState: saveViewState } = useSavedState('page-roast', DEFAULT_VIEW_STATE);
    const [updateMessage, setUpdateMessage] = useState(undefined);

    // send a new value command to the device
    function setRoastValue(prop, val) {
        console.log(`setRoastValue`, prop, val)
        updateRoastValue(prop, val);
        //setRoastState({ ...roast });
        let sVal = val;
        if (['motorOn', 'exhaustOn', 'ejectOn'].includes(prop)) sVal = val ? 'ON' : 'OFF';
        Notification.success({
            title: 'Value Updated',
            content:
                <><span class="i">✅</span> &nbsp;{capitalize(prop)} updated to <div class="number value">{sVal}</div></>
        });
    }

    async function toggleSection(s) {
        if (viewState) {
            viewState.sections[s].isOpen = !viewState.sections[s].isOpen;
            await saveViewState({ ...viewState });
        }
    }

    function confirmStop() {
        if (confirm("Are you sure you want to stop the current roast?")) {
            stopRoast();
        }
    }

    function confirmEject() {
        if (confirm("Are you sure you want to eject?")) ctrl.eject();
        else console.log(`Eject cancelled.`)
    }

    function renderMenuSection(s) {
        let inner: VNode = undefined;

        switch (s) {
            case "current":
                inner = <>
                    <ReadVar label="Current Temp" value={roastState.currentTemp} />
                    <ReadVar label="Target Temp" value={roastState.targetTemp} />
                    <ReadVar label="Motor" value={roastState.motorOn} />
                    <ReadVar label="Exhaust" value={roastState.exhaustOn} />
                    <ReadVar label="Eject" value={roastState.ejectOn} />
                </>
                break;

            case "set":
                inner = <>
                    <WriteVar type="number" value={roastState.targetTemp} min="0" max="500" label="Temp" onChanged={(value) => setRoastValue('temp', value)} />
                    <Toggle label="Heater" onChange={(e) => setRoastValue('heaterOn', e)}></Toggle>
                    <Toggle label="Motor" onChange={(e) => setRoastValue('motorOn', e)}></Toggle>
                    <Toggle label="Exhaust" onChange={(e) => setRoastValue('exhaustOn', e)}></Toggle>
                    <Button onClick={() => confirmEject()}>Eject</Button>
                    {updateMessage && <div className="update-message">{updateMessage}</div>}
                </>
                break;

            case "automation":
                inner = <>
                    AUTOMATION
                </>
                break;

            case "profile":
                inner = <>
                    {!roastState.isStarted && <button onClick={() => startRoast()}>Start Roast</button>}
                    {roastState.isStarted && <button onClick={() => togglePause()}>{roastState.isPaused ? 'Play' : 'Pause'}</button>}
                    {roastState.isStarted && <button onClick={() => confirmStop()}>Stop Roast</button>}
                </>
                break;

            default:
                inner = <>not found</>;
        }

        return <div class="content-section" id={`menu-section-${s}`}>{inner}</div>;
    }

    return (
        <div class="page" id="roast">

            <div class="panel-menu">
                {(viewState && roastState) ? <Menu>
                    {Object.keys(viewState.sections).map(s =>
                        <MenuItem title={capitalize(s)} key={s} id={s} open={viewState.sections[s].isOpen} onClick={s => toggleSection(s)}>
                            {renderMenuSection(s)}
                        </MenuItem>
                    )}
                </Menu> : <></>}
            </div>

            <div class="panel-graph">

                <CanvasGraph layers={graphData()} config={graphConfig} />

                {/* <CanvasGraph getData={graphData} config={graphConfig} /> */}

            </div>
        </div>
    )
}
