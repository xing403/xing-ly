export type DoneFn = (cancel?: boolean) => void
export type handleBeforeFn = (done: DoneFn, args?: T) => void

export interface QRCodePropsType {
  text: string
  type?: 'image/png' | 'image/jpeg' | 'image/webp'
  quality?: number
  margin?: number
  scale?: number
  width?: number
  dark?: string
  light?: string
  level?: 'low' | 'medium' | 'quartile' | 'high' | 'L' | 'M' | 'Q' | 'H'
  download?: boolean
  refresh?: boolean

  downloadBefore?: handleBeforeFn
  refreshBefore?: handleBeforeFn

}
