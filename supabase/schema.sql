-- 政府AI视频制作平台数据库结构
-- Supabase PostgreSQL

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 用户表 (扩展 Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'reviewer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 画风模板表
CREATE TABLE IF NOT EXISTS public.art_styles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  preview_image TEXT,
  prompt_template TEXT NOT NULL,
  negative_prompt TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 提示词模板表
CREATE TABLE IF NOT EXISTS public.prompt_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('style', 'transition', 'scene', 'character')),
  prompt_content TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 项目表
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  script_content TEXT,
  art_style_id UUID REFERENCES public.art_styles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'reviewing', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 生成的图片表
CREATE TABLE IF NOT EXISTS public.generated_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  prompt TEXT NOT NULL,
  image_url TEXT,
  thumbnail_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  review_status TEXT NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected')),
  review_comment TEXT,
  reviewer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  jimeng_task_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 生成的视频表
CREATE TABLE IF NOT EXISTS public.generated_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  image_id UUID REFERENCES public.generated_images(id) ON DELETE SET NULL,
  prompt TEXT NOT NULL,
  video_url TEXT,
  thumbnail_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  review_status TEXT NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected')),
  review_comment TEXT,
  reviewer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  jimeng_task_id TEXT,
  duration INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 视频学习记录表
CREATE TABLE IF NOT EXISTS public.video_learnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  video_url TEXT NOT NULL,
  video_name TEXT NOT NULL,
  extracted_style_prompt TEXT,
  extracted_transition_prompt TEXT,
  thumbnail_url TEXT,
  analysis_status TEXT NOT NULL DEFAULT 'pending' CHECK (analysis_status IN ('pending', 'analyzing', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 审核日志表
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('image', 'video', 'project', 'style', 'prompt', 'user')),
  resource_id TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_generated_images_project_id ON public.generated_images(project_id);
CREATE INDEX IF NOT EXISTS idx_generated_images_review_status ON public.generated_images(review_status);
CREATE INDEX IF NOT EXISTS idx_generated_videos_project_id ON public.generated_videos(project_id);
CREATE INDEX IF NOT EXISTS idx_generated_videos_review_status ON public.generated_videos(review_status);
CREATE INDEX IF NOT EXISTS idx_video_learnings_user_id ON public.video_learnings(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_art_styles_is_active ON public.art_styles(is_active);
CREATE INDEX IF NOT EXISTS idx_prompt_templates_category ON public.prompt_templates(category);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为所有需要的表创建触发器
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_art_styles_updated_at
  BEFORE UPDATE ON public.art_styles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_prompt_templates_updated_at
  BEFORE UPDATE ON public.prompt_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_generated_images_updated_at
  BEFORE UPDATE ON public.generated_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_generated_videos_updated_at
  BEFORE UPDATE ON public.generated_videos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_video_learnings_updated_at
  BEFORE UPDATE ON public.video_learnings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 设置 Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.art_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_learnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS 策略: 用户只能查看和更新自己的数据
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS 策略: 画风和提示词模板所有人可读
CREATE POLICY "Art styles are viewable by everyone" ON public.art_styles
  FOR SELECT USING (true);

CREATE POLICY "Prompt templates are viewable by everyone" ON public.prompt_templates
  FOR SELECT USING (true);

-- RLS 策略: 项目只能被创建者和管理员访问
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can create projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

-- RLS 策略: 图片和视频审核
CREATE POLICY "Users can view project images" ON public.generated_images
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.projects WHERE id = project_id AND (user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'reviewer')
    ))
  ));

CREATE POLICY "Reviewers can update image status" ON public.generated_images
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'reviewer')
  ));

CREATE POLICY "Users can view project videos" ON public.generated_videos
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.projects WHERE id = project_id AND (user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'reviewer')
    ))
  ));

CREATE POLICY "Reviewers can update video status" ON public.generated_videos
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'reviewer')
  ));

-- RLS 策略: 视频学习记录
CREATE POLICY "Users can view own learnings" ON public.video_learnings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create learnings" ON public.video_learnings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 管理员策略 (所有表)
CREATE POLICY "Admins can do everything on users" ON public.users
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage art styles" ON public.art_styles
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage prompt templates" ON public.prompt_templates
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

-- 创建新用户时自动添加到 users 表
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 插入默认画风模板
INSERT INTO public.art_styles (name, description, prompt_template, negative_prompt, sort_order) VALUES
('新闻联播风格', '央视新闻联播经典风格，庄重大气', 'professional news broadcast style, formal atmosphere, studio lighting, 4K quality, Chinese state media', 'cartoon, anime, low quality, blurry, informal', 1),
('纪录片风格', '纪录片质感，真实自然', 'documentary style, natural lighting, cinematic, realistic, high detail, professional camera work', 'artificial, staged, low quality, amateur', 2),
('宣传片风格', '企业宣传片风格，现代感强', 'corporate promotional video, modern, sleek, professional, dynamic camera, high production value', 'amateur, low quality, shaky, unprofessional', 3),
('水墨风格', '中国传统水墨画风格', 'Chinese ink painting style, traditional art, elegant, brush strokes, watercolor, cultural heritage', 'modern, digital, photorealistic, western style', 4),
('科技风格', '未来科技感视觉风格', 'futuristic technology style, holographic elements, blue neon accents, clean modern design, digital interface', 'retro, vintage, organic, natural', 5);

-- 插入默认提示词模板
INSERT INTO public.prompt_templates (name, category, prompt_content, description) VALUES
('新闻开场', 'scene', 'news broadcast opening, studio setting, anchor desk, professional lighting, breaking news graphics', '新闻节目开场场景'),
('平滑转场', 'transition', 'smooth transition, cross dissolve, seamless blend, gradual fade, motion blur', '通用平滑转场效果'),
('企业人物', 'character', 'professional business person, corporate attire, confident expression, office background, soft lighting', '企业宣传片人物形象'),
('科技风格', 'style', 'futuristic technology style, holographic elements, blue neon accents, clean modern design, digital interface', '科技感视觉风格'),
('淡入淡出', 'transition', 'fade in fade out, gradual opacity change, smooth blending, cinematic transition', '经典淡入淡出转场'),
('城市风光', 'scene', 'cityscape, urban skyline, modern architecture, aerial view, golden hour lighting', '城市风光场景');
