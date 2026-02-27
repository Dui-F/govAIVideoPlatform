import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function requireAuth() {
  const cookieStore = cookies()
  const token = cookieStore.get('sb-access-token')

  if (!token) {
    redirect('/login')
  }

  return token.value
}
