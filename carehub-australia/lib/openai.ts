import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function generateDocument(
  type: string,
  context: Record<string, string>
): Promise<string> {
  const prompts: Record<string, string> = {
    care_plan: `Create a professional care plan document for Australian disability/aged care settings.
Context: ${JSON.stringify(context)}
Include: Goals, support strategies, risk management, review schedule. Format in professional Australian care standards.`,

    support_letter: `Write a professional support letter for NDIS/aged care purposes.
Context: ${JSON.stringify(context)}
Include: Clear recommendations, evidence-based justifications, professional tone. Australian standards.`,

    incident_report: `Generate a professional incident report for aged/disability care.
Context: ${JSON.stringify(context)}
Include: Incident description, immediate response, follow-up actions, recommendations. Australian format.`,

    handover_notes: `Create professional handover notes for care transition.
Context: ${JSON.stringify(context)}
Include: Current status, medications, behaviours, upcoming appointments, special instructions.`,
  }

  const prompt = prompts[type] || `Generate a professional care document for: ${JSON.stringify(context)}`

  const response = await openai.chat.completions.create({
    model: 'claude-sonnet-4-6',
    messages: [
      {
        role: 'system',
        content: 'You are an expert Australian healthcare and disability support professional. Generate detailed, compliant, professional documents following Australian care standards (NDIS, Aged Care Quality Standards).',
      },
      { role: 'user', content: prompt },
    ],
    max_tokens: 2000,
  })

  return response.choices[0]?.message?.content || ''
}

export async function generateShiftNote(data: {
  clientName: string
  date: string
  startTime: string
  endTime: string
  activities: string
  observations: string
  incidents?: string
  medications?: string
  mood?: string
}): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'claude-sonnet-4-6',
    messages: [
      {
        role: 'system',
        content: 'You are an expert Australian disability support worker creating professional shift notes. Follow NDIS documentation standards.',
      },
      {
        role: 'user',
        content: `Create a professional shift note with the following information:
Client: ${data.clientName}
Date: ${data.date}
Time: ${data.startTime} - ${data.endTime}
Activities completed: ${data.activities}
Observations: ${data.observations}
${data.incidents ? `Incidents: ${data.incidents}` : ''}
${data.medications ? `Medications: ${data.medications}` : ''}
${data.mood ? `Client mood/wellbeing: ${data.mood}` : ''}

Write a detailed, professional shift note following Australian NDIS documentation standards. Include all relevant details in a structured format.`,
      },
    ],
    max_tokens: 1000,
  })

  return response.choices[0]?.message?.content || ''
}
