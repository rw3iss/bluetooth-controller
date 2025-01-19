import Application from 'Application';
import { RoastController } from 'lib/RoastController';
import { router } from 'lib/Router';
import { useEffect, useState } from 'preact/hooks';
import "./RoastPopup.scss";

const RoastCtrl: RoastController = Application.roastController;

export function RoastPopup() {
    const [show, setShow] = useState(false);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        console.log(`popup`, RoastCtrl);
        RoastCtrl.addListener(onControllerChange);
    }, []);

    const onControllerChange = (e) => {
        if (e.name == 'roast-started') setShow(true);
        if (e.name == 'roast-stopped') setShow(false);
        if (e.name == 'roast-paused') setPaused(true);
        if (e.name == 'roast-unpaused') setPaused(false);
        if (e.name == 'roast-ejected') setShow(false);
        // if (!paused && RoastCtrl.roast.isPaused) setShow(true);
    }

    function onClick() {
        console.log(`router`, router.route)
        if (router.route != '/roast') router.navigate('/roast');
    }

    return (
        <div id="roast-popup" class={`${show ? `show` : ``} ${paused ? 'paused' : ''}`} onClick={onClick}>
            ROAST
            <br />
            {RoastCtrl.roast.isPaused ? "PAUSED" : "PLAYING"}
        </div>
    );
}