import { AppObject, Component } from 'backappjh';
import { BasicSocket, UniqueSocket } from 'basicsocket';
import { Disk } from './../disk/disk';
import * as freeice from 'freeice';
declare var MediaRecorder: any;
declare var AudioContext: any;

export class Stream extends AppObject {
    private static instance: Stream;
    private socketIo: BasicSocket;
    private subscribers: Array<any>;
    private configuration;
    private streamConnection;
    private stream;

    public static getInstance(father?: Component): Stream {
        if (!Stream.instance) {
            Stream.instance = new Stream(father);
        }
        return Stream.instance;
    }

    constructor(father?: Component) {
        super(father);
        this.init();
    }

    public subscribe(callback) {
        // we could check to see if it is already subscribed
        this.subscribers.push(callback);
        console.log(callback.name, 'has been subscribed to Stream');
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

    public getStream() {
        return this.stream;
    }

    public getStreamView(component) {
        let stream = Stream.getInstance();
        stream.subscribe((streamingData) => { stream.streamView(component, streamingData); });
        let streaming = Stream.getInstance().getStream();
        if (streaming !== undefined && streaming != null) {
            stream.streamView(component, streaming);
        }
    }

    public streamView(component, stream) {
        console.log('STREAMVIEW!!!');
        (<any>(<Component>component).getElement()).src = window.URL.createObjectURL(stream);
    }

    private init() {
        let _self = this;
        _self.subscribers = new Array<any>();
        _self.socketIo = UniqueSocket.getInstance().getBasicSocket();
        _self.socketIo.emit('subscribeStream', {});
        _self.configuration = {
            'iceServers': [
                { url: 'stun:stun.l.google.com:19302' },
                { url: 'turn:71.6.135.115:3478', username: 'test', credential: 'tester' },
                { url: 'turn:71.6.135.115:3479', username: 'test', credential: 'tester' }
            ]
        };
        _self.streamConnection = new webkitRTCPeerConnection(_self.configuration) || new RTCPeerConnection(_self.configuration);
        _self.configStream();
        _self.socketIo.on('stream', (stream) => {
            if (stream.offer) {
                _self.handleOffer(stream.offer);
            }
            if (stream.candidate) {
                console.log('CANDIDATE!!!', stream.candidate);
                _self.streamConnection.addIceCandidate(new RTCIceCandidate(stream.candidate)).then(
                    _self.onAddIceCandidateSuccess,
                    _self.onAddIceCandidateError
                );
            }
        });
    }

    private onAddIceCandidateSuccess() {
        console.log('AddIceCandidate success.');
    }

    private onAddIceCandidateError(error) {
        console.log('Failed to add ICE candidate: ' + error.toString());
    }

    private handleOffer(offer) {
        console.log('OFFER!');
        let _self = this;
        _self.streamConnection.setRemoteDescription(new RTCSessionDescription(offer));

        // create an answer to an offer
        _self.streamConnection.createAnswer(
            (answer) => {
                console.log('createAnswer!');
                _self.streamConnection.setLocalDescription(answer);
                _self.socketIo.emit('stream', { answer: answer });

            },
            (error) => {
                console.error('Error when creating an answer');
            });
    }

    private configStream() {
        let _self = this;


        _self.streamConnection.onaddstream = (e) => {
            console.log('EVENT:', e);
            _self.stream = e.stream;
            _self.publish(e.stream);
        };

        // Setup ice handling
        _self.streamConnection.onicecandidate = (event) => {

            if (event.candidate) {
                console.log('onCandidate', event.candidate);
                _self.socketIo.emit('stream', { candidate: event.candidate });
            }

        };
    }
}
