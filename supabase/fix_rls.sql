-- 修复 RLS 策略导致的无限递归问题

-- 1. 创建安全函数用于检查管理员权限 (使用 SECURITY DEFINER 绕过 RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 创建安全函数用于检查审核员或管理员权限
CREATE OR REPLACE FUNCTION public.is_reviewer_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid() AND role IN ('admin', 'reviewer')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. 修复 users 表的管理员策略 (这是导致问题的核心)
DROP POLICY IF EXISTS "Admins can do everything on users" ON public.users;
CREATE POLICY "Admins can do everything on users" ON public.users
  FOR ALL USING (public.is_admin());

-- 4. 优化 projects 表的策略
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

-- 5. 优化 generated_images 表的策略
DROP POLICY IF EXISTS "Users can view project images" ON public.generated_images;
CREATE POLICY "Users can view project images" ON public.generated_images
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.projects WHERE id = project_id AND (user_id = auth.uid() OR public.is_reviewer_or_admin())
  ));

DROP POLICY IF EXISTS "Reviewers can update image status" ON public.generated_images;
CREATE POLICY "Reviewers can update image status" ON public.generated_images
  FOR UPDATE USING (public.is_reviewer_or_admin());

-- 6. 优化 generated_videos 表的策略
DROP POLICY IF EXISTS "Users can view project videos" ON public.generated_videos;
CREATE POLICY "Users can view project videos" ON public.generated_videos
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.projects WHERE id = project_id AND (user_id = auth.uid() OR public.is_reviewer_or_admin())
  ));

DROP POLICY IF EXISTS "Reviewers can update video status" ON public.generated_videos;
CREATE POLICY "Reviewers can update video status" ON public.generated_videos
  FOR UPDATE USING (public.is_reviewer_or_admin());

-- 7. 优化其他表的管理员策略
DROP POLICY IF EXISTS "Admins can manage art styles" ON public.art_styles;
CREATE POLICY "Admins can manage art styles" ON public.art_styles
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage prompt templates" ON public.prompt_templates;
CREATE POLICY "Admins can manage prompt templates" ON public.prompt_templates
  FOR ALL USING (public.is_admin());
