// todo security check, is querySelector harmfull for user-input?

let oldTarget = null;
function checkTarget(e){
	const target = document.querySelector(location.hash) || document;
	/*
	let oldTarget = document;
	if (e) {
		const oldHash = new URL(e.oldURL).hash;
        if (oldHash) {
            oldTarget = document.querySelector(oldHash);
        }
	}
	*/
	const event = new CustomEvent('u1-target', {
		bubbles:true,
		detail:{ oldTarget }
	});
	target.dispatchEvent(event);
	oldTarget = target;
}

addEventListener('hashchange',checkTarget);
addEventListener('DOMContentLoaded',checkHashTarget);
checkTarget();



function checkHashTarget(){
    if (!location.hash) return;
	const target = document.querySelector(location.hash);
	if (!target) return;
    if (target.matches('dialog[u1-navigatable]')) {
        !target.open && target.showModal();
    }

	/* beta */
	const event = new CustomEvent('u1-navigatable-target', {
		bubbles:true,
	});
	target.dispatchEvent(event);
	/* */

}
setTimeout(checkHashTarget);
document.addEventListener('DOMContentLoaded',checkHashTarget);

let closedByHistory = false;
addEventListener('hashchange',e=>{
	// close modal
	if (!closedByHistory) {
		const oldHash = new URL(e.oldURL).hash;
        if (oldHash) {
            const target = document.querySelector(oldHash);
            if (target && target.matches('dialog[u1-navigatable]')) {
                target.close();
            }
        }
	}
	checkHashTarget();
});

// prevent close dialog, then navigate back to close
addEventListener('close',e=>{
	closedByHistory = true;
	if (e.target.id && e.target.id === location.hash.substr(1)) {
		history.back();
	}
	closedByHistory = false;
	e.preventDefault();
},true);

// u1 unified api
addEventListener('u1-activate', e => {
//    if (openedByHistory) return; // needed?
    if (!e.target.hasAttribute('u1-navigatable')) return;
	if (!e.target.hasAttribute('id')) {
		console.warn('element with a u1-navigatable attribute must have an id');
		return;
	}
	//e.preventDefault(); // needed?
	location.href = '#' + e.target.id;
});
