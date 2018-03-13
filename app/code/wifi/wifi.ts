import { AppObject, Component, ComponentDataInput, ComponentOption, ComponentInformation, ComponentPageBody, Observer } from 'backappjh';
import { BasicSocket, UniqueSocket } from 'basicsocket';

export class Wifi extends AppObject implements Observer {
    private static instance: Wifi;
    private socketIo: BasicSocket;
    private subscribers: Array<any>;

    public static getInstance(father?: Component): Wifi {
        if (!Wifi.instance) {
            Wifi.instance = new Wifi(father);
        }
        return Wifi.instance;
    }

    constructor(father?: Component) {
        super(father);
        this.init();
    }

    public getWifiConnections(data) {
        let _self = this;
        _self.socketIo.emit('getWifiConnections', data);
    }

    public getWifiConnected(data) {
        let _self = this;
        _self.socketIo.emit('getWifiConnected', data);
    }

    public setWifiConnection(data) {
        let _self = this;
        _self.socketIo.emit('setWifiConnection', data);
    }

    public subscribe(callback) {
        // we could check to see if it is already subscribed
        this.subscribers.push(callback);
        console.log(callback.name, 'has been subscribed to Wifi');
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
        let wifi = Wifi.getInstance();
        wifi.subscribe((data) => { wifi.strength(component, data); });
        wifi.getWifiConnected({});
    }

    public strength(component, data) {
        if (data.current) {
            if (data.current.length > 0) {

                let highestStrength = 0;
                data.current.forEach(element => {
                    let asu = (113 + parseInt(element.signal_level, 10)) / 2;

                    let strength = (asu / 31) * 100;

                    if (strength > 100) {
                        strength = 100;
                    } else if (strength < 0) {
                        strength = 0;
                    }

                    if (highestStrength < strength) {
                        highestStrength = strength;
                    }
                });
                // console.log('WifiConnections');
                // console.log(highestStrength);
                // highestStrength=6;
                if (highestStrength > 75) {
                    (<ComponentInformation>component).getElement().innerHTML = '\u{F162}'; // '';
                } else if (highestStrength > 50) {
                    (<ComponentInformation>component).getElement().innerHTML = '\u{F161}';
                } else if (highestStrength > 25) {
                    (<ComponentInformation>component).getElement().innerHTML = '\u{F160}';
                } else if (highestStrength > 0) {
                    (<ComponentInformation>component).getElement().innerHTML = '\u{F15F}';
                } else {
                    (<ComponentInformation>component).getElement().innerHTML = '\u{F15E}';
                }
            } else {
                (<ComponentInformation>component).getElement().innerHTML = '';
            }
        }

        // let t = setTimeout(() => {_self.wifi.refreshWifiConnected({});}, _self.delay);
        // this.destroyElement();
    }

    public connect(component) {
        let selectedIndex = (<HTMLSelectElement>(<ComponentDataInput>(<ComponentPageBody>component.getFather()).arrayAppObject[3].arrayAppObject[0].arrayAppObject[0].arrayAppObject[0]).arrayComboBox[0].getElement()).selectedIndex;
        let selected = (<HTMLSelectElement>(<ComponentDataInput>(<ComponentPageBody>component.getFather()).arrayAppObject[3].arrayAppObject[0].arrayAppObject[0].arrayAppObject[0]).arrayComboBox[0].getElement()).options[selectedIndex].text;
        let password = (<HTMLInputElement>(<ComponentDataInput>(<ComponentPageBody>component.getFather()).arrayAppObject[4].arrayAppObject[0]).arrayTextField[0].getElement()).value;
        console.log(selected);
        console.log(password);

        let wifi = Wifi.getInstance();
        wifi.subscribe((data) => { wifi.connectResponse(component, data); });
        wifi.setWifiConnection({ ssid: selected, password: password });
    }

    public connectResponse(component, data) {
        if (data.connected) {
            console.log(data.connected);
        }
    }

    public getConnected(component) {
        let wifi = Wifi.getInstance();
        wifi.subscribe((data) => { wifi.connected(component, data); });
        wifi.getWifiConnected({});
    }

    public connected(component, data) {
        if (component != null && document.getElementById(component.getElement().id) != null) {
            // console.log("CONECTED:"+component.getElement().id);
            // console.log("CONECTED:");
            if (data.current) {
                if (data.current.length > 0) {
                    (<ComponentInformation>component).getElement().innerHTML = data.current[0].ssid;
                } else {
                    (<ComponentInformation>component).getElement().innerHTML = '';
                }
            }
        }

        // component.destroyElement();
    }

    public getConnections(component) {
        let wifi = Wifi.getInstance();
        wifi.subscribe((data) => { wifi.connections(component, data); });
        wifi.getWifiConnections({});
    }

    public connections(component, data) {
        if (data.visible) {
            (<ComponentDataInput>component).arrayComboBox[0].destroyChildElements();
            (<ComponentDataInput>component).arrayComboBox[0].arrayOption = new Array<ComponentOption>();
            (<ComponentDataInput>component).arrayComboBox[0].arrayOption.type = ComponentOption;

            console.log(data.visible);
            data.visible.forEach(network => {
                let option: ComponentOption = new ComponentOption((<ComponentDataInput>component).arrayComboBox[0]);
                option.getElement().innerHTML = network.ssid;
                console.log(network.ssid);
                (<ComponentDataInput>component).arrayComboBox[0].arrayOption.push(option);
            });

            // component.destroyElement();
        }
    }

    private init() {
        let _self = this;
        _self.subscribers = new Array<any>();
        _self.socketIo = UniqueSocket.getInstance().getBasicSocket();
        _self.socketIo.emit('subscribeWifi', {});
        _self.socketIo.on('wifi', (data) => { _self.publish(data); });
    }
}
