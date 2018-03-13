import { AppObject, Component, ComponentPageBody, ComponentDataInput, ComponentOption, Observer } from 'backappjh';
import { BasicSocket, UniqueSocket } from 'basicsocket';

export class Disk extends AppObject implements Observer {
    private static instance: Disk;
    private socketIo: BasicSocket;
    private subscribers: Array<any>;

    public static getInstance(father?: Component): Disk {
        if (!Disk.instance) {
            Disk.instance = new Disk(father);
        }
        return Disk.instance;
    }

    constructor(father?: Component) {
        super(father);
        this.init();
    }

    public getVideos(data) {
        let _self = this;
        _self.socketIo.emit('getVideos', data);
    }

    public getSpace(data) {
        let _self = this;
        _self.socketIo.emit('getSpace', data);
    }

    public uploadVideo(data) {
        let _self = this;
        _self.socketIo.emit('uploadVideo', data);
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

    public getListVideos(component) {
        console.log('List vídeos!!');
        let disk = Disk.getInstance();
        disk.subscribe((data) => { disk.listVideos(component, data); });
        disk.getVideos({});
    }

    public listVideos(component, data) {
        if (data.videos) {
            console.log(data);

            (<ComponentDataInput>component).arrayComboBox[0].destroyChildElements();
            (<ComponentDataInput>component).arrayComboBox[0].arrayOption = new Array<ComponentOption>();
            (<ComponentDataInput>component).arrayComboBox[0].arrayOption.type = ComponentOption;

            data.videos.forEach(video => {
                let option: ComponentOption = new ComponentOption((<ComponentDataInput>component).arrayComboBox[0]);
                let elementArray = video.split('/');
                video = elementArray[elementArray.length - 1];
                option.getElement().innerHTML = video;
                console.log(video);
                (<ComponentDataInput>component).arrayComboBox[0].arrayOption.push(option);
            });

            component.destroyElement();
        }
    }

    public selectVideo(component) {
        console.log('Select vídeos!!!');
        let element: any = (<ComponentDataInput>component).arrayComboBox[0].getElement();
        let file = element.options[element.selectedIndex].text;
        // console.log('SELECTED:' + file);
        let array = file.split('.');
        let format = array[array.length - 1];
        (<any>(<Component>(<Component>component.getFather().getFather()).arrayAppObject[1].arrayAppObject[0].arrayAppObject[0]).getElement()).pause();
        (<Component>(<Component>component.getFather().getFather()).arrayAppObject[1].arrayAppObject[0].arrayAppObject[0].arrayAppObject[0]).getElement().setAttribute('src', 'videos/' + file);
        (<Component>(<Component>component.getFather().getFather()).arrayAppObject[1].arrayAppObject[0].arrayAppObject[0].arrayAppObject[0]).getElement().setAttribute('type', 'video/' + format);
        (<any>(<Component>(<Component>component.getFather().getFather()).arrayAppObject[1].arrayAppObject[0].arrayAppObject[0]).getElement()).load();
        (<any>(<Component>(<Component>component.getFather().getFather()).arrayAppObject[1].arrayAppObject[0].arrayAppObject[0]).getElement()).play();
        // ApiConnection.request('GET', 'getVideos', (text) => { _self.response(text); });
    }

    public getSpaceUsed(component) {
        let disk = Disk.getInstance();
        disk.subscribe((data) => { disk.response(component, data); });
        disk.getSpace({});
    }

    public response(component, data) {
        if (data.space) {
            console.log(data.space);
            console.log(data.space.free);
            console.log(data.space.total);
            console.log(data.space.available);

            (<any>component).arrayChart[0].arrayData[1][1] = data.space.available;
            (<any>component).arrayChart[0].arrayData[2][1] = data.space.total - data.space.free;
            (<any>component).arrayChart[0].arrayData[3][1] = data.space.free - data.space.available;

            // let t = setTimeout(() => { _self.response(text); }, 5000);
        }
    }

    private init() {
        let _self = this;
        _self.subscribers = new Array<any>();
        _self.socketIo = UniqueSocket.getInstance().getBasicSocket();
        _self.socketIo.emit('subscribeDisk', {});
        _self.socketIo.on('disk', (data) => { _self.publish(data); });
    }
}
