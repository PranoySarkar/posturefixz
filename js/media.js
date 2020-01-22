
let possitiveSound = {play:()=>{}};
let repositionSound = {play:()=>{}};
let negativeSound ={play:()=>{}};
setTimeout(_=>{
	fetch('assets/audio/positive.json').then(res=>res.json()).then(media=>{
		possitiveSound = new Audio(media.positive);
   })
},2000);
setTimeout(_=>{
	fetch('assets/audio/negative.json').then(res=>res.json()).then(media=>{
		negativeSound =new Audio (media.negative);
   }).catch(err=>{
	   console.log(err)
   })
},5000)

setTimeout(_=>{	
	fetch('assets/audio/reposition.json').then(res=>res.json()).then(media=>{
		repositionSound = new Audio(media.reposition);
	})
	
 

},10000)
