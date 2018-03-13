// class ServerChecker{
//     constructor(){
//     }

//     public check(){
//         let img = document.createElement('img')
//         let _self = this;
//         img.onload = _self.isOnline;
//         img.onerror = _self.isOffline;
//         img.src = 'http://localhost:3000/image/streame.svg';
//     }

//     public isOnline(){
//         window.location.href = 'http://localhost:3000';
//     }

//     public isOffline(){
//         console.log('OFF');
//         let _self = this;
//         if(_self!=undefined){
//             setTimeout(() => {_self.check();}, 1000);
//         }
//     }
// }

// let serverChecker = new ServerChecker();

// serverChecker.check();


function check() {
    let img = document.createElement('img')
    let _self = this;
    img.onload = _self.isOnline;
    img.onerror = _self.isOffline;
    img.src = 'http://localhost:3000/image/streame.svg';
}

function isOnline() {
    window.location.href = 'http://localhost:3000';
}

function isOffline() {
    console.log('OFF');
    setTimeout(() => { check(); }, 1000);
}

check();
