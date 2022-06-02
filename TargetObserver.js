
// ussage:
// const observer = new TargetObserver(function(data){
// 	console.log(data.target);
// 	console.log(data.oldTarget);
// })
// observer.disconnect();

const observers = new Set();

class TargetObserver {
    constructor(callback) {
        this.callback = callback;
        observers.add(this);
        this.callback({
            target: oldTarget,
        });
    }
    disconnect() {
        observers.delete(this);
    }
}

let oldTarget = null;

function checkTarget(e) {
    const target = (location.hash && document.querySelector(location.hash)) || false;
    if (target === oldTarget) return;
    for (const observer of observers) {
        observer.callback({
            oldTarget,
            target,
            containsOld: target && target.contains(oldTarget),
        });
    }
    oldTarget = target;
}
checkTarget();
addEventListener('hashchange', checkTarget);
