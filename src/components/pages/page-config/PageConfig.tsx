import { useSavedState } from 'lib/hooks';

import "./PageConfig.scss";

const DEFAULT_VIEW_STATE = {
    "section": "general"
}

export function PageConfig(props) {
    const { state: viewState, setState: saveViewState } = useSavedState('page-config', DEFAULT_VIEW_STATE, false);

    async function changeSection(s) {
        if (viewState) {
            console.log(`changeSection`, s)
            viewState["section"] = s;
            await saveViewState({ ...viewState });
        }
    }

    return (
        <div class="page" id="config">

            <div class="menu">
                <div class={`menu-item ${viewState.section == 'general' ? 'active' : ''}`} onClick={(e) => changeSection('general')}>General</div>
                <div class={`menu-item ${viewState.section == 'connection' ? 'active' : ''}`} onClick={(e) => changeSection('connection')}>Connection</div>
            </div>

            <div class="section">

                {viewState.section == 'general' &&
                    <div id="config-general">
                        GENERAL
                    </div>
                }

                {viewState.section == 'connection' &&
                    <div id="config-connection">
                        CONNECTION
                    </div>
                }

            </div>

        </div>
    )
}