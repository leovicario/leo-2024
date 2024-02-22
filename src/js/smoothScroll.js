import Lenis from '@studio-freight/lenis'

const lenis = new Lenis({
  lerp: 0.05,
  syncTouch: true,
  touchInertiaMultiplier: 100,
  infinite: false,
})

lenis.on('scroll', (e) => {
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)