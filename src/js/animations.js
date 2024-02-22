import { gsap } from "gsap";
    
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let timeline = gsap.timeline({
    scrollTrigger: {
        trigger: "#hero",
        start: 'top',
        end: 'bottom',
        scrub: true,
        markers: false,
    }
})

timeline.fromTo('#hero-title', {
    y: 0
}, {
    y: -100
})


// timeline.fromTo('canvas', {
//     opacity: '100%'
// }, {
//     opacity: '0%'
// })

