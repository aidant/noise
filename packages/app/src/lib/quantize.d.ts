declare module 'quantize' {
  export default function quantize(
    pixels: [red: number, green: number, blue: number][],
    maxColors: number,
  ): {
    palette(): [red: number, green: number, blue: number][]
  }
}
