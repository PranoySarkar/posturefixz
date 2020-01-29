
let possitiveSound = { play: () => { }, pause: () => { } };
let repositionSound = { play: () => { }, pause: () => { } };
let negativeSound = { play: () => { }, pause: () => { } };

setTimeout(_ => {
	fetch('assets/audio/negative.json').then(res => res.json()).then(media => {
		negativeSound = new Audio(media.negative);
	}).catch(err => {
		console.log(err)
	})
}, 100)

setTimeout(_ => {
	fetch('assets/audio/reposition.json').then(res => res.json()).then(media => {
		repositionSound = new Audio(media.reposition);
	})
}, 600)

setTimeout(_ => {
	fetch('assets/audio/positive.json').then(res => res.json()).then(media => {
		possitiveSound = new Audio(media.positive);
	})
}, 1000);



