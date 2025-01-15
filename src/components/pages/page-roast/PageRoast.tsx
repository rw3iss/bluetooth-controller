import { Accordian } from 'components/basic/accordian/Accordian';
import { AccordianItem } from 'components/basic/accordian/AccordianItem';
import { useViewState } from 'lib/hooks';
import { capitalize } from 'lib/utils/StrUtils';

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

function ReadVar({ label, value }) {
    return (
        <div class="read-var">
            {label && <div class="label">{label}</div>}
            <div class="value">{value}</div>
        </div>
    );
}

export function PageRoast(props) {
    const { viewState, saveViewState } = useViewState('page-roast', DEFAULT_VIEW_STATE);

    async function toggleSection(s) {
        viewState.sections[s].isOpen = !viewState.sections[s].isOpen;
        await saveViewState({ ...viewState });
    }

    function getDeviceVar(v) {
        //read from the roast controller
    }

    function renderPanelContent(s) {
        switch (s) {
            case "current":
                return <div class="panel-content" id="panel-current">
                    <ReadVar label="Temp" value={getDeviceVar('temp')} />
                </div>
            case "set":
                return <div class="panel-content" id="panel-set">
                    SET
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

    return (
        <div class="page" id="roast">

            <div class="panel-menu">
                <Accordian>
                    {Object.keys(viewState.sections).map(s =>
                        <AccordianItem title={capitalize(s)} key={s} id={s} open={viewState.sections[s].isOpen} onClick={s => toggleSection(s)}>
                            {renderPanelContent(s)}
                        </AccordianItem>
                    )}
                </Accordian>
            </div>

            <div class="panel-graph">
                GRAPH
            </div>
        </div>
    )
}
