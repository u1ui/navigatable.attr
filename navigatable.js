// todo security check, is querySelector harmfull for user-input?

/* u1-target-event */
let oldTarget = null;
function checkTarget(e){
	const target = (location.hash && document.querySelector(location.hash)) || document;
	if (target === oldTarget) return;
	const event = new CustomEvent('u1-target', {
		bubbles:true,
		detail: {oldTarget}
	});
	target.dispatchEvent(event);
	oldTarget = target;
}
addEventListener('hashchange',checkTarget);
addEventListener('DOMContentLoaded',e=>setTimeout(checkTarget));


/* dialog element */
document.addEventListener('u1-target', e => {
	const oldTarget = e.detail.oldTarget;
	const target = e.target;

	if (oldTarget && oldTarget.matches && oldTarget.matches('dialog[u1-navigatable]')) {
		if (!target.contains(oldTarget)) oldTarget.close();
	}
    if (target && target.matches && target.matches('dialog[u1-navigatable]')) {
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
	const target = e.target;
	if (target.matches && target.matches('details[u1-navigatable]')) {
		e.target.open = true;
	}
});
addEventListener('toggle',e=>{
	const target = e.target;
	if (!target.id) return;
	if (e.target.id !== location.hash.substr(1)) return;
	if (!target.matches('details[u1-navigatable]')) return;

	if (target.open) {
		target.open = false;
	}
	console.log(target)
	//history.back();
	//e.preventDefault();
},true);




// beta
// u1 unified api
addEventListener('u1-activate', e => {
    if (!e.target.hasAttribute('u1-navigatable')) return;
	if (!e.target.hasAttribute('id')) {
		console.warn('element with a u1-navigatable attribute must have an id');
		return;
	}
	//e.preventDefault(); // needed?
	location.href = '#' + e.target.id;
});
