import request from '@/utils/http'

/**
 * 获取当前登录用户详情（前端适配结构）
 */
export function fetchCurrentUserProfile() {
  return request.get<Api.Auth.ProfileDetail>({
    url: '/user/info'
  })
}

/**
 * 更新当前用户的个人资料
 */
export function updateUserProfile(params: Api.Auth.ProfilePayload) {
  return request.put<void>({
    url: '/user/changeUserInfo',
    params,
    showSuccessMessage: true
  })
}
