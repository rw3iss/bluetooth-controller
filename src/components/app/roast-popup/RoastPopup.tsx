import { useRoastController } from 'lib/hooks/useRoastController.js';
import { router } from 'lib/Router';
import "./RoastPopup.scss";

export function RoastPopup() {
    const { roastState, setRoastState } = useRoastController();

    function onClick() {
        if (router.route != '/roast') router.navigate('/roast');
    }

    const now = new Date();
    const runSecs = roastState ? (now.getTime() - roastState.timeStarted.getTime()) : 0;
    const runMins = Math.floor(runSecs / 60);
    const remSecs = runSecs - (runMins * 60);

    return roastState ?
        <div id="roast-popup" class={`${roastState.isStarted ? `show` : ``} ${roastState.isPaused ? 'paused' : ''}`} onClick={onClick}>
            <div class="title">
                Roast
            </div>
            <div class="status">
                {roastState.isPaused ? "PAUSED" : "RUNNING"}
            </div>
            <div class="runtime">
                <div class="label">
                    Time:
                </div>
                {runMins > 0 ? <><span>{runMins}</span>m <span>{remSecs}</span>s</> : <><span>{remSecs}</span>s</>}
            </div>
        </div>
        : undefined
}