import { Accordian } from 'components/basic/accordian/Accordian';
import { AccordianItem } from 'components/basic/accordian/AccordianItem';
import { useViewState } from 'lib/hooks';
import { capitalize } from 'lib/utils/StrUtils';

import './PageRoast.scss';

const DEFAULT_VIEW_STATE = {
    "sections": {
        "current": {
            isOpen: false
        },
        "set": {
            isOpen: false
        },
        "auto-eject": {
            isOpen: false
        },
        "profile": {
            isOpen: false
        }
    }
}

export function PageRoast(props) {
    const { viewState, saveViewState } = useViewState('page-roast', DEFAULT_VIEW_STATE);

    // useEffect(() => {
    //     console.log(`Roast page.`);
    // }, [])

    async function toggleSection(s) {
        viewState.sections[s].isOpen = !viewState.sections[s].isOpen;
        await saveViewState({ ...viewState });
    }

    return (
        <div class="page" id="roast">

            <div class="panel-menu">
                <Accordian>
                    {Object.keys(viewState.sections).map(s =>
                        <AccordianItem title={capitalize(s)} key={s} id={s} open={viewState.sections[s].isOpen} onClick={s => toggleSection(s)}>
                            {s} content
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
