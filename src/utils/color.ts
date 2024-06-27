/**
 * 判断是否 十六进制颜色值.
 * 输入形式可为 #fff000 #f00
 *
 * @param   String  color   十六进制颜色值
 * @return  Boolean
 */
export const isHexColor = (color: string) => {
  const reg = /^#([0-9a-fA-F]{3}|[0-9a-fA-f]{6})$/
  return reg.test(color)
}

/**
 * RGB 颜色值转换为 十六进制颜色值.
 * r, g, 和 b 需要在 [0, 255] 范围内
 *
 * @return  String          类似#ff00ff
 * @param r
 * @param g
 * @param b
 */
export const rgbToHex = (r: number, g: number, b: number) => {
  // tslint:disable-next-line:no-bitwise
  const hex = ((r << 16) | (g << 8) | b).toString(16)
  return '#' + new Array(Math.abs(hex.length - 7)).join('0') + hex
}

/**
* 将十六进制颜色转换为其 RGB 表示形式
* @param {string} hex 要转换的颜色
* @returns 传递的颜色的 RGB 表示形式
*/
export const hexToRGB = (hex: string, opacity?: number) => {
  let sHex = hex.toLowerCase()
  if (isHexColor(hex)) {
    if (sHex.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sHex.slice(i, i + 1).concat(sHex.slice(i, i + 1))
      }
      sHex = sColorNew
    }
    const sColorChange: number[] = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sHex.slice(i, i + 2)))
    }
    return opacity
      ? 'RGBA(' + sColorChange.join(',') + ',' + opacity + ')'
      : 'RGB(' + sColorChange.join(',') + ')'
  }
  return sHex
}

export const colorIsDark = (color: string) => {
  if (!isHexColor(color)) return
  const [r, g, b] = hexToRGB(color)
    .replace(/(?:\(|\)|rgb|RGB)*/g, '')
    .split(',')
    .map((item) => Number(item))
  return r * 0.299 + g * 0.578 + b * 0.114 < 192
}

/**
* 根据传递的百分比使十六进制颜色变暗
* @param {string} color 要处理的颜色
* @param {number} amount 要更改颜色的数量
* @returns {string} 已处理颜色的十六进制表示形式
*/
export const darken = (color: string, amount: number) => {
  color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color
  amount = Math.trunc((255 * amount) / 100)
  return `#${subtractLight(color.substring(0, 2), amount)}${subtractLight(
    color.substring(2, 4),
    amount
  )}${subtractLight(color.substring(4, 6), amount)}`
}

/**
* 根据传递的百分比使 6 个字符的 HEX 颜色变亮
* @param {string} color 要更改的颜色
* @param {number} amount 要更改颜色的数量
* @returns {string} 以 HEX 表示的处理后的颜色
*/
export const lighten = (color: string, amount: number) => {
  color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color
  amount = Math.trunc((255 * amount) / 100)
  return `#${addLight(color.substring(0, 2), amount)}${addLight(
    color.substring(2, 4),
    amount
  )}${addLight(color.substring(4, 6), amount)}`
}

/* 总计表示颜色 (RR、GG 或 BB) 的十六进制百分比以进行显示 */
/**
* 将传递的百分比总计为十六进制颜色的 R、G 或 B
* @param {string} color 要更改的颜色
* @param {number} amount 要更改颜色的量
* @returns {string} 颜色的处理部分
*/
const addLight = (color: string, amount: number) => {
  const cc = parseInt(color, 16) + amount
  const c = cc > 255 ? 255 : cc
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
}

/**
* 计算 rgb 颜色的亮度
* @param {number} r 红色
* @param {number} g 绿色
* @param {number} b 蓝色
*/
const luminanace = (r: number, g: number, b: number) => {
  const a = [r, g, b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

/**
* 计算两种 rgb 颜色之间的对比度
* @param {string} rgb1 rgb 颜色 1
* @param {string} rgb2 rgb 颜色 2
*/
const contrast = (rgb1: string[], rgb2: number[]) => {
  return (
    (luminanace(~~rgb1[0], ~~rgb1[1], ~~rgb1[2]) + 0.05) /
    (luminanace(rgb2[0], rgb2[1], rgb2[2]) + 0.05)
  )
}

/**
* 根据与背景的对比度确定最佳文本颜色（黑色或白色）
* @param hexColor - 用户最后选择的颜色
*/
export const calculateBestTextColor = (hexColor: string) => {
  const rgbColor = hexToRGB(hexColor.substring(1))
  const contrastWithBlack = contrast(rgbColor.split(','), [0, 0, 0])

  return contrastWithBlack >= 12 ? '#000000' : '#FFFFFF'
}

/**
* 将指定的百分比从十六进制颜色的 R、G 或 B 中减去
* @param {string} color 要更改的颜色
* @param {number} amount 要更改颜色的数量
* @returns {string} 已处理的颜色部分
*/
const subtractLight = (color: string, amount: number) => {
  const cc = parseInt(color, 16) - amount
  const c = cc < 0 ? 0 : cc
  return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
}

/**
* 混合两种颜色。
*
* @param {string} color1 - 第一种颜色，应为以 `#` 开头的 6 位十六进制颜色代码。
* @param {string} color2 - 第二种颜色，应为以 `#` 开头的 6 位十六进制颜色代码。
* @param {number} [weight=0.5] - 混合中 color1 的权重，应为 0 到 1 之间的数字，其中 0 代表 color2 的 100%，1 代表 color1 的 100%。
* @returns {string} 混合后的颜色，应为以 `#` 开头的 6 位十六进制颜色代码。
*/
export const mix = (color1: string, color2: string, weight: number = 0.5): string => {
  let color = '#'
  for (let i = 0; i <= 2; i++) {
    const c1 = parseInt(color1.substring(1 + i * 2, 3 + i * 2), 16)
    const c2 = parseInt(color2.substring(1 + i * 2, 3 + i * 2), 16)
    const c = Math.round(c1 * weight + c2 * (1 - weight))
    color += c.toString(16).padStart(2, '0')
  }
  return color
}
