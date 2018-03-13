import { Observer } from 'backapijh';
import * as childProcess from 'child_process';
import * as os from 'os';
import * as fs from 'fs';

export class Disk implements Observer {
    private subscribers: Array<any>;
    private lastFile: string;
    private currentFile: string;

    constructor() {
        this.subscribers = new Array();
    }

    public uploadDevicePosition(device) {
        let _self = this;
        let path = os.platform() === 'win32' ? process.env.WIN32_DEVICE_PATH : process.env.LINUX_DEVICE_PATH;
        fs.appendFile(path + '/' + device.name + '.json', device, (error) => {
            if (error) {
                // if (error.code != 'ENOENT') {
                _self.error(error);
                // }
                return;
            } else {
                _self.publish({
                    uploaded: {
                        name: device.name,
                        location: device.location,
                        path: (path + '/' + device.name + '.json')
                    }
                });
            }
        });
    }

    public subscribe(callback) {
        // we could check to see if it is already subscribed
        this.subscribers.push(callback);
        console.log(callback.name, 'has been subscribed to Disk');
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

    private error(error) {
        console.error('DISK ERROR:' + error);
    }
}
