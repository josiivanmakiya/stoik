import { useEffect } from "react"

export default function Grain() {
  useEffect(() => {
    const SIZE = 512
    const canvas = document.createElement("canvas")
    canvas.width  = SIZE
    canvas.height = SIZE
    const ctx = canvas.getContext("2d")
    const imageData = ctx.createImageData(SIZE, SIZE)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      // Film grain algorithm — gaussian-ish distribution
      // Box-Muller to get normal distribution
      const u1 = Math.random()
      const u2 = Math.random()
      const gauss = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)

      // Centre around mid-grey (128) with std deviation ~48
      // This produces the analogue film look
      const val = Math.min(255, Math.max(0, Math.round(128 + gauss * 48)))

      data[i]     = val
      data[i + 1] = val
      data[i + 2] = val
      // Alpha: mostly transparent, grain just barely visible
      data[i + 3] = Math.floor(Math.random() * 28) + 8
    }

    ctx.putImageData(imageData, 0, 0)

    const url = canvas.toDataURL("image/png")

    // Inject as CSS custom property on :root
    document.documentElement.style.setProperty("--grain-url", `url(${url})`)

    // Apply to grain overlay div
    const el = document.getElementById("stoik-grain")
    if (el) el.style.backgroundImage = `url(${url})`
  }, [])

  return (
    <div
      id="stoik-grain"
      style={{
        position:       "fixed",
        inset:          0,
        zIndex:         9997,
        pointerEvents:  "none",
        backgroundRepeat: "repeat",
        backgroundSize: "512px 512px",
        mixBlendMode:   "soft-light",
        opacity:        0.9,
      }}
    />
  )
}
