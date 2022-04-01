// todo security check, is querySelector harmfull for user-input?

/* u1-target-event */
let oldTarget = null;
function checkTarget(e){
	console.log('check')
	const target = (location.hash && document.querySelector(location.hash)) || document;
	if (target === oldTarget) return;

	// let oldTarget = document;
	// if (e) {
	// 	const oldHash = new URL(e.oldURL).hash;
    //     if (oldHash) {
    //         oldTarget = document.querySelector(oldHash);
    //     }
	// }
	const event = new CustomEvent('u1-target', {
		bubbles:true,
		detail:{ oldTarget }
	});
	target.dispatchEvent(event);
	oldTarget = target;
}
addEventListener('hashchange',checkTarget);
addEventListener('DOMContentLoaded',checkTarget);
checkTarget();

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


// prevent close dialog, then navigate back to close
addEventListener('close',e=>{
	const target = e.target;
	if (!target.id) return;
	if (e.target.id !== location.hash.substr(1)) return;
	if (!target.matches('dialog[u1-navigatable]')) return;

	history.back();
	e.preventDefault();
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
