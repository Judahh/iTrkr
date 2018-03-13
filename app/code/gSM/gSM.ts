import { AppObject, Component, ComponentPageBody, ComponentInformation, Observer } from 'backappjh';
import { BasicSocket, UniqueSocket } from 'basicsocket';

export class GSM extends AppObject implements Observer {
    private static instance: GSM;
    private socketIo;
    private subscribers: Array<any>;
    private stringStrength: string;
    private stringType: string;
    private stringError: string;

    public static getInstance(father?: Component): GSM {
        if (!GSM.instance) {
            GSM.instance = new GSM(father);
        }
        return GSM.instance;
    }

    constructor(father?: Component) {
        super(father);
        this.init();
    }

    public subscribe(callback) {
        // we could check to see if it is already subscribed
        this.subscribers.push(callback);
        console.log(callback.name, 'has been subscribed to GSM');
    }

    public unsubscribe(callback) {
        this.subscribers = this.subscribers.filter((element) => {
            return element !== callback;
        });
    }

    public publish(data) {
        this.subscribers.forEach((subscriber) => {
            subscriber(data);
        });
    }

    public getStrength(component) {
        let gSM = GSM.getInstance();
        gSM.subscribe((data) => { gSM.strength(component, data); });
    }

    public strength(component, data) {
        let gSM = GSM.getInstance();
        // console.log(data);
        if (data.signal) {
            let asu = parseInt(data.signal, 10) / 2;
            let strength = (asu / 31) * 100;

            console.log('GSM%:', strength);
            if (strength > 75) {
                gSM.stringStrength = '\u{F155}'; // '';
            } else if (strength > 50) {
                gSM.stringStrength = '\u{F154}';
            } else if (strength > 25) {
                gSM.stringStrength = '\u{F153}';
            } else if (strength > 0) {
                gSM.stringStrength = '\u{F152}';
            } else {
                gSM.stringStrength = '\u{F151}';
            }
        } else if (data.type) {
            console.log('Type:', data.type);
            gSM.stringType = data.type;
        } else if (data.error) {
            console.log('Type:', data.error);
            // gSM.stringError = data.error;
        } else {
            gSM.stringStrength = '';
            gSM.stringType = '';
        }

        (<ComponentInformation>component).getElement().innerHTML = gSM.stringStrength + gSM.stringType;
    }

    private init() {
        let _self = this;
        _self.subscribers = new Array<any>();
        _self.socketIo = UniqueSocket.getInstance().getBasicSocket();
        _self.socketIo.emit('subscribeGSM', {});
        _self.socketIo.on('gSM', (data) => { _self.publish(data); });
        _self.stringStrength = '';
        _self.stringType = '';
        _self.stringError = '';
    }
}
