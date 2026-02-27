import axios from 'axios'
import type { JimengImageRequest, JimengVideoRequest, JimengTaskResponse, ApiResponse } from '@gov-ai-video/shared'

const JIMENG_API_BASE = process.env.JIMENG_API_BASE_URL || 'https://api.jimeng.ai'

const jimengClient = axios.create({
  baseURL: JIMENG_API_BASE,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.JIMENG_API_KEY}`,
  },
})

export async function generateImage(params: JimengImageRequest): Promise<JimengTaskResponse> {
  const response = await jimengClient.post('/v1/images/generations', params)
  return response.data
}

export async function generateVideo(params: JimengVideoRequest): Promise<JimengTaskResponse> {
  const response = await jimengClient.post('/v1/videos/generations', params)
  return response.data
}

export async function getTaskStatus(taskId: string): Promise<JimengTaskResponse> {
  const response = await jimengClient.get(`/v1/tasks/${taskId}`)
  return response.data
}

export async function analyzeVideo(videoUrl: string): Promise<ApiResponse<{
  style_prompt: string
  transition_prompt: string
  key_frames: string[]
}>> {
  const response = await jimengClient.post('/v1/videos/analyze', { video_url: videoUrl })
  return response.data
}

export const jimengApi = {
  generateImage,
  generateVideo,
  getTaskStatus,
  analyzeVideo,
}
