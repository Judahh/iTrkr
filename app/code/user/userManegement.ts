import { AppObject, Component, ComponentItem, ComponentDataInput, ComponentOption, ComponentPageBody, ComponentView, ComponentComboBox, ComponentInformation, AppObjectEvent, ComponentNotification } from 'backappjh';
import { BasicSocket, UniqueSocket } from 'basicsocket';
import { User } from './user';
import { Authentication } from './authentication';
import { Address } from './address';
import { Phone } from './phone';
import { Permission } from './permission';

export class UserManegement extends AppObject {
    private static instance: UserManegement;
    private socketIo: BasicSocket;
    private subscribers: Array<any>;
    private subscribersSign: Array<any>;
    private logged: User;
    private tempRegister: User;
    private menu: any;
    private tempObjectArray: Array<any>;

    public static getInstance(father?: Component): UserManegement {
        if (!UserManegement.instance) {
            UserManegement.instance = new UserManegement(father);
        }
        return UserManegement.instance;
    }

    constructor(father?: Component) {
        super(father);
        this.init();
    }

    public subscribeSign(callback) {
        // we could check to see if it is already subscribed
        this.subscribersSign.push(callback);
        console.log(callback.name, 'has been subscribed to UserManegement Sign');
    }

    public unsubscribeSign(callback) {
        this.subscribersSign = this.subscribersSign.filter((element) => {
            return element !== callback;
        });
    }

    public publishSign(data) {
        this.subscribersSign.forEach((subscriber) => {
            subscriber(data);
        });
    }

    public subscribe(callback) {
        // we could check to see if it is already subscribed
        this.subscribers.push(callback);
        console.log(callback.name, 'has been subscribed to UserManegement');
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

    public createUser(component) {
        // console.log('createUser!!!');
        let divisor: Component = <Component>(<ComponentPageBody>component.getFather().getFather().getFather());
        let arrayField: Array<HTMLInputElement> = new Array<HTMLInputElement>();
        arrayField.push(<HTMLInputElement>(<Component>divisor.arrayAppObject[0].arrayAppObject[0].arrayAppObject[0]).getElement());
        arrayField.push(<HTMLInputElement>(<Component>divisor.arrayAppObject[1].arrayAppObject[0].arrayAppObject[0]).getElement());
        arrayField.push(<HTMLInputElement>(<Component>divisor.arrayAppObject[1].arrayAppObject[1].arrayAppObject[0]).getElement());
        arrayField.push(<HTMLInputElement>(<Component>divisor.arrayAppObject[2].arrayAppObject[0].arrayAppObject[0]).getElement());
        arrayField.push(<HTMLInputElement>(<Component>divisor.arrayAppObject[2].arrayAppObject[1].arrayAppObject[0]).getElement());
        arrayField.push(<HTMLInputElement>(<Component>divisor.arrayAppObject[3].arrayAppObject[0].arrayAppObject[0]).getElement());
        arrayField.push(<HTMLInputElement>(<Component>divisor.arrayAppObject[4].arrayAppObject[0].arrayAppObject[0]).getElement());
        arrayField.push(<HTMLInputElement>(<Component>divisor.arrayAppObject[4].arrayAppObject[1].arrayAppObject[0]).getElement());
        arrayField.push(<HTMLInputElement>(<Component>divisor.arrayAppObject[4].arrayAppObject[2].arrayAppObject[0]).getElement());
        console.log(arrayField[0].value, arrayField[1].value, arrayField[2].value,
            arrayField[3].value, arrayField[4].value, arrayField[5].value,
            arrayField[6].value, arrayField[7].value, arrayField[8].value);

        if (this.checkEquals(arrayField[7], arrayField[8]) && !this.checkArrayEmpty(arrayField)) {
            let header = divisor.getHeader();
            (<ComponentNotification>header.arrayAppObject[1]).goToNotification('none');
            let auth = new Authentication(arrayField[7].value, Permission.User);
            let user = new User(arrayField[6].value, arrayField[0].value, new Date(arrayField[1].value), arrayField[2].value,
                arrayField[3].value, arrayField[4].value, auth);
            // console.log(user);
            this.socketIo.emit('signUp', user);
        } else {
            let header = divisor.getHeader();
            (<ComponentNotification>header.arrayAppObject[1]).goToNotification('missingFields');
        }
    }

    // tslint:disable-next-line:no-empty
    public clearUserInputs(component) { }

    public signIn(component) {
        console.log('signIn');
        this.tempRegister = undefined;
        let divisor: Component = <Component>(<ComponentPageBody>component.getFather().getFather().getFather());
        let arrayField: Array<HTMLInputElement> = new Array<HTMLInputElement>();
        arrayField.push(<HTMLInputElement>(<Component>divisor.arrayAppObject[0].arrayAppObject[0].arrayAppObject[0]).getElement());
        arrayField.push(<HTMLInputElement>(<Component>divisor.arrayAppObject[1].arrayAppObject[0].arrayAppObject[0]).getElement());
        console.log(divisor, arrayField[0].value, arrayField[1].value);
        if (!this.checkArrayEmpty(arrayField)) {
            let header = divisor.getHeader();
            (<ComponentNotification>header.arrayAppObject[1]).goToNotification('none');
            this.socketIo.emit('signIn', { username: arrayField[0].value, password: arrayField[1].value });
        } else {
            let header = divisor.getHeader();
            (<ComponentNotification>header.arrayAppObject[1]).goToNotification('missingFields');
        }
    }

    public signUp(component) {
        let divisor: Component = <Component>(<ComponentPageBody>component.getFather().getFather().getFather());
        let arrayField: Array<HTMLInputElement> = new Array<HTMLInputElement>();
        arrayField.push(<HTMLInputElement>(<Component>divisor.arrayAppObject[0].arrayAppObject[0].arrayAppObject[0]).getElement());
        arrayField.push(<HTMLInputElement>(<Component>divisor.arrayAppObject[1].arrayAppObject[0].arrayAppObject[0]).getElement());
        let header = divisor.getHeader();
        (<ComponentNotification>header.arrayAppObject[1]).goToNotification('none');
        this.tempRegister = <User>{
            'username': arrayField[0].value,
            'authentication': new Authentication(arrayField[1].value)
        };
        this.goTo('signUp');
    }

    public checkArrayEmpty(arrayField: Array<HTMLInputElement>) {
        let empty = false;
        arrayField.forEach(field => {
            if (this.checkEmpty(field)) {
                empty = true;
            }
        });
        return empty;
    }

    public checkEquals(field0: HTMLInputElement, field1: HTMLInputElement) {
        if (field0.value !== field1.value) {
            this.errorField(field1);
            return false;
        }
        this.okField(field1);
        return true;
    }

    public checkEmpty(field: HTMLInputElement) {
        if (field.value === '') {
            this.errorField(field);
            return true;
        }
        this.okField(field);
        return false;
    }

    public errorField(field: HTMLInputElement) {
        field.setAttribute('style', 'border-bottom-color: red');
    }

    public okField(field: HTMLInputElement) {
        field.setAttribute('style', 'border-bottom-color: white');
    }

    public getUsernameAndPassword(component) {
        let _self;
        if (this !== undefined) {
            _self = this;
        } else {
            _self = UserManegement.getInstance();
        }

        if (_self.tempRegister !== undefined) {
            // console.log(component);
            let divisor: Component = <Component>(<ComponentPageBody>component.getFather().getFather().getFather());
            (<HTMLInputElement>(<Component>divisor.arrayAppObject[4].arrayAppObject[0].arrayAppObject[0]).getElement()).value = _self.tempRegister.username;
            (<HTMLInputElement>(<Component>divisor.arrayAppObject[4].arrayAppObject[1].arrayAppObject[0]).getElement()).value = _self.tempRegister.authentication.password;
        }
    }

    public getPermission(component) {
        let _self;
        if (this !== undefined) {
            _self = this;
        } else {
            _self = UserManegement.getInstance();
        }

        // console.log(_self.logged);

        let arrayOption = (<ComponentComboBox>component).arrayOption;
        arrayOption = new Array<ComponentOption>();

        if (_self.logged !== undefined) {
            while (arrayOption.length < _self.logged.authentication.permission + 1) {
                let option = new ComponentOption(component);
                option.information = Permission[arrayOption.length];
                option.renderAfterUpdateJSON();
                arrayOption.push(option);
            }
        } else {
            let option = new ComponentOption(component);
            option.information = Permission[arrayOption.length];
            option.renderAfterUpdateJSON();
            arrayOption.push(option);
        }
    }

    public getInfo(user: User) {
        // let menuDivisor = this.getHeader().arrayAppObject[0].arrayAppObject[0].arrayAppObject[0].arrayAppObject[0].arrayAppObject[0].arrayAppObject[0];

        // let username = <AppObject>menuDivisor.arrayAppObject[0].arrayAppObject[1].arrayAppObject[0].arrayAppObject[0].arrayAppObject[0].arrayAppObject[0].arrayAppObject[0].arrayAppObject[0].arrayAppObject[0];
        // let information = <ComponentInformation>username.arrayAppObject[0];
        // information.getElement().innerHTML = user.authentication.username;

        // let group = <AppObject>menuDivisor.arrayAppObject[0].arrayAppObject[2].arrayAppObject[0].arrayAppObject[0].arrayAppObject[0].arrayAppObject[0].arrayAppObject[0].arrayAppObject[0].arrayAppObject[0];
        // information = <ComponentInformation>group.arrayAppObject[0];
        // let auth: Permission = user.authentication.permission;
        // information.getElement().innerHTML = Permission[auth];
        // information.information = Permission[auth];
        // information.renderAfterUpdateJSON();
    }

    public log(data) {
        if (data.userManegement !== undefined) {
            // console.log(this);
            // console.log(UserManegement.getInstance());
            if (!data.userManegement.user) {
                let header = this.getHeader();
                (<ComponentNotification>header.getAppObject('ComponentNotification')).goToNotification('wrongUser');
            } else {
                if (this !== undefined) {
                    // console.log('A');
                    let header = this.getHeader();
                    (<ComponentNotification>header.getAppObject('ComponentNotification')).goToNotification('none');
                    this.goTo('home');
                    this.refreshHeader();
                    this.getInfo(data.userManegement.user);
                } else {
                    // console.log('B');
                    let header = UserManegement.getInstance().getHeader();
                    (<ComponentNotification>header.getAppObject('ComponentNotification')).goToNotification('none');
                    UserManegement.getInstance().goTo('home');
                    UserManegement.getInstance().refreshHeader();
                    UserManegement.getInstance().getInfo(data.userManegement.user);
                }
            }
            if (this !== undefined) {
                this.logged = data.userManegement.user;
                this.publishSign(data.userManegement.user !== undefined);
            } else {
                UserManegement.getInstance().logged = data.userManegement.user;
                UserManegement.getInstance().publishSign(data.userManegement.user !== undefined);
            }

        }
    }

    public isLogged(component?) {
        if (component !== undefined) {
            if (this !== undefined) {
                this.menu = component;
            } else {
                UserManegement.getInstance().menu = component;
            }
        }
        return (UserManegement.getInstance().logged !== undefined);
    }

    public goToLogin() {
        if (this !== undefined) {
            if (!this.isLogged()) {
                this.goTo('login');
            }
        } else {
            if (!UserManegement.getInstance().isLogged()) {
                UserManegement.getInstance().goTo('login');
            }
        }
    }

    public logout(component?) {
        this.socketIo.emit('logoff', {});
        if (this !== undefined) {
            this.logged = undefined;
            this.goTo('login');
            this.refreshHeader();
        } else {
            UserManegement.getInstance().logged = undefined;
            UserManegement.getInstance().goTo('login');
            UserManegement.getInstance().refreshHeader();
        }
        if (component !== undefined) {
            if (this !== undefined) {
                this.menu = component.getFather().getFather();
                this.menu.destroyElement();
            } else {
                UserManegement.getInstance().menu = component.getFather().getFather();
                UserManegement.getInstance().menu.destroyElement();
            }
        }
    }

    public getUsers(component) {
        let userManegement = UserManegement.getInstance();
        userManegement.socketIo.emit('getUsers', {});
        userManegement.subscribe((data) => { userManegement.users(component, data); });
    }

    public users(component, data) {
        if (data.users !== undefined) {
            console.log('Users!!!', data.users);
            for (let index = 0; index < data.users.length; index++) {
                const user = data.users[index];
                this.newLine(component, user.authentication.username, ['user']);
            }
        }
    }

    public getDevices(component) {
        let userManegement = UserManegement.getInstance();
        userManegement.subscribe((data) => { userManegement.devices(component, data); });
    }

    public devices(component, data) {
        // component.destroyChildElements();
        if (data.devices !== undefined) {
            console.log('DEVICES!!!', data.devices);
            console.log('com', component);
            for (let index = 0; index < data.devices.length; index++) {
                let device = data.devices[index];
                this.newDevice(component, device);
            }
        }
    }

    public getNewDevice(component) {
        let userManegement = UserManegement.getInstance();
        userManegement.subscribe((data) => { userManegement.newDevice(component, data); });
    }

    public newDevice(component, data) {
        if (data.newDevice !== undefined) {
            console.log('NEW DEVICE!!!', data.newDevice);
            console.log('com', component);
            let line = this.newLine(component, data.newDevice.identification.serialNumber, ['user', 'device']);
            for (let index = 0; index < data.newDevice.users.length; index++) {
                let user = data.newDevice.users[index];
                this.newLine(<Component>line.arrayAppObject[0].arrayAppObject[1].arrayAppObject[0], user, ['user']);
            }
        }
    }

    public drag(component?, event?, type?: string) {
        if (event !== undefined && component !== undefined) {
            // event.dataTransfer.setData('object', component);
            component.type = type;
            this.getTempObjectArray().push(Object.create(component));
            // console.log('DRAG', event, component);
            // console.log('DRAGtype', type);
        }
    }

    public dropRemove(component?, event?, type?: string) {
        for (let index = 0; index < this.getTempObjectArray().length; index++) {
            let data = this.getTempObjectArray()[index];
            console.log('DROPtype', type);
            console.log('DROPtype2', data.type);
            if (event !== undefined && component !== undefined && data.type === type) {
                data = <Component>data;
                event.preventDefault();
                console.log('DROP', component);
                console.log(data);
                let device = data.getFather().getFather().getFather().arrayAppObject[0].getElement().textContent;
                let user = data.getElement().textContent;
                // console.log('F',  data.getFather().getFather().getFather());
                console.log('removeU', user);
                console.log('removeD', device);
                this.socketIo.emit('removeUser', { device: device, user: user });
                this.refreshGUI(data.getFather().getFather().getFather().getFather().getFather());
            }
        }
    }

    public drop(component?, event?, type?: string) {
        for (let index = 0; index < this.getTempObjectArray().length; index++) {
            let data = this.getTempObjectArray()[index];
            // console.log('DROPtype', type);
            // console.log('DROPtype2', data.type);
            if (event !== undefined && component !== undefined && data.type === type) {
                data = <Component>data;
                event.preventDefault();
                console.log('DROP', component);
                console.log(data);
                let device = component.getFather().getFather().arrayAppObject[0].getElement().textContent;
                let user = data.getElement().textContent;
                console.log('new', user, device);
                this.socketIo.emit('addUser', { device: device, user: user });
                this.refreshGUI(component.getFather().getFather().getFather().getFather());
            }
        }
    }

    public refreshGUI(component) {
        if (component.arrayTableLine.length > 0) {
            // console.log('DESTROY', component, component.arrayTableLine.length);
            component.destroyChildElements();
            component.arrayTableLine = new Array<any>();
            // console.log('DESTROYED', component, component.arrayTableLine.length);
            this.socketIo.emit('getDevices', {});
        }
    }

    public allowDrop(component?, event?, type?: string) {
        for (let index = 0; index < this.getTempObjectArray().length; index++) {
            let data = this.getTempObjectArray()[index];
            // console.log('ADROPtype', type);
            // console.log('ADROPtype2', data.type);
            if (event !== undefined && component !== undefined && data.type === type) {
                event.preventDefault();
            } else {
                this.getTempObjectArray().slice(index);
            }
        }
    }

    public getTempObjectArray() {
        return this.tempObjectArray;
    }

    public setTempObjectArray(tempObjectArray) {
        this.tempObjectArray = tempObjectArray;
    }

    private init() {
        let _self = this;
        _self.tempObjectArray = new Array<any>();
        _self.subscribers = new Array<any>();
        _self.subscribersSign = new Array<any>();
        _self.socketIo = UniqueSocket.getInstance().getBasicSocket();
        _self.subscribe((data) => { _self.log(data); });

        _self.socketIo.emit('subscribeUserManegement', {});
        _self.socketIo.on('userManegement', (data) => { _self.publish({ userManegement: data }); });

        _self.socketIo.emit('subscribeNewDevice', {});

        _self.socketIo.on('newDevice', (data) => { _self.publish({ newDevice: data }); });
        _self.socketIo.on('devices', (data) => { _self.publish({ devices: data }); });
        _self.socketIo.on('users', (data) => { _self.publish({ users: data }); });

        _self.socketIo.emit('getDevices', {});
    }

    private goTo(page: string) {
        let header;
        let pageBody;
        if (this !== undefined) {
            header = this.getHeader();
            pageBody = this.getPageBody();
        } else {
            header = UserManegement.getInstance().getHeader();
            pageBody = UserManegement.getInstance().getPageBody();
        }
        if (pageBody !== undefined) {
            // console.log('pageBody', pageBody);
            pageBody.goToPage(page);
        } else if (header !== undefined) {
            pageBody = (<ComponentView>header.getFather()).pageBody;
            // console.log('pageBody H', pageBody);
            pageBody.goToPage(page);
        }
    }

    private refreshHeader() {
        let header: Component;
        let pageBody;
        if (this !== undefined) {
            header = this.getHeader();
            pageBody = this.getPageBody();
        } else {
            header = UserManegement.getInstance().getHeader();
            pageBody = UserManegement.getInstance().getPageBody();
        }
        if (header !== undefined) {
            header.getFather();
        } else {
            header = pageBody.getFather().header;
        }

        // (<Component>header.arrayAppObject[0]).insert(header.getElement());
    }

    private newLine(fatherTable: Component, text: string, type: Array<string>) {
        let line = new Component('tr', fatherTable);
        line.getElement().setAttribute('style', 'border-style: groove;border-width: 1px;box-sizing: border-box;display: inline-block;width: 100%;');
        line.getElement().setAttribute('draggable', 'true');
        let event = new AppObjectEvent(line);
        let currentType = type.pop();
        event.name = 'dragstart';
        event.code = 'UserManegement';
        event.runFunction = 'drag(this,event,"" + currentType + "")';
        console.log('new line:', currentType);
        line.arrayAppObjectEvent.push(event);
        line.renderAfterUpdateJSON();
        let cell = new Component('tr', line);
        cell.getElement().setAttribute('style', 'width: 100%;height: 100%;display: block;float: left;box-sizing: border-box;');
        let divisor = new Component('th', cell);
        divisor.getElement().setAttribute('style', 'width: 100%;');
        let item = new ComponentItem(divisor);
        item.getElement().setAttribute('style', 'width: 100%;');

        let animationSubEffectHolder = new Component('animationSubEffectHolder', <Component>item.arrayAppObject[0].arrayAppObject[0].arrayAppObject[0].arrayAppObject[0]);
        (<ComponentInformation>animationSubEffectHolder.arrayAppObject[0]).information = text;
        (<ComponentInformation>animationSubEffectHolder.arrayAppObject[0]).getElement().innerHTML = text;

        item.arrayAppObject[0].arrayAppObject[0].arrayAppObject[0].arrayAppObject[0].arrayAppObject.push(animationSubEffectHolder);
        divisor.arrayAppObject.push(item);
        cell.arrayAppObject.push(divisor);
        if (type.length > 0) {
            cell.arrayAppObject.push(this.newTable(cell, type));
        }
        line.arrayAppObject.push(cell);
        fatherTable.arrayAppObject.push(line);
        return line;
    }

    private newTable(fatherCell: Component, type: Array<string>) {
        let fatherDivisor = new Component('div', fatherCell);
        fatherDivisor.getElement().setAttribute('style', 'border-style: groove;border-width: 1px;box-sizing: border-box;display: inline-block;width: 100%;overflow: auto;height: 100px;');
        let table = new Component('table', fatherDivisor);
        let event1 = new AppObjectEvent(table);
        let currentType = type.pop();
        event1.name = 'dragover';
        event1.code = 'UserManegement';
        event1.runFunction = 'allowDrop(this,event,"" + currentType + "")';
        let event2 = new AppObjectEvent(table);
        event2.name = 'drop';
        event2.code = 'UserManegement';
        event2.runFunction = 'drop(this,event,"" + currentType + "")';
        console.log('new table:', currentType);
        table.arrayAppObjectEvent.push(event1);
        table.arrayAppObjectEvent.push(event2);
        table.renderAfterUpdateJSON();
        table.getElement().setAttribute('style', 'width: 100%;height: 100%;');

        fatherDivisor.arrayAppObject.push(table);
        return fatherDivisor;
    }
}
