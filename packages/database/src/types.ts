export interface User {
  id: string
  email: string
  full_name: string | null
  role: 'admin' | 'user' | 'reviewer'
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface ArtStyle {
  id: string
  name: string
  description: string | null
  preview_image: string | null
  prompt_template: string
  negative_prompt: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface PromptTemplate {
  id: string
  name: string
  category: 'style' | 'transition' | 'scene' | 'character'
  prompt_content: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  title: string
  description: string | null
  script_content: string | null
  art_style_id: string | null
  status: 'draft' | 'generating' | 'reviewing' | 'completed'
  created_at: string
  updated_at: string
}

export interface GeneratedImage {
  id: string
  project_id: string
  prompt: string
  image_url: string
  thumbnail_url: string | null
  status: 'pending' | 'generating' | 'completed' | 'failed'
  review_status: 'pending' | 'approved' | 'rejected'
  review_comment: string | null
  jimeng_task_id: string | null
  created_at: string
  updated_at: string
}

export interface GeneratedVideo {
  id: string
  project_id: string
  image_id: string | null
  prompt: string
  video_url: string | null
  thumbnail_url: string | null
  status: 'pending' | 'generating' | 'completed' | 'failed'
  review_status: 'pending' | 'approved' | 'rejected'
  review_comment: string | null
  jimeng_task_id: string | null
  duration: number | null
  created_at: string
  updated_at: string
}

export interface VideoLearning {
  id: string
  user_id: string
  video_url: string
  video_name: string
  extracted_style_prompt: string | null
  extracted_transition_prompt: string | null
  thumbnail_url: string | null
  analysis_status: 'pending' | 'analyzing' | 'completed' | 'failed'
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: string
  user_id: string
  action: string
  resource_type: 'image' | 'video' | 'project'
  resource_id: string
  details: Record<string, unknown> | null
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      users: { Row: User; Insert: Omit<User, 'created_at' | 'updated_at'>; Update: Partial<User> }
      art_styles: { Row: ArtStyle; Insert: Omit<ArtStyle, 'id' | 'created_at' | 'updated_at'>; Update: Partial<ArtStyle> }
      prompt_templates: { Row: PromptTemplate; Insert: Omit<PromptTemplate, 'id' | 'created_at' | 'updated_at'>; Update: Partial<PromptTemplate> }
      projects: { Row: Project; Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Project> }
      generated_images: { Row: GeneratedImage; Insert: Omit<GeneratedImage, 'id' | 'created_at' | 'updated_at'>; Update: Partial<GeneratedImage> }
      generated_videos: { Row: GeneratedVideo; Insert: Omit<GeneratedVideo, 'id' | 'created_at' | 'updated_at'>; Update: Partial<GeneratedVideo> }
      video_learnings: { Row: VideoLearning; Insert: Omit<VideoLearning, 'id' | 'created_at' | 'updated_at'>; Update: Partial<VideoLearning> }
      audit_logs: { Row: AuditLog; Insert: Omit<AuditLog, 'id' | 'created_at'>; Update: Partial<AuditLog> }
    }
  }
}
