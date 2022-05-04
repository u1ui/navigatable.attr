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




const observers = new Set();
class TargetObserver {
	constructor(fn) {
		this.fn = fn;
		observers.add(this);
	}
	disconnect() {
		observers.delete(this);
	}
}

let actives = new Set();
let added = new Set();
let removed = new Set();

const oldTargets = [];
function checkTargets(){

	const newest = new Set();
	newest.add(location.hash.substr(1));

	const url = new URL(window.location);
	const search = url.searchParams.get('u1-target')?.split(' ');
	if (search) newest.add(search);

	for (let active of actives) {
		if (!newest.has(active)) removed.add(active);
	}
	for (let neu of newest) {
		if (!actives.has(neu)) added.add(item);
	}


}

addEventListener('popstate', triggerLocationChange);
function triggerLocationChange(){
	observers.forEach(obs=>{
		obs.fn({added, removed})
	});
}
function modifySearchParam(id, add){
	const url = new URL(window.location);
	const targets = url.searchParams.get('u1-target')?.split(' ') ?? [];
	if (add) targets.push(id);
	else targets.splice(targets.indexOf(id),1);
	url.searchParams.set('u1-target', targets.join(' '));
	history.pushState({}, '', url+'');
	triggerLocationChange();
}

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

		modifySearchParam(target.id, true);


//		location.hash = target.id;
	} else {

		modifySearchParam(target.id, false);


		/*
		if (e.target.id === location.hash.substr(1)) {
			history.back();
			//e.preventDefault();
			//location.hash = '';
		}
		*/
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
