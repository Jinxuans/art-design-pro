import request from '@/utils/http'

export interface CaptchaResponse {
  _id: string
  svg: string
  base64: string
}

/** 获取图片验证码（svg） */
export function fetchCaptcha() {
  return request.post<CaptchaResponse>({
    url: '/api/v1/sysCaptcha/createCaptcha'
  })
}
