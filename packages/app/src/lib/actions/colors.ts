import { APCAcontrast, sRGBtoY } from 'apca-w3'
import quantize from 'quantize'
import type { Action } from 'svelte/action'
import type { Writable } from 'svelte/store'

export const colors: Action<
  HTMLImageElement,
  { colors?: Writable<{ primary: string; dark: boolean }> }
> = (el, { colors } = {}) => {
  const canvas: HTMLCanvasElement = document.createElement('canvas')
  const context = canvas.getContext('2d')!
  context.imageSmoothingEnabled = false
  let popularity: Record<`${number},${number},${number}`, number>

  const populate = async () => {
    if (!el.complete) {
      await new Promise<void>((resolve, reject) => {
        const handleLoad = () => {
          el.removeEventListener('load', handleLoad)
          el.removeEventListener('error', handleError)
          resolve()
        }

        const handleError = () => {
          el.removeEventListener('load', handleLoad)
          el.removeEventListener('error', handleError)
          reject()
        }

        el.addEventListener('load', handleLoad)
        el.addEventListener('error', handleError)
      })
    }

    popularity = {}
    canvas.width = el.width
    canvas.height = el.height
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(el, 0, 0, canvas.width, canvas.height)
    const image = context.getImageData(0, 0, canvas.width, canvas.height)

    for (let index = 0; index < image.data.length; index += 4) {
      const [red, green, blue, alpha] = image.data.subarray(index, index + 4)
      const rgb = `${red},${green},${blue}` as const
      popularity[rgb] ??= 0
      popularity[rgb]++
    }

    const quantized = quantize(
      Object.keys(popularity).map(
        (rgb) => rgb.split(',').map(Number) as [red: number, green: number, blue: number],
      ),
      2,
    ).palette()

    const primary = quantized[0]!
    const blackLightnessContrast = Math.abs(
      APCAcontrast(sRGBtoY(primary), sRGBtoY([0, 0, 0])) as number,
    )
    const whiteLightnessContrast = Math.abs(
      APCAcontrast(sRGBtoY(primary), sRGBtoY([255, 255, 255])) as number,
    )
    const dark = blackLightnessContrast < whiteLightnessContrast

    colors?.set({ primary: `rgb(${primary.join(', ')})`, dark })
  }

  const mutationObserver = new MutationObserver(populate)

  mutationObserver.observe(el, { attributes: true, attributeFilter: ['src'] })

  populate()

  return {
    destroy: () => {
      mutationObserver.disconnect()
    },
  }
}
