import { AppObject, Component, ComponentPageBody, ComponentInformation, Observer } from 'backappjh';
import { BasicSocket, UniqueSocket } from 'basicsocket';

export class GPS extends AppObject implements Observer {
    private static instance: GPS;
    private socketIo: BasicSocket;
    private subscribers: Array<any>;

    public static getInstance(father?: Component): GPS {
        if (!GPS.instance) {
            GPS.instance = new GPS(father);
        }
        return GPS.instance;
    }

    constructor(father?: Component) {
        super(father);
        this.init();
    }

    public subscribe(callback) {
        // we could check to see if it is already subscribed
        this.subscribers.push(callback);
        console.log(callback.name, 'has been subscribed to GPS');
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

    public run(component) {
        let gPS = GPS.getInstance();
        gPS.subscribe((data) => { gPS.runGPS(component, data); });
    }

    public runGPS(component, data) {
        let _self = this;
        // console.log("GPS:",data);
        if (data) {
            (<ComponentInformation>component).getElement().innerHTML = '';
        } else {
            (<ComponentInformation>component).getElement().innerHTML = '';
        }
    }

    private init() {
        let _self = this;
        _self.subscribers = new Array<any>();
        _self.socketIo = UniqueSocket.getInstance().getBasicSocket();
        _self.socketIo.emit('subscribeGPS', {});
        _self.socketIo.on('gPS', (data) => { _self.publish(data); });
    }
}
