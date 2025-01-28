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
import { Automations } from './RoastControls';

const DEFAULT_VIEW_STATE = {
    sections: {
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
    graph: {
        isExpanded: false,
        timeInterval: 5,
        isAveraged: false,
        layers: {
            "Temperature": true,
            "Markers": true,
            "Events": true
        }
    }
}

const roastControls = [
    {
        type: 'number',
        label: "Temperature",
        labelShort: "Temp",
        propName: 'targetTemp',
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
        //console.log(`roastPropValChanged`, p, val)
        if (p.propName === "ejectOn" && val == true) {
            if (!confirm("Are you sure you want to eject the roast now?")) return;
        }
        updateRoastValue(p.propName, val);
        let method = Notification.success;
        let title = `✅ ${p.label} Updated`;
        if (typeof val == 'boolean') {
            if (!val) {
                method = Notification.warning;
                title = `🚫 ${p.label} Disabled`;
            } else {
                title = `✅ ${p.label} Enabled`;
            }
        }
        method.call(Notification, ({
            title,
            content:
                <div class="value-updated">{p.label} set to {renderValue(val, p.type)}</div>
        }));
    }

    function renderValue(val, type?) {
        let sClass = '', sVal = val;
        if (type == 'toggle' || typeof val == 'boolean') {
            sVal = val ? 'ON' : 'OFF';
            sClass = val ? 'on' : 'off';
        }
        return <span class={`value ${sClass}`}>{sVal}</span>
    }

    async function toggleSection(s) {
        if (viewState) {
            viewState.sections[s].isOpen = !viewState.sections[s].isOpen;
            await saveViewState({ ...viewState });
        }
    }

    function onStartRoast() {
        startRoast();
        Notification.success({
            title: `✅ Roast Started`,
            content:
                <div class="value-updated">Roast has started!</div>
        });
    }

    function onPauseRoast(paused) {
        togglePause();
        if (!paused) {
            Notification.warning({
                title: `⚠️ Roast Paused`,
                content:
                    <div class="value-updated">Roast has paused!</div>
            });
        } else {
            Notification.success({
                title: `✅ Roast Resumed`,
                content:
                    <div class="value-updated">Roast has resumed!</div>
            });
        }
    }

    function confirmStop() {
        if (confirm("Are you sure you want to stop the current roast?")) {
            stopRoast();
            Notification.error({
                title: `🛑 Roast Stopped`,
                content:
                    <div class="value-updated">Roast stopped!</div>
            });
        }
    }

    function renderPanelSection(s) {
        let inner: VNode = undefined;

        switch (s) {
            case "current":
                inner = <>
                    <ReadVar label="Current Temp" value={roastState.currentTemp} />
                    <ReadVar label="Target Temp" value={roastState.targetTemp} />
                    <ReadVar label="Heater" value={renderValue(roastState.heaterOn)} />
                    <ReadVar label="Motor" value={renderValue(roastState.motorOn)} />
                    <ReadVar label="Exhaust Fan" value={renderValue(roastState.exhaustOn)} />
                    <ReadVar label="Eject" value={renderValue(roastState.ejectOn)} />
                    <ReadVar label="Cooling Motor" value={renderValue(roastState.coolingMotorOn)} />
                    <ReadVar label="Cooling Fan" value={renderValue(roastState.coolingFanOn)} />
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
                                    <Toggle value={roastState[c.propName]} label={c.label} onChange={(v) => roastPropValChanged(c, v)}></Toggle>
                                </div>
                        })
                    }
                    {updateMessage && <div className="update-message">{updateMessage}</div>}
                </>
                break;

            case "automation":
                inner = <>
                    <Automations automations={roastState.automations} />
                </>
                break;

            case "profile":
                inner = <>
                    {!roastState.isStarted && <button onClick={() => onStartRoast()}>Start Roast</button>}
                    {roastState.isStarted && <button onClick={() => onPauseRoast(roastState.isPaused)}>{roastState.isPaused ? 'Play' : 'Pause'}</button>}
                    {roastState.isStarted && <button onClick={() => confirmStop()}>Stop Roast</button>}
                </>
                break;

            default:
                inner = <>not found</>;
        }

        return <div class="panel-section" id={`panel-${s}`}>{inner}</div>;
    }

    const onGraphOptionChange = (o, v) => {
        //console.log(`onGraphOptionChange`, o, v)
        viewState.graph[o] = v;
        saveViewState({ ...viewState });
    }

    const onGraphLayerChange = (name, v) => {
        //console.log(`onGraphLayerChange`, name, v)
        viewState.graph.layers[name] = v;
        saveViewState({ ...viewState });
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

                {viewState && <GraphView options={viewState.graph} layers={gData} onOptionChange={onGraphOptionChange} onLayerChange={onGraphLayerChange} />}

            </div>
        </div>
    )
}
