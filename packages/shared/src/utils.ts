export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const PROJECT_STATUS_MAP = {
  draft: '草稿',
  generating: '生成中',
  reviewing: '审核中',
  completed: '已完成',
} as const

export const REVIEW_STATUS_MAP = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已拒绝',
} as const

export const GENERATION_STATUS_MAP = {
  pending: '等待中',
  generating: '生成中',
  completed: '已完成',
  failed: '失败',
} as const
