import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-server'

/**
 * One-time endpoint to create the first admin account.
 * Protected by ADMIN_SETUP_SECRET env var.
 * Disable or delete this route after your admin account is created.
 *
 * POST /api/admin/create-admin
 * Body: { secret, email, password, fullName }
 */
export async function POST(request: NextRequest) {
  const setupSecret = process.env.ADMIN_SETUP_SECRET

  if (!setupSecret) {
    return NextResponse.json(
      { error: 'ADMIN_SETUP_SECRET is not set in environment variables.' },
      { status: 503 }
    )
  }

  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const { secret, email, password, fullName } = body

  if (secret !== setupSecret) {
    return NextResponse.json({ error: 'Invalid setup secret.' }, { status: 403 })
  }

  if (!email || !password || !fullName) {
    return NextResponse.json(
      { error: 'email, password, and fullName are required.' },
      { status: 400 }
    )
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters.' },
      { status: 400 }
    )
  }

  const supabase = createSupabaseAdminClient()

  // Check there are no existing admin accounts
  const { data: existingAdmins } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'admin')
    .limit(1)

  if (existingAdmins && existingAdmins.length > 0) {
    return NextResponse.json(
      { error: 'An admin account already exists. Use Supabase dashboard to manage admin accounts.' },
      { status: 409 }
    )
  }

  // Create the auth user
  const { data: userData, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  })

  if (createError || !userData.user) {
    return NextResponse.json(
      { error: createError?.message || 'Failed to create user.' },
      { status: 500 }
    )
  }

  // Promote to admin with enterprise access
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      role: 'admin',
      subscription_tier: 'enterprise',
      subscription_status: 'active',
    })
    .eq('id', userData.user.id)

  if (profileError) {
    return NextResponse.json(
      { error: `User created but profile update failed: ${profileError.message}` },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    message: `Admin account created for ${email}. You can now log in at /admin/login.`,
    userId: userData.user.id,
  })
}
