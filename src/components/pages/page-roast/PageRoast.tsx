import Application from 'Application';
import { ReadVar } from 'components/app/vars/ReadVar';
import { Menu } from 'components/basic/menu/Menu';
import { MenuItem } from 'components/basic/menu/MenuItem';
import { useRoastController } from 'lib/hooks/useRoastController.js';
import { useSavedState } from 'lib/hooks/useSavedState.js';
import Notification from 'lib/NotificatonService';
import { capitalize } from 'lib/utils/StrUtils';
import { useMemo, useState } from 'preact/hooks';
import { graphData } from '../../app/graph-view/graphUtils';
import { GraphView } from '../../app/graph-view/GraphView';
import { NotificationContext } from '../../app/notification/NotificationContext';
import { InputVar } from '../../app/vars/InputVar';
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
    },
    "graph": {
        "expanded": false,
        "timeInterval": 5,
        "average": false,
        "layers": {
            "temp": true,
            "markers": true,
            "events": true
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

const roastControls = [
    {
        type: 'number',
        label: "Temperature",
        labelShort: "Temp",
        propName: 'temp',
        minValue: 0,
        maxValue: 600
    }, {
        type: 'toggle',
        label: 'Heater',
        propName: 'heaterOn'
    }, {
        type: 'toggle',
        label: 'Motor',
        propName: 'motorOn'
    }, {
        type: 'toggle',
        label: 'Exhaust Fan',
        propName: 'exhaustOn'
    }, {
        type: 'toggle',
        label: 'Eject',
        propName: 'ejectOn'
    }, {
        type: 'toggle',
        label: 'Cooling Motor',
        propName: 'coolingMotorOn'
    }, {
        type: 'toggle',
        label: 'Cooling Fan',
        propName: 'coolingFanOn'
    }
]

export function PageRoast(props) {
    const ctrl = Application.roastController;
    const roast = ctrl.roast;
    const { roastState, setRoastState, updateRoastValue, startRoast, togglePause, stopRoast } = useRoastController();
    const { state: viewState, setState: saveViewState } = useSavedState('page-roast', DEFAULT_VIEW_STATE);
    const [updateMessage, setUpdateMessage] = useState(undefined);

    const gData = useMemo(() => graphData(), []);

    // send a new value command to the device
    function roastPropValChanged(p, val) {
        console.log(`roastPropValChanged`, p, val)
        updateRoastValue(p.propName, val);
        let sVal = val;
        if (p.type == 'toggle') sVal = val ? 'ON' : 'OFF';
        Notification.success({
            title: `✅ ${p.label} Updated`,
            content:
                <div class="value-updated">{p.label} set to <span class={`value ${sVal}`}>{sVal}</span></div>
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

    function renderPanelSection(s) {
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
                    {
                        roastControls.map(c => {
                            if (c.type == 'number')
                                return <div class="control">
                                    <InputVar type="number" value={roastState[c.propName]} min={c.minValue} max={c.maxValue} label={c.label} onChanged={(v) => roastPropValChanged(c, v)} />
                                </div>
                            if (c.type == 'toggle')
                                return <div class="control">
                                    <Toggle label={c.label} onChange={(v) => roastPropValChanged(c, v)}></Toggle>
                                </div>
                        })
                    }
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

        return <div class="panel-section" id={`panel-${s}`}>{inner}</div>;
    }

    const onExpand = async (v) => {
        console.log(`onExpand`, v)
        viewState.graph.expanded = v;
        //setIsGraphExpanded(v);
        await saveViewState({ ...viewState });
    }

    return (
        <div class="page" id="roast">

            <div class="panel">
                {(viewState && roastState) ? <Menu>
                    {Object.keys(viewState.sections).map(s =>
                        <MenuItem title={capitalize(s)} key={s} id={s} open={viewState.sections[s].isOpen} onClick={s => toggleSection(s)}>
                            {renderPanelSection(s)}
                        </MenuItem>
                    )}
                </Menu> : <></>}

                <NotificationContext />

            </div>

            <div class="graph">

                {viewState && <GraphView layers={gData} expanded={viewState.graph.expanded} onExpand={onExpand} />}

            </div>
        </div>
    )
}
