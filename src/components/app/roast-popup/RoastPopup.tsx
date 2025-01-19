import { router } from 'lib/Router';
import { useEffect, useState } from 'preact/hooks';
import { useRoastController } from 'lib/hooks/useRoastController.js';
import "./RoastPopup.scss";

export function RoastPopup() {
    const { roastState, setRoastState } = useRoastController();

    function onClick() {
        if (router.route != '/roast') router.navigate('/roast');
    }

    return roastState ? <div id="roast-popup" class={`${roastState.isStarted ? `show` : ``} ${roastState.isPaused ? 'paused' : ''}`} onClick={onClick}>
        ROAST
        <br />
        {roastState.isPaused ? "PAUSED" : "PLAYING"}
        <br />
        {roastState.timeRunningMs / 1000} seconds
    </div> : undefined
}