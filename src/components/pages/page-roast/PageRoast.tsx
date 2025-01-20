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
import CanvasGraph from '../../app/Graph/CanvasGraph';
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


const layers = {
    temperature: true,
    motorSpeed: true,
    exhaustSpeed: true,
    events: true,
    markers: true
};

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

async function graphData() {
    const data1 = [], data2 = [];

    for (let i = 0; i < 20; i++) {
        data1.push({ x: i, y: getRandomInt(40000, 50000) });
    }

    for (let i = 0; i < 20; i++) {
        data2.push({ x: i, y: getRandomInt(40000, 50000) });
    }

    return [{
        id: "temp",
        label: "Temperature",
        data: data1
    }, {
        id: "other",
        label: "Other",
        data: data2
    }];
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
                <CanvasGraph getData={graphData} config={graphConfig} />
            </div>
        </div>
    )
}
