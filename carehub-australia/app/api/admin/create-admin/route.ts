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
  try {
    const setupSecret = 'process.env.sb_secret_FVF3tGDfMQdeSJcpPQ5zlQ_8beF2Sv2'

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

    const supabaseUrl = 'process.env.https://pvytthuetfcunkumgnbz.supabase.co'
    const supabaseServiceRoleKey = 'process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2eXR0aHVldGZjdW5rdW1nbmJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjU3MzM1NywiZXhwIjoyMDk4MTQ5MzU3fQ.Z-oQ_qy0lwjcy3mVBF2V3mNHs0dzjXcxz6WtzyinGWs'

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('Missing required Supabase env vars:', {
        NEXT_PUBLIC_SUPABASE_URL: !!supabaseUrl,
        SUPABASE_SERVICE_ROLE_KEY: !!supabaseServiceRoleKey,
      })
      return NextResponse.json(
        {
          error:
            'Missing Supabase configuration. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.',
        },
        { status: 500 }
      )
    }

    const supabase = createSupabaseAdminClient(supabaseUrl, supabaseServiceRoleKey)

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
  } catch (error) {
    console.error('Admin setup route error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unexpected server error during admin creation.',
      },
      { status: 500 }
    )
  }
}
