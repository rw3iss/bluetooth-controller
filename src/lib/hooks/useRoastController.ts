
import { useEffect, useState } from 'preact/hooks';
import Application from '../../Application.js';

// get the current roast controller
export function useRoastController() {
    const ctrl = Application.roastController;
    const [roastState, setRoastState] = useState(ctrl.roast)

    useEffect(() => {
        setRoastState(ctrl.roast);
        //console.log(`loaded state`, ctrl.roast)
        ctrl.addListener(onEvent);
        return () => ctrl.removeListener(onEvent);
    }, []);

    // trigger state update for normal bound component listeners
    const onEvent = async (e) => {
        setRoastState({ ...ctrl.roast });
    }

    // saves the new state to idb and triggers a state update
    const updateRoastValue = async (prop, val, save = true) => {
        //console.log(`update`, prop, val);
        const currState = ctrl.roast;
        currState[prop] = val;
        const newState = { ...currState };
        setRoastState(newState);
        if (save) await ctrl.save(newState);
    }

    const startRoast = () => {
        ctrl.start();
        //updateRoastValue('isStarted', true);
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