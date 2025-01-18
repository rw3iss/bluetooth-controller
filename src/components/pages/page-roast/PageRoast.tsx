import { ReadVar } from 'components/app/vars/ReadVar.tsx';
import { WriteVar } from 'components/app/vars/WriteVar.tsx';
import { Accordian } from 'components/basic/accordian/Accordian';
import { AccordianItem } from 'components/basic/accordian/AccordianItem';
import { useSavedState } from 'lib/hooks';
import { capitalize } from 'lib/utils/StrUtils';
import { useState } from 'preact/hooks';

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

const DEFAULT_ROAST_STATE = {
    currentTemp: 0,
    targetTemp: 0,
    motor: true,
    heater: true,
    exhaust: true,
    eject: false,
    dateStarted: undefined,
    runtimeSecs: 0
}

export function PageRoast(props) {
    const { state: viewState, setState: saveViewState } = useSavedState('page-roast', DEFAULT_VIEW_STATE);
    const { state: roastState, setState: saveRoastState } = useSavedState('roast', DEFAULT_ROAST_STATE, false);
    const [updateMessage, setUpdateMessage] = useState(undefined);

    function deviceVar(v) {
        return roastState[v];
        //read from the roast controller
    }

    // send a new value command to the device
    function setRoastValue(property, value) {
        roastState[property] = value;
        console.log(`setRoastValue and save:`, property, value, roastState);
        saveRoastState({ ...roastState });
        setUpdateMessage(<>✅  &nbsp;{capitalize(property)} updated to <span class="value">{value}</span></>);
        setTimeout(() => setUpdateMessage(''), 3000);
    }

    function handleEject(isOn) {
        if (isOn) {
            if (confirm("Are you sure you want to eject?")) {
                setRoastValue('eject', isOn);
            } else {
                console.log(`Eject cancelled.`)
            }
        } else {
            setRoastValue('eject', isOn);
        }
    }

    async function toggleSection(s) {
        viewState.sections[s].isOpen = !viewState.sections[s].isOpen;
        await saveViewState({ ...viewState });
    }

    function renderPanelContent(s) {
        switch (s) {
            case "current":
                return <div class="panel-content" id="panel-current">
                    <ReadVar label="Current Temp" value={deviceVar('currentTemp')} />
                    <ReadVar label="Target Temp" value={deviceVar('targetTemp')} />
                    <ReadVar label="Motor" value={deviceVar('motor')} />
                    <ReadVar label="Exhaust" value={deviceVar('exhaust')} />
                    <ReadVar label="Eject" value={deviceVar('eject')} />
                </div>
            case "set":
                return <div class="panel-content" id="panel-set">
                    <WriteVar type="number" defaultValue={deviceVar('targetTemp')} min="0" max="500" label="Temp" onChanged={(value) => setRoastValue('temp', value)} />
                    <WriteVar type="checkbox" checked={deviceVar('motor')} label="Motor" onChanged={(value) => setRoastValue('motor', value)} />
                    <WriteVar type="checkbox" checked={deviceVar('exhaust')} label="Exhaust" onChanged={(value) => setRoastValue('exhaust', value)} />
                    <WriteVar type="checkbox" checked={deviceVar('eject')} label="Eject" onChanged={(value) => handleEject(value)} />
                    {updateMessage && <div className="update-message">{updateMessage}</div>}
                </div>
            case "automation":
                return <div class="panel-content" id="panel-automation">
                    AUTOMATION
                </div>
            case "profile":
                return <div class="panel-content" id="panel-profile">
                    PROFILE
                </div>
            default:
                return "";
        }
    }

    console.log(`viewstate`, viewState)

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
                GRAPH
            </div>
        </div>
    )
}
