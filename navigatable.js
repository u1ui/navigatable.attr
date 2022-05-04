// todo security check, is querySelector harmfull for user-input?

/* u1-target-event */
let oldTarget = null;
function checkTarget(e){
	//const target = (location.hash && document.querySelector(location.hash)) || document;
	const target = (location.hash && document.querySelector(location.hash)) || false;
	if (target === oldTarget) return;
	const event = new CustomEvent('u1-target', {
		bubbles:true,
		detail: {oldTarget,target}
	});
	(target||document).dispatchEvent(event);
	oldTarget = target;
}
addEventListener('hashchange',checkTarget);
addEventListener('DOMContentLoaded',e=>setTimeout(checkTarget)); // bad, better to use a "TargetObserver"


/* dialog element */
document.addEventListener('u1-target', e => {
	const {oldTarget,target} = e.detail;
	if (oldTarget && oldTarget.matches('dialog[u1-navigatable]')) {
		if (target && !target.contains(oldTarget)) oldTarget.close();
	}
    if (target && target.matches('dialog[u1-navigatable]')) {
        !target.open && target.showModal();
    }
});
addEventListener('close',e=>{
	const target = e.target;
	if (!target.id) return;
	if (e.target.id !== location.hash.substr(1)) return;
	if (!target.matches('dialog[u1-navigatable]')) return;

	history.back();
	e.preventDefault();
},true);


/* details */
document.addEventListener('u1-target', e => {
	const {oldTarget,target} = e.detail;
	if (oldTarget && oldTarget.matches('details[u1-navigatable]')) {
		if (target && !target.contains(oldTarget)) oldTarget.open = false;
		//oldTarget.open = false;
	}
	if (target && target.matches('details[u1-navigatable]')) {
		e.target.open = true;
	}
});
addEventListener('toggle',e=>{
	const target = e.target;
	if (!target.id) return;
	if (!target.matches('details[u1-navigatable]')) return;
	if (target.open) {
		location.hash = target.id;
	} else {
		if (e.target.id === location.hash.substr(1)) {
			history.back();
			//e.preventDefault();
			//location.hash = '';
		}
	}
},true);


// beta
// u1 unified api
addEventListener('u1-activate', e => {
    if (!e.target.hasAttribute('u1-navigatable')) return;
	if (!e.target.hasAttribute('id')) { console.warn('element with a u1-navigatable attribute must have an id'); return; }
	//e.preventDefault(); // needed?
	location.href = '#' + e.target.id;
});





const voidSet = new Set();
const observers = new Set();
class TargetObserver {
	constructor(fn) {
		this.fn = fn;
		observers.add(this);
		fn({added:actives, removed:voidSet});
	}
	disconnect() {
		observers.delete(this);
	}
}

let actives = new Set();

const oldTargets = [];
function checkTargets(){
	const newest = new Set();

	newest.add(location.hash.substr(1));

	const url = new URL(window.location);
	const param = url.searchParams.get('u1-target');
	if (param) for (const item of param.split(' ')) newest.add(item);

	const added = new Set();
	const removed = new Set();
	for (let item of actives) if (!newest.has(item))  removed.add(item);
	for (let item of newest)  if (!actives.has(item)) added.add(item);
	observers.forEach(obs=>obs.fn({added, removed}));
	actives = newest;
}

addEventListener('hashchange',checkTarget);
addEventListener('popstate', checkTargets);
checkTargets();

function modifySearchParam(id, add){
	const url = new URL(window.location);
	const targets = (url.searchParams.get('u1-target')||'').split(' ');
	if (add) targets.push(id);
	else targets.splice(targets.indexOf(id),1);
	url.searchParams.set('u1-target', targets.join(' '));
	history.pushState({}, '', url+'');
	checkTargets();
}

let testObs = new TargetObserver(e=>{
	console.log(e)
});
