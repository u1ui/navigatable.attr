const observers = new Set();

export class U1TargetObserver {
	constructor(opts) {
		this.opts = opts;
		observers.add(this);

        this._testOns(actives);
	}
	disconnect() {
		observers.delete(this);
	}
    _matches(el){
        if (!el) return false;
        return el!==false && this.opts.matches==null || el.matches(this.opts.matches);
    }
    _testOn(el){
        this.opts.on && this._matches(el) && this.opts.on(el);
    }
    _testOff(el){
        this.opts.off && this._matches(el) && this.opts.off(el);
    }
    _testOns(els){
        for (const el of els) this._testOn(el);
    }
    _testOffs(els){
        for (const el of els) this._testOff(el);
    }
}

let actives = new Set();

function checkTargets(){
	const newest = new Set();
	const param = new URL(window.location).searchParams.get('u1-target');
	if (param) {
        for (const item of param.split(' ')) {
            const el = document.getElementById(item);
            el && newest.add(el);
        }
    }

	const added = new Set();
	const removed = new Set();
	for (let item of actives) if (!newest.has(item)) removed.add(item);
	for (let item of newest)  if (!actives.has(item)) added.add(item);
    for (const obs of observers) {
        obs._testOffs(removed);
        obs._testOns(added);
    }
	actives = newest;
}
addEventListener('popstate', checkTargets);
checkTargets();


// Possible improvement:
// Initial TargetObserver tiggers if in url, then toggle-event triggers, resulting in toggleParam without a need.
// Can we solve this?

// togglelParam
export function toggleParam(id, force, replace){
	const url = new URL(window.location);
	const targets = new Set((url.searchParams.get('u1-target')||'').split(' '));
    const size = targets.size;
	if (force===true) targets.add(id);
	if (force===false) targets.delete(id);
    if (targets.size!==size) { // changed
        url.searchParams.set('u1-target', [...targets].join(' '));
        history[replace?'replaceState':'pushState'](null, '', url.href);
//        history.pushState({}, '', url+'');
        checkTargets();
    }
}
