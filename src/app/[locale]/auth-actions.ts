'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?message=Email ou mot de passe incorrect')
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    revalidatePath('/', 'layout')
    if (profile?.role === 'admin') {
      redirect('/admin')
    } else {
      // After login, bring regular users to the home page (not reservations).
      redirect('/')
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string

  if (!email || !password) {
    redirect('/signup?message=Email et mot de passe requis')
  }

  if (password.length < 6) {
    redirect('/signup?message=Le mot de passe doit contenir au moins 6 caractères')
  }

  const instantSignupEnabled = process.env.SUPABASE_INSTANT_SIGNUP === 'true'
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PRIVATE_SUPABASE_SERVICE_ROLE_KEY

  if (instantSignupEnabled && serviceRoleKey && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const adminClient = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey)
    const { data: createdUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (createError) {
      redirect(`/signup?message=${encodeURIComponent(createError.message)}`)
    }

    if (createdUser?.user?.id) {
      await adminClient.from('profiles').upsert({
        id: createdUser.user.id,
        email,
        role: 'user',
      })
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      redirect('/login?message=Compte créé, connectez-vous pour continuer')
    }

    revalidatePath('/', 'layout')
    redirect('/')
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${baseUrl}/auth/confirm?next=/login`,
    },
  })

  if (error) {
    redirect(`/signup?message=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=Compte créé. Vérifiez votre email puis connectez-vous')
}
