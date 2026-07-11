import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedSupabaseClient } from '@/lib/api-auth'
import OpenAI from 'openai'

const documentPrompts: Record<string, (ctx: Record<string, string>) => string> = {
  care_plan: (ctx) => `Create a professional, NDIS-compliant care plan document for an Australian disability support setting.

Context provided:
- Client name: ${ctx.clientName || 'the participant'}
- Age/Diagnosis: ${ctx.diagnosis || 'not specified'}
- Goals: ${ctx.goals || 'to be determined with participant'}
- Additional context: ${ctx.additionalContext || 'none'}

Create a comprehensive care plan that includes:
1. Client Overview (strengths, needs, living situation)
2. Goals and Outcomes (at least 3 SMART goals)
3. Support Strategies for each goal
4. Risk Management section
5. Review and Monitoring schedule

Follow Australian NDIS Practice Standards. Use person-centred, strengths-based language. Format clearly with sections and sub-sections.`,

  support_letter: (ctx) => `Write a professional support letter for NDIS/aged care purposes.

Context:
- Subject: ${ctx.clientName || 'the participant'}
- Purpose: ${ctx.goals || 'support needs'}
- Diagnosis/situation: ${ctx.diagnosis || 'as described'}
- Additional context: ${ctx.additionalContext || 'none'}

Create a formal, evidence-based support letter that:
1. States the purpose clearly
2. Describes the participant's disability/condition and how it impacts daily life
3. Outlines current support needs with specific examples
4. Makes clear, justified recommendations
5. References relevant Australian care standards

Use professional, clinical language appropriate for NDIS planners and decision makers.`,

  incident_report: (ctx) => `Generate a professional incident report for an Australian care setting.

Incident context:
${ctx.goals || ctx.additionalContext || 'incident details to be provided'}

Create a formal incident report including:
1. Incident summary and classification
2. Detailed description of what occurred
3. People involved and witnesses
4. Immediate response actions taken
5. Short-term and long-term follow-up actions
6. Risk assessment and prevention strategies
7. Reporting requirements (NDIS Commission, employer, police if applicable)

Follow Australian NDIS incident reporting requirements and Aged Care Quality and Safety Commission guidelines.`,

  handover_notes: (ctx) => `Create professional handover notes for a care transition.

Shift/handover context:
- Client: ${ctx.clientName || 'participant'}
- Period: ${ctx.goals || 'shift period'}
- Details: ${ctx.additionalContext || 'standard handover'}

Create comprehensive handover notes including:
1. Current status summary (physical, emotional, social wellbeing)
2. Activities completed during shift
3. Medication administration record
4. Behavioural observations
5. Upcoming appointments and tasks
6. Priority actions for incoming shift
7. Any concerns or issues to monitor

Use clear, objective language appropriate for clinical documentation.`,
  behaviour_plan: (ctx) => `Create a professional behaviour support plan for an Australian disability support context.

Client:
- Name: ${ctx.clientName || 'the participant'}
- Age/Diagnosis: ${ctx.diagnosis || 'not specified'}
- Presenting behaviours: ${ctx.goals || 'not specified'}
- Additional context: ${ctx.additionalContext || 'none'}

Create a strengths-based behaviour support plan that includes:
1. Behaviour description and triggers
2. Positive support strategies
3. Proactive environmental adjustments
4. De-escalation and response steps
5. Monitoring and review plan
6. Notes for carers and support workers

Use clear, person-centred language and follow NDIS behaviour support guidance.`,
  risk_assessment: (ctx) => `Create a professional risk assessment for an Australian care setting.

Client:
- Name: ${ctx.clientName || 'the participant'}
- Age/Diagnosis: ${ctx.diagnosis || 'not specified'}
- Risk context: ${ctx.goals || 'not specified'}
- Additional context: ${ctx.additionalContext || 'none'}

Create a formal risk assessment document that includes:
1. Identified risks and likelihood
2. Impact analysis
3. Existing controls and supports
4. Recommended actions to reduce risk
5. Monitoring and review schedule
6. Responsibilities and escalation pathways

Use clear, factual language with a focus on safety, dignity, and compliance.`,
  goal_plan: (ctx) => `Create a structured goal setting plan for an Australian disability support setting.

Client:
- Name: ${ctx.clientName || 'the participant'}
- Age/Diagnosis: ${ctx.diagnosis || 'not specified'}
- Goals/Support needs: ${ctx.goals || 'not specified'}
- Additional context: ${ctx.additionalContext || 'none'}

Create a goal plan that includes:
1. Meaningful participant goals
2. SMART objectives for each goal
3. Support strategies and responsible persons
4. Timeframes and milestones
5. Progress review plans
6. Participant strengths and preferences

Use person-centred, strengths-based language appropriate for NDIS planning.`,
  discharge_summary: (ctx) => `Create a professional discharge summary for an Australian care transition.

Client:
- Name: ${ctx.clientName || 'the participant'}
- Age/Diagnosis: ${ctx.diagnosis || 'not specified'}
- Current situation: ${ctx.goals || 'not specified'}
- Additional context: ${ctx.additionalContext || 'none'}

Create a discharge summary that includes:
1. Summary of current status and clinical context
2. Support needs and ongoing care requirements
3. Medications and health follow-up recommendations
4. Community and allied health referrals
5. Transition plan and key contacts
6. Safety and monitoring instructions

Use clear, concise, professional Australian care sector language.`,
}

export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await getAuthenticatedSupabaseClient(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const { type, context, title } = await request.json()

    if (!type || !context) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const openaiApiKey = process.env.OPENAI_API_KEY?.trim()

    if (!openaiApiKey) {
      return NextResponse.json(
        {
          error:
            'OpenAI API key is not configured. Add OPENAI_API_KEY to your environment and restart the app.',
        },
        { status: 503 }
      )
    }

    // Check usage limits based on subscription
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status, role')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile lookup error:', profileError)
      return NextResponse.json({ error: 'Unable to load your account profile.' }, { status: 500 })
    }

    const isAdmin = profile?.role === 'admin'

    if (!isAdmin) {
      const limits: Record<string, number> = {
        free: 1,
        starter: 5,
        professional: 50,
        enterprise: Infinity,
      }

      const tier = profile?.subscription_tier || 'free'
      const limit = limits[tier] || 1

      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { count } = await supabase
        .from('generated_documents')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString())

      if ((count || 0) >= limit) {
        return NextResponse.json(
          { error: `Monthly document limit reached (${limit}). Please upgrade your plan.` },
          { status: 429 }
        )
      }
    }

    // Generate document with OpenAI
    const promptFn = documentPrompts[type]
    if (!promptFn) {
      return NextResponse.json({ error: 'Unknown document type' }, { status: 400 })
    }

    const prompt = promptFn(context)

    const openai = new OpenAI({ apiKey: openaiApiKey })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert Australian healthcare and disability support professional. Generate detailed, compliant, professional documents following Australian care standards (NDIS, Aged Care Quality Standards). Format documents clearly with headers, sections, and professional language.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.3,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json({ error: 'Failed to generate document' }, { status: 500 })
    }

    // Save to database
    const { data: doc, error: dbError } = await supabase
      .from('generated_documents')
      .insert({
        user_id: user.id,
        type,
        title: title || `${type.replace('_', ' ')} - ${new Date().toLocaleDateString('en-AU')}`,
        content,
        context,
      })
      .select()
      .single()

    if (dbError) {
      console.error('DB error:', dbError)
    }

    return NextResponse.json({
      content,
      documentId: doc?.id,
      tokensUsed: completion.usage?.total_tokens,
    })
  } catch (error) {
    console.error('Document generation error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
