export * from './utils'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface JimengImageRequest {
  prompt: string
  negative_prompt?: string
  width?: number
  height?: number
  style?: string
}

export interface JimengVideoRequest {
  prompt: string
  image_url?: string
  duration?: number
  fps?: number
}

export interface JimengTaskResponse {
  task_id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result_url?: string
  thumbnail_url?: string
  error?: string
}
