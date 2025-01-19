
import { useEffect, useState } from 'preact/hooks';
import { DEFAULT_ROAST_STATE, RoastController } from 'lib/RoastController';
import Application from '../../Application.js';

// get the current roast controller
export function useRoastController() {
    const ctrl = Application.roastController;
    const [roastState, setRoastState] = useState(ctrl.roast)

    useEffect(() => {
        console.log(`useRoastController effect()`, roastState)
    }, []);

    const updateRoastValue = async (prop, val) => {
        roastState[prop] = val;
        const newState = { ...roastState };
        setRoastState(newState);
        console.log(`updateRoastValue`, prop, val)
        await ctrl.save(newState);
    }

    const startRoast = () => {
        ctrl.start();
        updateRoastValue('isStarted', true);
    }

    const togglePause = () => {
        ctrl.togglePause();
        updateRoastValue('isPaused', !roastState.isPaused);
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