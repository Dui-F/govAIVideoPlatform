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
          } catch {
            // Handle cookie error
          }
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
      .from('generated_images')
      .select('*')

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    if (reviewStatus) {
      query = query.eq('review_status', reviewStatus)
    }

    const { data: images, error } = await query.order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ images })
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
    const { project_id, prompt } = body

    const { data: image, error } = await supabase
      .from('generated_images')
      .insert({
        project_id,
        prompt,
        status: 'pending',
        review_status: 'pending',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ image })
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
    const { id, review_status, review_comment, status, image_url, thumbnail_url, jimeng_task_id } = body

    const updateData: Record<string, unknown> = {}
    if (review_status) updateData.review_status = review_status
    if (review_comment !== undefined) updateData.review_comment = review_comment
    if (status) updateData.status = status
    if (image_url) updateData.image_url = image_url
    if (thumbnail_url) updateData.thumbnail_url = thumbnail_url
    if (jimeng_task_id) updateData.jimeng_task_id = jimeng_task_id

    if (review_status) {
      updateData.reviewer_id = user.id
    }

    const { data: image, error } = await supabase
      .from('generated_images')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ image })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
