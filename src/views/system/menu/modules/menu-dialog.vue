<template>
  <ElDialog
    :title="dialogTitle"
    :model-value="visible"
    @update:model-value="handleCancel"
    width="860px"
    align-center
    class="menu-dialog"
    @closed="handleClosed"
  >
    <ArtForm
      ref="formRef"
      v-model="form"
      :items="formItems"
      :rules="rules"
      :span="width > 640 ? 12 : 24"
      :gutter="20"
      label-width="100px"
      :show-reset="false"
      :show-submit="false"
    >
      <template #menuType>
        <ElRadioGroup v-model="form.menuType" :disabled="disableMenuType">
          <ElRadioButton value="menu" label="menu">菜单</ElRadioButton>
          <ElRadioButton value="button" label="button">按钮</ElRadioButton>
        </ElRadioGroup>
      </template>
    </ArtForm>

    <template #footer>
      <span class="dialog-footer">
        <ElButton @click="handleCancel">取 消</ElButton>
        <ElButton type="primary" @click="handleSubmit">确 定</ElButton>
      </span>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import type { FormRules } from 'element-plus'
  import { ElIcon, ElTooltip, ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import { QuestionFilled } from '@element-plus/icons-vue'
  import type { AppRouteRecord } from '@/types/router'
  import type { FormItem } from '@/components/core/forms/art-form/index.vue'
  import ArtForm from '@/components/core/forms/art-form/index.vue'
  import { useWindowSize } from '@vueuse/core'

  const { width } = useWindowSize()

  /**
   * 创建带 tooltip 的表单标签
   * @param label 标签文本
   * @param tooltip 提示文本
   * @returns 渲染函数
   */
  const createLabelTooltip = (label: string, tooltip: string) => {
    return () =>
      h('span', { class: 'flex items-center' }, [
        h('span', label),
        h(
          ElTooltip,
          {
            content: tooltip,
            placement: 'top'
          },
          () => h(ElIcon, { class: 'ml-0.5 cursor-help' }, () => h(QuestionFilled))
        )
      ])
  }

  interface MenuFormData {
    id: number
    name: string
    path: string
    label: string
    component: string
    icon: string
    isEnable: boolean
    sort: number
    isMenu: boolean
    keepAlive: boolean
    isHide: boolean
    isHideTab: boolean
    link: string
    isIframe: boolean
    showBadge: boolean
    showTextBadge: string
    fixedTab: boolean
    activePath: string
    roles: string[]
    isFullPage: boolean
    authName: string
    authLabel: string
    authIcon: string
    authSort: number
  }

  interface Props {
    visible: boolean
    editData?: AppRouteRecord | any
    type?: 'menu' | 'button'
    lockType?: boolean
    parentPath?: string
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit', data: { form: MenuFormData & { menuType: 'menu' | 'button' }; isEdit: boolean; id?: string; parentPath?: string }): void
  }

  const props = withDefaults(defineProps<Props>(), {
    visible: false,
    type: 'menu',
    lockType: false,
    parentPath: ''
  })

  const emit = defineEmits<Emits>()

  const formRef = ref()
  const isEdit = ref(false)
  const currentParentPath = ref('')
  const titleKey = ref('')
  const { t } = useI18n()

  const form = reactive<MenuFormData & { menuType: 'menu' | 'button' }>({
    menuType: 'menu',
    id: 0,
    name: '',
    path: '',
    label: '',
    component: '',
    icon: '',
    isEnable: true,
    sort: 0,
    isMenu: true,
    keepAlive: true,
    isHide: false,
    isHideTab: false,
    link: '',
    isIframe: false,
    showBadge: false,
    showTextBadge: '',
    fixedTab: false,
    activePath: '',
    roles: [],
    isFullPage: false,
    authName: '',
    authLabel: '',
    authIcon: '',
    authSort: 0
  })

  const resetForm = () => {
    Object.assign(form, {
      menuType: props.type || 'menu',
      id: 0,
      name: '',
      path: '',
      label: '',
      component: '',
      icon: '',
      isEnable: true,
      sort: 1,
      isMenu: true,
      keepAlive: true,
      isHide: false,
      isHideTab: false,
      link: '',
      isIframe: false,
      showBadge: false,
      showTextBadge: '',
      fixedTab: false,
      activePath: '',
      roles: [],
      isFullPage: false,
      authName: '',
      authLabel: '',
      authIcon: '',
      authSort: 1
    })
    currentParentPath.value = props.parentPath || ''
    titleKey.value = ''
  }

  const fillFormByEditData = (data: any) => {
    if (!data) return
    form.menuType = data.menuType === 'button' || data.meta?.isAuthButton ? 'button' : 'menu'
    form.id = data.id
    // 展示名：meta.title；权限标识：name / btnPower
    titleKey.value = data.meta?.title || ''
    const translated = titleKey.value ? t(titleKey.value) : ''
    form.name = translated && translated !== titleKey.value ? translated : titleKey.value
    form.path = data.path || ''
    form.component = data.component || ''
    form.icon = data.meta?.icon || ''
    form.sort = data.menuSort ?? 0
    form.keepAlive = Boolean(data.meta?.isKeepAlive || data.meta?.keepAlive)
    form.isHide = Boolean(data.meta?.isHide)
    form.isHideTab = Boolean(data.meta?.isHideTab)
    form.link = data.meta?.link || ''
    form.isIframe = Boolean(data.meta?.isIframe)
    form.showBadge = Boolean(data.meta?.showBadge)
    form.showTextBadge = data.meta?.showTextBadge || ''
    form.fixedTab = Boolean(data.meta?.fixedTab)
    form.activePath = data.meta?.activePath || ''
    form.roles = data.meta?.roles || []
    form.isFullPage = Boolean(data.meta?.isFullPage)
    form.label = data.name || data.meta?.authMark || ''

    // 按钮专用
    titleKey.value = data.meta?.title || ''
    const translatedBtn = titleKey.value ? t(titleKey.value) : ''
    form.authName = translatedBtn && translatedBtn !== titleKey.value ? translatedBtn : titleKey.value || data.name || ''
    form.authLabel = data.btnPower || data.name || data.meta?.authMark || ''
    form.authSort = data.menuSort ?? 0
  }

  const rules = reactive<FormRules>({
    name: [
      { required: true, message: '请输入菜单名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    path: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
    label: [{ required: true, message: '输入权限标识', trigger: 'blur' }],
    authName: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
    authLabel: [{ required: true, message: '请输入权限标识', trigger: 'blur' }]
  })

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        resetForm()
        isEdit.value = Boolean(props.editData)
        currentParentPath.value =
          props.parentPath ||
          props.editData?.meta?.parentPath ||
          props.editData?.menuSuperior?.slice(-1)[0] ||
          ''
        fillFormByEditData(props.editData)
        nextTick(() => formRef.value?.ref?.clearValidate?.())
      }
    }
  )

  /**
   * 表单项配置
   */
  const formItems = computed<FormItem[]>(() => {
    const baseItems: FormItem[] = [{ label: '菜单类型', key: 'menuType', span: 24 }]

    // Switch 组件的 span：小屏幕 12，大屏幕 6
    const switchSpan = width.value < 640 ? 12 : 6

    if (form.menuType === 'menu') {
      return [
        ...baseItems,
        { label: '菜单名称', key: 'name', type: 'input', props: { placeholder: '菜单名称' } },
        {
          label: createLabelTooltip(
            '路由地址',
            '一级菜单：以 / 开头的绝对路径（如 /dashboard）\n二级及以下：相对路径（如 console、user）'
          ),
          key: 'path',
          type: 'input',
          props: { placeholder: '如：/dashboard 或 console' }
        },
        { label: '权限标识', key: 'label', type: 'input', props: { placeholder: '如：User' } },
        {
          label: createLabelTooltip(
            '组件路径',
            '一级父级菜单：填写 /index/index\n具体页面：填写组件路径（如 /system/user）\n目录菜单：留空'
          ),
          key: 'component',
          type: 'input',
          props: { placeholder: '如：/system/user 或留空' }
        },
        { label: '图标', key: 'icon', type: 'input', props: { placeholder: '如：ri:user-line' } },
        {
          label: createLabelTooltip(
            '角色权限',
            '仅用于前端权限模式：配置角色标识（如 R_SUPER、R_ADMIN）\n后端权限模式：无需配置'
          ),
          key: 'roles',
          type: 'inputtag',
          props: { placeholder: '输入角色标识后按回车，如：R_SUPER' }
        },
        {
          label: '菜单排序',
          key: 'sort',
          type: 'number',
          props: { min: 0, controlsPosition: 'right', style: { width: '100%' } }
        },
        {
          label: '外部链接',
          key: 'link',
          type: 'input',
          props: { placeholder: '如：https://www.example.com' }
        },
        {
          label: '文本徽章',
          key: 'showTextBadge',
          type: 'input',
          props: { placeholder: '如：New、Hot' }
        },
        {
          label: createLabelTooltip(
            '激活路径',
            '用于详情页等隐藏菜单，指定高亮显示的父级菜单路径\n例如：用户详情页高亮显示"用户管理"菜单'
          ),
          key: 'activePath',
          type: 'input',
          props: { placeholder: '如：/system/user' }
        },
        { label: '是否启用', key: 'isEnable', type: 'switch', span: switchSpan },
        { label: '页面缓存', key: 'keepAlive', type: 'switch', span: switchSpan },
        { label: '隐藏菜单', key: 'isHide', type: 'switch', span: switchSpan },
        { label: '是否内嵌', key: 'isIframe', type: 'switch', span: switchSpan },
        { label: '显示徽章', key: 'showBadge', type: 'switch', span: switchSpan },
        { label: '固定标签', key: 'fixedTab', type: 'switch', span: switchSpan },
        { label: '标签隐藏', key: 'isHideTab', type: 'switch', span: switchSpan },
        { label: '全屏页面', key: 'isFullPage', type: 'switch', span: switchSpan }
      ]
    } else {
      return [
        ...baseItems,
        {
          label: '权限名称',
          key: 'authName',
          type: 'input',
          props: { placeholder: '如：新增、编辑、删除' }
        },
        {
          label: '权限标识',
          key: 'authLabel',
          type: 'input',
          props: { placeholder: '如：add、edit、delete' }
        },
        {
          label: '权限排序',
          key: 'authSort',
          type: 'number',
          props: { min: 0, controlsPosition: 'right', style: { width: '100%' } }
        }
      ]
    }
  })

  const dialogTitle = computed(() => {
    const type = form.menuType === 'menu' ? '菜单' : '按钮'
    return isEdit.value ? `编辑${type}` : `新建${type}`
  })

  /**
   * 是否禁用菜单类型切换
   */
  const disableMenuType = computed(() => {
    if (isEdit.value) return true
    if (!isEdit.value && form.menuType === 'menu' && props.lockType) return true
    return false
  })

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        resetForm()
        isEdit.value = Boolean(props.editData)
        currentParentPath.value =
          props.parentPath ||
          props.editData?.meta?.parentPath ||
          props.editData?.menuSuperior?.slice(-1)[0] ||
          ''
        fillFormByEditData(props.editData)
        nextTick(() => formRef.value?.ref?.clearValidate?.())
      }
    }
  )

  // 如果用户修改了显示名称，视为不再使用原有 i18n key
  watch(
    () => form.name,
    (val) => {
      if (titleKey.value && val !== t(titleKey.value)) {
        titleKey.value = ''
      }
    }
  )

  /**
   * 提交表单
   */
  const handleSubmit = async (): Promise<void> => {
    if (!formRef.value) return

    try {
      await formRef.value.validate()
      const isButton = form.menuType === 'button'
      const displayTitle = isButton ? form.authName : form.name
      const identifier = isButton ? form.authLabel : form.label || form.name
      emit('submit', {
        form: {
          ...form,
          // 展示名（meta.title），优先保持原有 i18n key
          _displayTitle: titleKey.value || displayTitle,
          _titleKey: titleKey.value,
          // 权限标识 = name
          _identifier: identifier
        },
        isEdit: isEdit.value,
        id: props.editData?.id,
        parentPath: currentParentPath.value
      })
      ElMessage.success(`${isEdit.value ? '编辑' : '新增'}成功`)
      handleCancel()
    } catch {
      ElMessage.error('表单校验失败，请检查输入')
    }
  }

  /**
   * 取消操作
   */
  const handleCancel = (): void => {
    emit('update:visible', false)
  }

  /**
   * 对话框关闭后的回调
   */
  const handleClosed = (): void => {
    resetForm()
    isEdit.value = false
    currentParentPath.value = ''
    titleKey.value = ''
  }
</script>
