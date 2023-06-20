// todo security check, is querySelector harmfull for user-input?

import {TargetObserver} from './TargetObserver.js';
import {U1TargetObserver, toggleParam} from './U1TargetObserver.js';


console.error('this is deprecated, usd https://github.com/u1ui/navigable.attr instead');

// translate hash-links to "u1-navigatable"-elements into "u1-target"-params
new TargetObserver({
	on: (el) => {
		console.log(el)
		toggleParam(el.id, true, true);
		const url = new URL(window.location);
		url.hash = '';
		window.history.replaceState(null, '', url.href);
	},
	off: (el) => {
	},
	matches: '[u1-navigatable]'
})


/* dialog element */
new U1TargetObserver({
    on:  el => !el.open && el.showModal(),
    off: el => el.close(),
    matches: 'dialog[u1-navigatable]',
});
addEventListener('close',e=>{
	const el = e.target;
	if (!el.matches('dialog[u1-navigatable]')) return;
	toggleParam(el.id, false);
},true);


/* details */
new U1TargetObserver({
	on:  el => el.open = true,
	off: el => el.open = false,
	matches: 'details[u1-navigatable]',
});
addEventListener('toggle',e=>{
	const el = e.target;
	if (!el.matches('details[u1-navigatable][id]')) return;
	if (el.open) toggleParam(el.id, true);
	else toggleParam(el.id, false);
},true);


/* checkbox */
new U1TargetObserver({
	on:  el => el.checked = true,
	off: el => el.checked = false,
	matches: 'input[type=checkbox][u1-navigatable]',
});
addEventListener('change',e=>{
	const el = e.target;
	if (!el.matches('input[type=checkbox][u1-navigatable][id]')) return;
	if (el.checked) toggleParam(el.id, true);
	else toggleParam(el.id, false);
});



// beta
// u1 unified api
addEventListener('u1-activate', e => {
    if (!e.target.hasAttribute('u1-navigatable')) return;
	if (!e.target.hasAttribute('id')) { console.warn('element with a u1-navigatable attribute must have an id'); return; }
	//e.preventDefault(); // needed?
	location.href = '#' + e.target.id;
});
