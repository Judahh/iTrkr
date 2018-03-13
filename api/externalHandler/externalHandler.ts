import { path, BasicApi, BasicExternalHandler, BasicSocket } from 'backapijh';
import { HardwareHandler } from '../hardwareHandler/hardwareHandler';
import { findmyphone } from 'find-my-iphone';

export class ExternalHandler extends BasicExternalHandler {

    constructor(hardwareHandler: HardwareHandler) {
        super(hardwareHandler);
        this.hardwareHandler.setExternalHandler(this);
    }

    protected init() {
        let _self = this;
        findmyphone.apple_id = process.env.I_U;
        findmyphone.password = process.env.I_P;
        findmyphone.getDevices((error, devices) => { _self.devices(error, devices); });
    }

    public devices(error, devices, oldDevices?) {
        let _self = this;
        if (oldDevices === undefined) {
            devices.forEach(device => {
                console.log(device);
                _self.hardwareHandler.getDisk().uploadDevicePosition(device);
            });
        } else {
            devices.forEach(device => {
                let ok = false;
                oldDevices.forEach(oldDevice => {
                    if (device.name === oldDevice.name) {
                        ok = true;
                        if (device.location.latitude !== oldDevice.location.latitude ||
                            device.location.longitude !== oldDevice.location.longitude) {
                            console.log(device);
                            _self.hardwareHandler.getDisk().uploadDevicePosition(device);
                        }
                    }
                });
                if (!ok) {
                    console.log(device);
                    _self.hardwareHandler.getDisk().uploadDevicePosition(device);
                }
            });
        }
        findmyphone.getDevices((newError, newDevices) => { _self.devices(newError, newDevices, devices); });
    }

    public uploadVideo(video) {
        this.hardwareHandler.uploadVideo(video);
    }

    public externalPublish(subscribers, data) {
        this.hardwareHandler.externalPublish(subscribers, data);
    }

    public externalSubscribe(subscribers, socket) {
        this.hardwareHandler.externalSubscribe(subscribers, (data) => {
            socket.emit(subscribers, data);
        });
    }

    public externalSubscribeStream(subscribers, socket) {
        this.hardwareHandler.externalSubscribe(subscribers, (data) => {
            socket.emit('stream', data);
        });
    }

    public devicePublish(device, subscribers, data) {
        this.hardwareHandler.devicePublish(device, subscribers, data);
    }

    public deviceSubscribe(device, subscribers, socket) {
        this.hardwareHandler.deviceSubscribe(device, subscribers, (data) => {
            socket.emit(subscribers, data);
        });
    }

    public getDevices() {
        for (let index = 0; index < this.arraySocket.length; index++) {
            let socketBasic = this.arraySocket[index];
            socketBasic.emit('getUsers', {});
        }
    }

    public users(socketBasic, users) {
        let identification = socketBasic.getIdentification();
        this.externalPublish('newDevice', { identification: identification, users: users });
    }

    protected serverConnected(socketBasic) {
        console.log('ID:', socketBasic.getIdentification());
        socketBasic.emit('subscribeGPS', {});
        socketBasic.emit('subscribeDisk', {});
        socketBasic.emit('getUsers', {});
    }

    public configSocket(socketBasic: BasicSocket) {
        let _self = this;
        socketBasic.on('online', (online) => {
            _self.externalPublish('online', online);
        });
        socketBasic.on('gPS', (data) => {
            _self.externalPublish('gPS', data);
        });
        socketBasic.on('subscribeUser', () => {
            _self.deviceSubscribe(socketBasic.getIdentification().serialNumber, 'user', socketBasic);
        });
        socketBasic.on('subscribeRemoveUser', () => {
            _self.deviceSubscribe(socketBasic.getIdentification().serialNumber, 'removeUser', socketBasic);
        });
        socketBasic.on('subscribeUsers', () => {
            _self.deviceSubscribe(socketBasic.getIdentification().serialNumber, 'users', socketBasic);
        });

        socketBasic.on('disk', (data) => {
            _self.uploadVideo(data.upload);
        });

        socketBasic.on('users', (users) => {
            _self.users(socketBasic, users);
        });

        // console.log(socketBasic.getIdentification());
        // _self.externalPublish('newDevice', _self.getFullIdentification(socketBasic));
        // this.io.on()
    }
}
