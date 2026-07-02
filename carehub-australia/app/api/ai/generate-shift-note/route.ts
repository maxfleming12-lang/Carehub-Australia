import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const body = await request.json()
    const { clientName, date, startTime, endTime, activities, observations, mood, medications, incidents, goals } = body

    if (!clientName || !date || !activities) {
      return NextResponse.json({ error: 'Missing required fields: clientName, date, activities' }, { status: 400 })
    }

    // Check usage limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'

    if (!isAdmin) {
      const limits: Record<string, number> = {
        free: 3,
        starter: 10,
        professional: Infinity,
        enterprise: Infinity,
      }

      const tier = profile?.subscription_tier || 'free'
      const limit = limits[tier] || 3

      if (limit !== Infinity) {
        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        startOfMonth.setHours(0, 0, 0, 0)

        const { count } = await supabase
          .from('shift_notes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', startOfMonth.toISOString())

        if ((count || 0) >= limit) {
          return NextResponse.json(
            { error: `Monthly shift note limit reached (${limit}). Please upgrade your plan.` },
            { status: 429 }
          )
        }
      }
    }

    const prompt = `Create a professional, NDIS-compliant shift note for an Australian disability support setting.

Shift Information:
- Client: ${clientName}
- Date: ${date}
- Shift Time: ${startTime || 'not specified'} to ${endTime || 'not specified'}

Activities Completed:
${activities}

${observations ? `Observations/Notes:\n${observations}` : ''}
${mood ? `Client Mood & Wellbeing:\n${mood}` : ''}
${medications ? `Medications:\n${medications}` : ''}
${goals ? `Goals Progress:\n${goals}` : ''}
${incidents ? `Incidents/Concerns:\n${incidents}` : 'No incidents to report.'}

Create a comprehensive, professional shift note that:
1. Uses person-centred, respectful language
2. Includes all relevant details from the information provided
3. Follows NDIS documentation standards
4. Is objective and factual in tone
5. Includes clear sections for easy reading
6. Ends with handover notes

Format with clear headings and professional Australian care sector language.`

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert Australian disability support worker creating professional shift notes. Follow NDIS documentation standards. Use person-centred, strengths-based language. Be objective, factual, and professional.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1200,
      temperature: 0.2,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json({ error: 'Failed to generate shift note' }, { status: 500 })
    }

    // Save to database
    const { data: note } = await supabase
      .from('shift_notes')
      .insert({
        user_id: user.id,
        client_name: clientName,
        date,
        start_time: startTime || '',
        end_time: endTime || '',
        content,
        raw_data: body,
      })
      .select()
      .single()

    return NextResponse.json({
      content,
      noteId: note?.id,
    })
  } catch (error) {
    console.error('Shift note generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
