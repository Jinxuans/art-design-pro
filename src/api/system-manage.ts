import request from '@/utils/http'
import { AppRouteRecord } from '@/types/router'

// 获取用户列表
export function fetchGetUserList(params: Api.SystemManage.UserSearchParams) {
  return request.get<Api.SystemManage.UserList>({
    url: '/api/user/list',
    params
  })
}

// 获取角色列表
export function fetchGetRoleList(params: Api.SystemManage.RoleSearchParams) {
  return request.get<Api.SystemManage.RoleList>({
    url: '/api/role/list',
    params
  })
}

// 获取菜单列表
export function fetchGetMenuList() {
  return request.get<AppRouteRecord[]>({
    url: '/api/v1/system/menus'
  })
}

// 菜单树（含按钮），用于后台管理
export function fetchSysMenuTree() {
  return request.get<any[]>({
    url: '/api/v1/sysMenu/findTree'
  })
}

// 新增菜单/按钮
export function createSysMenu(params: Record<string, any>) {
  return request.post<void>({
    url: '/api/v1/sysMenu',
    params,
    showSuccessMessage: true
  })
}

// 更新菜单/按钮
export function updateSysMenu(id: string, params: Record<string, any>) {
  return request.put<void>({
    url: `/api/v1/sysMenu/${id}`,
    params,
    showSuccessMessage: true
  })
}

// 删除菜单/按钮
export function deleteSysMenu(id: string) {
  return request.del<void>({
    url: `/api/v1/sysMenu/${id}`,
    showSuccessMessage: true
  })
}
