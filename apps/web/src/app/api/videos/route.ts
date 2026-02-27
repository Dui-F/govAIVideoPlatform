import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}

export async function GET(request: Request) {
  try {
    const supabase = await getSupabase()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('project_id')
    const reviewStatus = searchParams.get('review_status')

    let query = supabase
      .from('generated_videos')
      .select('*')

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    if (reviewStatus) {
      query = query.eq('review_status', reviewStatus)
    }

    const { data: videos, error } = await query.order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ videos })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await getSupabase()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { project_id, image_id, prompt } = body

    const { data: video, error } = await supabase
      .from('generated_videos')
      .insert({
        project_id,
        image_id,
        prompt,
        status: 'pending',
        review_status: 'pending',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ video })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await getSupabase()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, review_status, review_comment, status, video_url, thumbnail_url, jimeng_task_id, duration } = body

    const updateData: Record<string, unknown> = {}
    if (review_status) updateData.review_status = review_status
    if (review_comment !== undefined) updateData.review_comment = review_comment
    if (status) updateData.status = status
    if (video_url) updateData.video_url = video_url
    if (thumbnail_url) updateData.thumbnail_url = thumbnail_url
    if (jimeng_task_id) updateData.jimeng_task_id = jimeng_task_id
    if (duration) updateData.duration = duration

    if (review_status) {
      updateData.reviewer_id = user.id
    }

    const { data: video, error } = await supabase
      .from('generated_videos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ video })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
