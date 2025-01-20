import Application from 'Application';
import { ReadVar } from 'components/app/vars/ReadVar';
import { WriteVar } from 'components/app/vars/WriteVar';
import { Accordian } from 'components/basic/accordian/Accordian';
import { AccordianItem } from 'components/basic/accordian/AccordianItem';
import { useRoastController } from 'lib/hooks/useRoastController.js';
import { useSavedState } from 'lib/hooks/useSavedState.js';
import { capitalize } from 'lib/utils/StrUtils';
import { useState } from 'preact/hooks';
import GraphWrapper from '../../app/graph-wrapper/GraphWrapper';
import { Button } from '../../basic/button/Button';
import './PageRoast.scss';
import Toggle from '../../basic/toggle/Toggle.js';

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


const graphData = {
    current: {
        isStarted: false,
        isPaused: false,

        timeStarted: undefined,
        timeRunningMs: 0,

        currentTemp: 0,
        targetTemp: 0,

        heaterOn: false,
        motorOn: false,
        exhaustOn: false,
        ejectOn: false,
        coolingOn: false
    },

    data: [
        {
            time: Date(),
            temperature: 123,
            motorSpeed: 100,
            exhaustSpeed: 100
        },
        {
            time: Date(),
            temperature: 123,
            motorSpeed: 100,
            exhaustSpeed: 100
        }
    ],

    events: [{
        name: "roast-paused",
        time: Date()
    }, {
        name: "motor-enabled",
        time: Date()
    }],

    markers: [{
        text: "Some text",
        time: Date()
    }]
}


const layers = {
    temperature: true,
    motorSpeed: true,
    exhaustSpeed: true,
    events: true,
    markers: true
};

export function PageRoast(props) {
    const ctrl = Application.roastController;
    const roast = ctrl.roast;
    const { roastState, setRoastState, updateRoastValue, startRoast, togglePause, stopRoast } = useRoastController();
    const { state: viewState, setState: saveViewState } = useSavedState('page-roast', DEFAULT_VIEW_STATE);
    const [updateMessage, setUpdateMessage] = useState(undefined);

    // useEffect(() => {
    //     console.log(`ADD LISTENER`)
    //     RoastCtrl.addListener(onControllerChange);
    //     return () => RoastCtrl.removeListener(onControllerChange);
    // }, []);

    function deviceVar(v) {
        return roast ? roast[v] : undefined;
        //read from the roast controller
    }

    // send a new value command to the device
    function setRoastValue(prop, val) {
        console.log(`setRoastValue`, prop, val)
        updateRoastValue(prop, val);
        //setRoastState({ ...roast });
        let sVal = val;
        if (['motorOn', 'exhaustOn', 'ejectOn'].includes(prop)) sVal = val ? 'ON' : 'OFF';
        setUpdateMessage(<><span class="i">✅</span> &nbsp;{capitalize(prop)} updated to <div class="number value">{sVal}</div></>);
        setTimeout(() => setUpdateMessage(''), 3000);
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

    function renderPanelMenu(s) {
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
                    <WriteVar type="checkbox" value={roastState.motorOn ? 'checked' : ''} label="Motor" onChanged={(value) => setRoastValue('motorOn', value)} />
                    <WriteVar type="checkbox" value={roastState.exhaustOn ? 'checked' : ''} label="Exhaust" onChanged={(value) => setRoastValue('exhaustOn', value)} />

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

        return <div class="menu-section" id={`menu-section-${s}`}>{inner}</div>;
    }

    return (
        <div class="page" id="roast">

            <div class="panel-menu">
                {(viewState && roastState) ? <Accordian>
                    {Object.keys(viewState.sections).map(s =>
                        <AccordianItem title={capitalize(s)} key={s} id={s} open={viewState.sections[s].isOpen} onClick={s => toggleSection(s)}>
                            {renderPanelMenu(s)}
                        </AccordianItem>
                    )}
                </Accordian> : <></>}
            </div>

            <div class="panel-graph">
                <GraphWrapper graphData={graphData} layers={layers} />
            </div>
        </div>
    )
}
