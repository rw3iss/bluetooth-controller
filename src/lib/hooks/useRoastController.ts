
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

    // saves the new state to idb and triggers a state update
    const updateRoastState = async (state, save = true) => {
        //console.log(`update`, prop, val);
        const currState = ctrl.roast;
        Object.assign(currState, state);
        const newState = { ...currState };
        setRoastState(newState);
        if (save) await ctrl.save(newState);
    }
    const startRoast = () => {
        ctrl.start();
        //updateRoastValue('isStarted', true);
        updateRoastState({
            isStarted: true,
            isPaused: false,
            heaterOn: true,
            motorOn: true
        });
    }

    const togglePause = () => {
        ctrl.togglePause();
        updateRoastState({
            isPaused: ctrl.roast.isPaused,
            heaterOn: !ctrl.roast.isPaused,
            motorOn: !ctrl.roast.isPaused
        });
    }

    const stopRoast = () => {
        ctrl.stop();
        updateRoastState({
            isPaused: false,
            isStarted: false,
            heaterOn: false,
            ejectOn: true
        });
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