import { Disk } from './../disk/disk';
import { Handler, Event, Operation, Database } from 'flexiblepersistence';
import { ExternalHandler } from '../externalHandler/externalHandler';
import { BasicHardwareHandler } from 'backapijh';
// let packageJson = require('./../package.json');

export class HardwareHandler extends BasicHardwareHandler {
    private disk: Disk;
    private externalSubscribers: any;
    private externalSubscribersOldData: any;
    private deviceSubscribers: any;
    private externalHandler: ExternalHandler;

    constructor() {
        super();
        this.disk = new Disk();
        this.deviceSubscribers = {};
        this.externalSubscribers = {};
        this.externalSubscribersOldData = {};
    }

    public getExternalHandler() {
        return this.externalHandler;
    }

    public setExternalHandler(externalHandler: ExternalHandler) {
        this.externalHandler = externalHandler;
    }

    // tslint:disable-next-line:no-empty
    public init() { }

    public getDevices() {
        this.externalHandler.getDevices();
    }

    public getDisk() {
        return this.disk;
    }

    public subscribeDisk(callback) {
        let _self = this;
        this.disk.subscribe((data) => {
            callback(data);
        });
    }

    public subscribeGPS(callback) {
        let _self = this;
        this.externalSubscribe('gPS', (data) => {
            callback(data);
        });
    }

    public subscribeNewDevice(callback) {
        let _self = this;
        this.externalSubscribe('newDevice', (data) => {
            callback(data);
        });
    }

    public subscribeDevices(callback) {
        let _self = this;
        this.externalSubscribe('devices', (data) => {
            callback(data);
        });
    }

    public externalSubscribe(subscribers, callback) {
        this.checkExternalSubscribers(subscribers);
        this.externalSubscribers[subscribers].push(callback);
        this.externalSubscribersOldData[subscribers].forEach((data) => {
            callback(data);
        });
        console.log(callback.name, 'has been subscribed to', subscribers);
    }

    public externalUnsubscribe(subscribers, callback) {
        this.checkExternalSubscribers(subscribers);
        this.externalSubscribers[subscribers] = this.externalSubscribers[subscribers].filter((element) => {
            return element !== callback;
        });
    }

    public externalPublish(subscribers, data) {
        this.checkExternalSubscribers(subscribers);
        this.externalSubscribers[subscribers].forEach((subscriber) => {
            subscriber(data);
        });
        this.externalSubscribersOldData[subscribers].push(data);
    }

    public deviceSubscribe(device, subscribers, callback) {
        this.checkDeviceSubscribers(device, subscribers);
        this.deviceSubscribers[device][subscribers].push(callback);
        console.log(callback.name, 'has been subscribed to', subscribers);
    }

    public deviceUnsubscribe(device, subscribers, callback) {
        this.checkDeviceSubscribers(device, subscribers);
        this.deviceSubscribers[device][subscribers] = this.deviceSubscribers[device][subscribers].filter((element) => {
            return element !== callback;
        });
    }

    public devicePublish(device, subscribers, data) {
        this.checkDeviceSubscribers(device, subscribers);
        this.deviceSubscribers[device][subscribers].forEach((subscriber) => {
            subscriber(data);
        });
    }

    private checkExternalSubscribers(subscribers) {
        if (this.externalSubscribers[subscribers] === undefined) {
            this.externalSubscribers[subscribers] = new Array<any>();
            this.externalSubscribersOldData[subscribers] = new Array<any>();
        }
    }

    private checkDeviceSubscribers(device, subscribers) {
        if (this.deviceSubscribers[device] === undefined) {
            this.deviceSubscribers[device] = {};
        }
        if (this.deviceSubscribers[device][subscribers] === undefined) {
            this.deviceSubscribers[device][subscribers] = new Array<any>();
        }
    }
}
