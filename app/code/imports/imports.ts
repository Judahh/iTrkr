import { SVG } from './../sVG/sVG';
import { GPS } from './../gPS/gPS';
import { GPSData } from './../gPS/gPSData';
import { GSM } from './../gSM/gSM';
import { Time } from './../time/time';
import { Wifi } from './../wifi/wifi';
import { Disk } from './../disk/disk';
import { UserManegement } from './../user/userManegement';
import { Stream } from './../stream/stream';
import { Languages } from './../languages/Languages';
import { Keyboard } from './../keyboard/keyboard';
import { Operations } from './../operations/operations';
import * as loader from './../onLoad/loader';
// tslint:disable-next-line:no-empty
try { require('./../../style/app.css'); } catch (e) { console.log('ERROR FONT'); };

let w: any = window;
w.FontAwesomeConfig = {
    searchPseudoElements: true
}

export {
    loader,
    SVG,
    GPS, GPSData,
    GSM,
    Time,
    Wifi,
    Disk,
    Stream,
    Keyboard,
    Operations,
    Languages,
    UserManegement
};
