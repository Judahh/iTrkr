import { AppObject, Component, ComponentPageBody } from 'backappjh';
import { BasicSocket, UniqueSocket } from 'basicsocket';

export class Keyboard extends AppObject {
    private static instance: Keyboard;
    private socketIo: BasicSocket;
    private lastTabindex: number;
    private arrayElementTag;

    public static getInstance(father?: Component): Keyboard {
        if (!Keyboard.instance) {
            Keyboard.instance = new Keyboard(father);
        }
        return Keyboard.instance;
    }

    constructor(father?: Component) {
        super(father);
        this.lastTabindex = 0;
        this.arrayElementTag = ['item', 'divisor', 'leftholder', 'rightholder', 'centerholder', 'combobox', 'select', 'datainput', 'input', 'textfield', 'label', 'box'];
    }

    public run() {
        let _self = this;
        _self.socketIo = UniqueSocket.getInstance().getBasicSocket();
        document.onkeydown = (event) => {
            _self.keyPressed(event);
        };
    }

    private keyPressed(event) {
        // console.log('KEY:', event);
        let key = event.key;
        let stringTabindex: string;
        let tempTabindex: number;
        switch (key) {
            case 'ArrowRight':
                console.log('RIGHT');
                tempTabindex = this.lastTabindex + 1;
                stringTabindex = this.toStringTabindex(tempTabindex);
                if (this.check(stringTabindex)) {
                    this.lastTabindex = tempTabindex;
                } else {
                    this.lastTabindex = tempTabindex - 1;
                }
                stringTabindex = this.toStringTabindex(this.lastTabindex);
                this.seek(stringTabindex).focus();

                break;
            case 'ArrowLeft':
                console.log('LEFT');
                tempTabindex = this.lastTabindex - 1;
                stringTabindex = this.toStringTabindex(tempTabindex);
                if (this.check(stringTabindex)) {
                    this.lastTabindex = tempTabindex;
                } else {
                    this.lastTabindex = tempTabindex + 1;
                }
                stringTabindex = this.toStringTabindex(this.lastTabindex);
                this.seek(stringTabindex).focus();

                break;
            case 'ArrowUp':
                console.log('UP');
                tempTabindex = this.lastTabindex - 10;
                stringTabindex = this.toStringTabindex(tempTabindex);
                if (this.check(stringTabindex)) {
                    this.lastTabindex = tempTabindex;
                } else {
                    this.lastTabindex = tempTabindex + 10;
                }
                stringTabindex = this.toStringTabindex(this.lastTabindex);
                this.seek(stringTabindex).focus();

                break;
            case 'ArrowDown':
                console.log('DOWN');
                tempTabindex = this.lastTabindex + 10;
                stringTabindex = this.toStringTabindex(tempTabindex);
                if (this.check(stringTabindex)) {
                    this.lastTabindex = tempTabindex;
                } else {
                    this.lastTabindex = tempTabindex - 10;
                }
                stringTabindex = this.toStringTabindex(this.lastTabindex);
                this.seek(stringTabindex).focus();

                break;
            case 'Clear':
            case 'Enter':
                console.log('Enter');
                stringTabindex = this.toStringTabindex(this.lastTabindex);
                let element = this.seek(stringTabindex);
                if (element.tagName === 'datainput'.toLocaleUpperCase()) {
                    // console.log(element.firstElementChild.tagName);
                    if (document.activeElement === element.firstElementChild) {
                        this.seek(stringTabindex).focus();
                    } else if (document.activeElement === element.lastElementChild) {
                        this.seek(stringTabindex).focus();
                    } else {
                        element.firstElementChild.focus();
                    }

                    if (element.lastElementChild.tagName === 'label'.toLocaleUpperCase()) {
                        element.firstElementChild.checked = !element.firstElementChild.checked;
                    }
                    // this.eventFire(element.firstElementChild, 'click');
                } else {
                    this.eventFire(element, 'click');
                }

                break;
            case 'Home':
                console.log('back');
                this.eventFire(this.seek('back'), 'click');

                break;
            case 'PageUp':
                console.log('home');
                this.eventFire(this.seek('home'), 'click');

                break;
            case 'End':
                console.log('menu');
                this.eventFire(this.seek('menu'), 'click');

                break;
            case 'PageDown':
                console.log('camera');
                this.eventFire(this.seek('camera'), 'click');

                break;

            default:
                break;
        }
    }

    private eventFire(element, type) {
        if (element == null) {
            console.log('null');
        }
        if (element.fireEvent) {
            element.fireEvent('on' + type);
        } else {
            let event = document.createEvent('Events');
            event.initEvent(type, true, false);
            element.dispatchEvent(event);
        }
        this.lastTabindex = 0;
    }

    private toStringTabindex(tabindex: number): string {
        let stringTabindex: string;
        this.lastTabindex = tabindex;

        if (tabindex < 10) {
            stringTabindex = '0' + tabindex;
        } else {
            stringTabindex = '' + tabindex;
        }

        return stringTabindex;
    }

    private seek(stringTabindex: string) {
        let found = null
        for (let index = 0; index < this.arrayElementTag.length; index++) {
            let elementTag = this.arrayElementTag[index];
            let elements = document.getElementsByTagName(elementTag);
            let arrayElement = Array.prototype.slice.call(elements);
            for (let index2 = 0; index2 < arrayElement.length; index2++) {
                let element = arrayElement[index2];
                let currentTabindex = element.getAttribute('tabindex');
                if (currentTabindex === stringTabindex) {
                    // console.log('FOUND:', element);
                    found = element;
                    return found;
                }
            }
        }
        // this.arrayElementTag.forEach(elementTag => {
        //     let elements = document.getElementsByTagName(elementTag);
        //     var arrayElement = Array.prototype.slice.call(elements);
        //     arrayElement.forEach(element => {
        //         let currentTabindex = element.getAttribute('tabindex');
        //         if (currentTabindex == stringTabindex) {
        //             // console.log('FOUND:', element);
        //             found = element;
        //             return found;
        //         }
        //     });
        // });
        return found;
    }

    private check(stringTabindex: string) {
        return this.seek(stringTabindex) != null;
    }

    // public getGSMData(callback, sendData) {
    //     let _self = this;
    //     _self.socketIo.emit('getGSMData', sendData);
    //     _self.socketIo.on('gsmData', callback);
    // }

    // public refreshGSMData(sendData) {
    //     let _self = this;
    //     _self.socketIo.emit('getGSMData', sendData);
    // }
}
