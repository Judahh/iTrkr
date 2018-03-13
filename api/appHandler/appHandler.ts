import { BasicAppHandler, BasicSocket } from 'backapijh';
import { HardwareHandler } from '../hardwareHandler/hardwareHandler';

export class AppHandler extends BasicAppHandler {

    constructor(hardwareHandler: HardwareHandler) {
        super(hardwareHandler);
    }

    // tslint:disable-next-line:no-empty
    public init() { }

    public subscribeGPS(socket) {
        this.hardwareHandler.subscribeGPS((data) => {
            socket.emit('gPS', data);
        });
    }

    public subscribeDisk(socket) {
        this.hardwareHandler.subscribeDisk((data) => {
            socket.emit('disk', data);
        });
    }

    public subscribeNewDevice(socket) {
        this.hardwareHandler.subscribeNewDevice((data) => {
            socket.emit('newDevice', data);
        });
    }

    public subscribeDevices(socket) {
        this.hardwareHandler.subscribeDevices((data) => {
            socket.emit('devices', data);
        });
    }

    public externalPublish(subscribers, data) {
        this.hardwareHandler.externalPublish(subscribers, data);
    }

    public externalSubscribe(subscribers, socket) {
        this.hardwareHandler.externalSubscribe(subscribers, (data) => {
            socket.emit(subscribers, data);
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

    public externalSubscribeStream(subscribers, socket) {
        this.hardwareHandler.externalSubscribe(subscribers, (data) => {
            socket.emit('stream', data);
        });
    }

    public configSocket(socketBasic: BasicSocket) {
        let _self = this;

        socketBasic.on('subscribeGPS', () => { _self.subscribeGPS(socketBasic); });

        socketBasic.on('signUp', (user) => { _self.hardwareHandler.signUp(user, socketBasic); });
        socketBasic.on('signIn', (user) => { _self.hardwareHandler.signIn(user, socketBasic); });

        socketBasic.on('subscribeStream', () => { _self.externalSubscribeStream('streamOut', socketBasic); });
        socketBasic.on('stream', (stream) => { _self.externalPublish('streamIn', stream); });

        socketBasic.on('subscribeDisk', () => { _self.subscribeDisk(socketBasic); });

        socketBasic.on('subscribeNewDevice', () => { _self.subscribeNewDevice(socketBasic); });
        socketBasic.on('getUsers', () => { _self.hardwareHandler.getUsers(socketBasic); });

        socketBasic.on('setUsers', (data) => { _self.hardwareHandler.setUsers(data.device, data.users); });
        socketBasic.on('addUser', (data) => { _self.hardwareHandler.addUser(data.device, data.user); });
        socketBasic.on('removeUser', (data) => { _self.hardwareHandler.removeUser(data.device, data.user); });

        socketBasic.on('getDevices', () => { _self.hardwareHandler.getDevices(); });
    }

}
