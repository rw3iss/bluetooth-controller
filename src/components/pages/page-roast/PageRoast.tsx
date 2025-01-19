import { ReadVar } from 'components/app/vars/ReadVar.tsx';
import { WriteVar } from 'components/app/vars/WriteVar.tsx';
import { Accordian } from 'components/basic/accordian/Accordian';
import { AccordianItem } from 'components/basic/accordian/AccordianItem';
import { capitalize } from 'lib/utils/StrUtils';
import { useEffect, useState } from 'preact/hooks';
import Application from 'Application';
import { useSavedState } from 'lib/hooks/useSavedState.js';
import { useRoastController } from 'lib/hooks/useRoastController.js';
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


const RoastCtrl = Application.roastController;

export function PageRoast(props) {
    const roast = RoastCtrl.roast;
    const { roastState, setRoastState, updateRoastValue, startRoast, togglePause, stopRoast } = useRoastController();
    const { state: viewState, setState: saveViewState } = useSavedState('page-roast', DEFAULT_VIEW_STATE);
    const [updateMessage, setUpdateMessage] = useState(undefined);

    useEffect(() => {
        console.log(`ADD LISTENER`)
        RoastCtrl.addListener(onControllerChange);
        return () => RoastCtrl.removeListener(onControllerChange);
    }, []);

    function deviceVar(v) {
        return roast ? roast[v] : undefined;
        //read from the roast controller
    }

    // send a new value command to the device
    function setRoastValue(prop, val) {
        updateRoastValue(prop, val);
        //setRoastState({ ...roast });
        setUpdateMessage(<>✅  &nbsp;{capitalize(prop)} updated to <span class="number value">{val}</span></>);
        setTimeout(() => setUpdateMessage(''), 3000);
    }

    async function toggleSection(s) {
        if (viewState) {
            viewState.sections[s].isOpen = !viewState.sections[s].isOpen;
            await saveViewState({ ...viewState });
        }
    }

    function onControllerChange(e) {
        console.log(`PageRoast controller change`, e);
        setRoastState(RoastCtrl.roast);
    }

    function confirmStop() {
        if (confirm("Are you sure you want to stop the current roast?")) {
            stopRoast();
        }
    }

    function confirmEject() {
        if (confirm("Are you sure you want to eject?")) RoastCtrl.eject();
        else console.log(`Eject cancelled.`)
    }

    function renderPanelContent(s) {
        let inner: VNode = undefined;

        switch (s) {
            case "current":
                inner = <>
                    <ReadVar label="Current Temp" value={deviceVar('currentTemp')} />
                    <ReadVar label="Target Temp" value={deviceVar('targetTemp')} />
                    <ReadVar label="Motor" value={deviceVar('motor')} />
                    <ReadVar label="Exhaust" value={deviceVar('exhaust')} />
                    <ReadVar label="Eject" value={deviceVar('eject')} />
                </>
                break;

            case "set":
                inner = <>
                    <WriteVar type="number" defaultValue={deviceVar('targetTemp')} min="0" max="500" label="Temp" onChanged={(value) => setRoastValue('temp', value)} />
                    <WriteVar type="checkbox" checked={deviceVar('motor')} label="Motor" onChanged={(value) => setRoastValue('motor', value)} />
                    <WriteVar type="checkbox" checked={deviceVar('exhaust')} label="Exhaust" onChanged={(value) => setRoastValue('exhaust', value)} />
                    <WriteVar type="checkbox" checked={deviceVar('eject')} label="Eject" onChanged={(value) => confirmEject()} />
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
                {viewState ? <Accordian>
                    {Object.keys(viewState.sections).map(s =>
                        <AccordianItem title={capitalize(s)} key={s} id={s} open={viewState.sections[s].isOpen} onClick={s => toggleSection(s)}>
                            {renderPanelContent(s)}
                        </AccordianItem>
                    )}
                </Accordian> : <></>}
            </div>

            <div class="panel-graph">
                {JSON.stringify(roastState)}
            </div>
        </div>
    )
}
