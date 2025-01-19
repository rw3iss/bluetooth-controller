
import { useEffect, useState } from 'preact/hooks';
import { DEFAULT_ROAST_STATE } from 'lib/RoastController';

// get the current roast controller
export function useRoastController() {
    const [roastState, setRoastState] = useState(DEFAULT_ROAST_STATE())

    useEffect(() => {
        console.log(`useRoastController effect()`)
    }, []);

    return { roastState, setRoastState }
}