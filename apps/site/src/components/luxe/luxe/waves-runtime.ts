export function initWaves(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  function resize() {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
  }

  const waves = [
    { amplitude: 20, length: 0.015, speed: 0.02, color: 'rgba(194,24,91,0.5)', phase: 0 },
    { amplitude: 25, length: 0.01, speed: 0.015, color: 'rgba(64,196,180,0.5)', phase: 100 },
    { amplitude: 15, length: 0.02, speed: 0.025, color: 'rgba(212,175,55,0.5)', phase: 200 },
  ]

  function draw(time: number) {
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    waves.forEach(w => {
      ctx.beginPath()
      ctx.strokeStyle = w.color
      for (let x = 0; x <= canvas.width; x++) {
        const y =
          w.amplitude *
            Math.sin((x + time * w.speed + w.phase) * w.length) +
          canvas.height / 2
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
    })
  }

  let animId: number
  function animate(time: number) {
    draw(time)
    animId = requestAnimationFrame(animate)
  }

  resize()
  animate(0)
  window.addEventListener('resize', resize)
}
