
import { useEffect, useState } from 'preact/hooks';
import Application from '../../Application.js';

// get the current roast controller
export function useRoastController() {
    const ctrl = Application.roastController;
    const [roastState, setRoastState] = useState(undefined)

    useEffect(() => {
        setRoastState(ctrl.roast);
        console.log(`useRoastController effect()`, roastState)
        ctrl.addListener(onEvent);
        return () => ctrl.removeListener(onEvent);
    }, []);

    const onEvent = async (e) => {
        console.log(`URC event:`, e, ctrl.roast);
        // trigger state update for normal bound component listeners
        setRoastState({ ...ctrl.roast });
        //await ctrl.save(ctrl.roast);
    }

    // saves the new state to idb and triggers a state update
    const updateRoastValue = async (prop, val, save = true) => {
        roastState[prop] = val;
        const newState = { ...roastState };
        if (save) await ctrl.save(newState);
        setRoastState(ctrl.roast);
    }

    const startRoast = () => {
        ctrl.start();
        updateRoastValue('isStarted', true);
    }

    const togglePause = () => {
        ctrl.togglePause();
        updateRoastValue('isPaused', ctrl.roast.isPaused);
    }

    const stopRoast = () => {
        ctrl.stop();
        updateRoastValue('isPaused', false);
        updateRoastValue('isStarted', false);
    }

    return {
        roastState,
        setRoastState,
        updateRoastValue,
        startRoast,
        togglePause,
        stopRoast
    }
}