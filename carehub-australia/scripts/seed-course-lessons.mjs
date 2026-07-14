#!/usr/bin/env node

// Attaches real lesson content to the training courses.
// Lessons are upgraded from plain title strings to { title, content } objects
// (the course page renders both shapes). Safe to run more than once: matching
// is by course title + lesson title, and content is simply replaced.
//
// Usage: node scripts/seed-course-lessons.mjs

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

// courseTitle -> moduleTitle -> lessonTitle -> lesson content.
// Paragraphs are separated by blank lines; a paragraph whose lines start with
// "- " renders as a checklist on the course page.
const courseLessons = {
  'NDIS Fundamentals for Support Workers': {
    'NDIS foundations': {
      'Participant choice and control': `Choice and control is the founding principle of the NDIS. Participants decide what supports they receive, who delivers them, and how they are delivered. Your job is to make those choices real in everyday support, not to make decisions on the participant's behalf.

In practice this means offering genuine options rather than defaults. Ask before acting, explain what you are doing, and respect a decision even when you would choose differently. Small moments matter: what to wear, what to eat, the order of tasks, whether to go out.

- Offer options, not instructions
- Ask before assisting with any task
- Respect decisions you disagree with, and record concerns factually
- Raise barriers to choice with your coordinator rather than working around the participant`,
      'Reasonable and necessary supports': `NDIS plans fund supports that are "reasonable and necessary". A support meets this test when it relates to the participant's disability, helps them pursue their goals, represents value for money, and is not something better provided by another system such as health or education.

As a support worker you deliver what is in the plan and the service agreement. If a participant asks for something outside the plan, do not simply refuse or quietly do it anyway. Explain that you need to check, then raise it with your supervisor or the participant's support coordinator.

Understanding this test also helps you write better notes. Your observations about what works, what has changed, and what the participant is trying to achieve become evidence at plan reviews.`,
      'Roles in the support ecosystem': `Participants are supported by a network of roles, and knowing who does what keeps support safe and consistent. The NDIA plans and funds. Support coordinators help participants find and connect services. Providers employ workers and hold quality obligations. Plan managers handle invoicing and budgets.

Your role sits closest to the participant: delivering agreed supports, observing changes, documenting accurately, and escalating concerns. You are not the participant's clinician, financial adviser, or decision maker.

- Know your service agreement and what supports you are engaged to provide
- Direct plan or funding questions to the coordinator or plan manager
- Escalate clinical concerns to your supervisor for referral
- Never accept gifts, loans, or private work arrangements outside policy`,
    },
    'Rights and safeguarding': {
      'Consent and privacy': `Consent is ongoing, not a one-off signature. Ask before every support task, in a way the participant understands, and accept that consent can be withdrawn at any moment. "We do this every day" is not consent. Where a person needs help to decide, support the decision with plain language, extra time, and trusted people; you support the decision, you do not make it.

Privacy is the other half of respect. Participants share their homes, bodies, and health information with you, and the Privacy Act and NDIS Code of Conduct require you to protect all of it. Share information only through proper channels and only as needed to deliver support.

- Ask before assisting, every time, and respect a "no"
- Never discuss participants with your own family or friends, even without names
- Keep notes and rosters out of public view and lock devices used for shift notes
- Ask before photos, never post them, and report any privacy breach the same day`,
      'Recognising incidents': `An incident is any event that caused, or could have caused, harm to a participant, worker, or other person during support. This includes injuries, medication errors, falls, property damage, and near misses where harm was narrowly avoided.

A subset are "reportable incidents" that providers must notify to the NDIS Commission: the death, serious injury, abuse or neglect of a participant, unlawful sexual or physical contact, sexual misconduct, and the unauthorised use of a restrictive practice.

You do not have to classify the incident yourself. Your job is to recognise that something is an incident, make the person safe, provide first aid if trained, call 000 for anything life-threatening, and report internally promptly and factually. When unsure, report it anyway: a near miss reported today prevents an injury next month.`,
      'Escalation basics': `Every provider has an incident procedure that sets out who you tell, how quickly, and in what format. Know yours before you need it. The usual chain is worker to supervisor or on-call manager, then management handles notifications to families, the NDIS Commission, police, or the coroner as required.

Time frames matter: reportable incidents generally must reach the NDIS Commission within 24 hours of the provider becoming aware, with a detailed report within 5 business days. Your prompt internal report on the same shift is what makes that possible.

Never sit on a concern because you are not certain, because someone senior seems unbothered, or because the person involved is a colleague. If your supervisor does not act on a serious safeguarding concern, escalate above them: protecting the participant outranks the roster.`,
    },
    'Documentation basics': {
      'Objective language': `Objective notes record what you observed: what you saw, heard, measured, or were told, with the source identified. Subjective notes record opinions and interpretations, and they do not belong in care records.

Write "Maria ate half her lunch and pushed the plate away" rather than "Maria was being difficult about food". Write "John said he did not sleep and yawned frequently" rather than "John was lazy today". If someone else told you something, attribute it: "Maria's sister reported...".

- Describe behaviour, do not label the person
- Quote significant statements word for word where possible
- Include times, durations, and amounts
- Note what you did in response
- Read your note back: could the participant read it without feeling judged?`,
      'Shift note structure': `A good shift note lets the next worker walk in informed. Use your organisation's template; where there is none, a reliable structure covers supports delivered, observations, and follow-up.

Start with the essentials: date, time, location, who was present. Record the supports you delivered against the plan, how the participant engaged, anything unusual, and any incidents or concerns raised. Close with actions needed: messages for the next shift, supplies running low, appointments coming up.

Write notes during or immediately after the shift while details are fresh. Late notes lose accuracy, and in a dispute an entry written days later carries far less weight.`,
      'Handover essentials': `Handover transfers responsibility for someone's safety and wellbeing. Done poorly, it is where information and continuity fall through the cracks.

Prioritise what the incoming worker must know to support the person safely today: changes in health or mood, medication updates, new risks, incidents, appointments, and anything the participant has asked for. Distinguish clearly between fact and impression, and point to the notes for detail.

- Lead with safety-critical changes
- Keep it structured and brief; do not rely on memory alone
- Confirm the incoming worker understands the key points
- Record that handover occurred and where the details live
- Never skip handover because a shift ran late`,
    },
  },
  'Safe Manual Handling in Care Settings': {
    'Risk before technique': {
      'Hazard spotting': `Most manual handling injuries are predictable in hindsight. The discipline is looking before every task, every time, because conditions change from shift to shift.

Scan four areas. The person: pain, fatigue, dizziness, mood, cooperation, changed mobility since last time. The task: force, distance, awkward postures, repetition. The environment: wet floors, mats, clutter, poor lighting, confined bathrooms, pets underfoot. The equipment: is it available, charged, clean, within its rated capacity, and are you trained on it?

- Ask the person how they are feeling before you start
- Check the care plan for the current transfer method
- Clear the path and set up the destination first
- Confirm equipment condition before relying on it`,
      'When to stop': `Having the authority to pause a task is part of your job, not an inconvenience to it. Stop when the person presents differently from their plan: new pain, reduced weight-bearing, drowsiness, distress, or refusal. Stop when equipment is missing or faulty. Stop when the plan calls for two workers and you are alone.

Stopping does not mean abandoning the person. Make them safe and comfortable where they are, explain what you are doing, and contact your supervisor for direction. Document what you observed and who you notified.

Workers are injured most often when they improvise under time pressure. A delayed shower never justifies a spinal injury or a dropped participant.`,
      'Dynamic risk assessment': `A written risk assessment describes the task as it usually is. Dynamic risk assessment is the continuous version you run in your head while the task happens, because people and environments change mid-task.

Watch for the person tiring, grabbing at you, or losing balance; for equipment slipping or straining; for your own body position degrading as you fatigue. Be ready to pause mid-transfer, lower the person to a safe surface, and reset rather than pushing through.

After any task that did not go to plan, take a moment before the next one: what changed, does the care plan still match reality, and who needs to know? Feed that back through your notes so the formal assessment catches up with the person's actual needs.`,
    },
    'Safer movement principles': {
      'Base of support': `Your base of support is the area under and between your feet. A wider, staggered stance keeps your centre of gravity inside your base, which is what keeps you stable when load shifts unexpectedly.

Before assisting, position your feet shoulder-width apart with one foot slightly forward, knees soft, weight even. Get close to the person or load: holding weight away from your body multiplies the strain on your spine. Adjust your feet as the movement progresses rather than reaching or leaning.

- Feet shoulder-width, staggered stance
- Bend at the knees and hips, keep your back's natural curves
- Keep the load close to your body
- Move your feet instead of stretching your reach`,
      'Avoiding twisting': `Twisting under load is one of the most reliable ways to injure your back. The spine tolerates bending and rotation poorly when combined, especially with weight and repetition.

The fix is footwork. Turn by stepping and pivoting your whole body so your hips and shoulders stay aligned, with your nose over your toes. Set up tasks to minimise rotation in the first place: position the wheelchair beside the bed on the person's stronger side, place items you will need within easy reach, and face the direction of the movement before it starts.

If you notice yourself twisting during a routine task, treat it as a design problem. Rearranging the room or resequencing the steps beats relying on concentration forever.`,
      'Prompting and communication': `In care work you are rarely lifting an object; you are assisting a person who can usually contribute. Clear communication turns a passive lift into an assisted movement, which is safer for both of you.

Explain the plan before you begin and agree on a signal such as "ready, set, stand". Give one instruction at a time and allow processing time, particularly for people with cognitive impairment or communication differences. Prompt the person to use their own strength: push up from the armrests, lean forward, take a step.

- Explain, then agree the signal, then move
- Count or cue the same way every time for familiarity
- With two workers, one person leads and calls the timing
- Watch the person's face throughout for pain or fear`,
    },
    'Equipment and escalation': {
      'Common mobility aids': `Know the everyday aids you will meet and what each is for. Walking aids: sticks, crutches, and wheeled walkers for people who are weight-bearing. Transfer aids: slide sheets to reposition in bed, transfer boards to bridge gaps, swivel cushions for car transfers, transfer belts for guided standing where the person supports their own weight.

Hoists carry the person's full weight: mobile hoists, ceiling hoists, and standing hoists each require training and, critically, the correct sling in the correct size for that person. Never use a hoist or sling you have not been trained on.

Aids only help when used as prescribed. Using a belt to drag a non-weight-bearing person, or a hoist with a damaged sling, is more dangerous than asking for help.`,
      'Equipment checks': `Every piece of equipment gets a quick check before every use. It takes seconds and catches the failures that cause serious injuries.

- Brakes: test they lock and hold on beds, wheelchairs, and hoists
- Slings and belts: fraying, torn stitching, damaged clips or loops, correct size
- Batteries: charged, with the emergency lowering function known to you
- Wheels and castors: free-running, no cracks, nothing tangled
- Load rating: within its safe working load for this person
- Cleanliness: cleaned between participants per policy

Tag and remove faulty equipment from use immediately and report it: do not leave it for the next worker to discover mid-transfer. Record the fault and what you used instead.`,
      'Reporting changed needs': `Mobility changes, and the care plan must change with it. If a person who transferred independently last month now needs steadying, or a one-worker assist now feels unsafe, that observation belongs in writing the same day.

Report through your shift notes and directly to your supervisor when the change affects safety. Describe what is different in concrete terms: "needed both hands held and two attempts to stand from the chair, previously stood with one hand on the walker". Concrete detail is what triggers a proper reassessment by an occupational therapist or physiotherapist.

Until the plan is updated, follow the safest current method and never carry out a transfer you believe has become unsafe just because the document says so.`,
    },
  },
  'Mental Health First Aid for Carers': {
    'Recognising changes': {
      'Mood and behaviour changes': `You see participants regularly, which makes you well placed to notice the changes that matter: not one bad day, but a pattern shifting over days or weeks.

Watch for withdrawal from people and activities the person usually enjoys, changed sleep or appetite, neglected self-care, irritability or flatness, hopeless talk, and increased alcohol or drug use. In older people especially, low mood often shows up as physical complaints, agitation, or confusion rather than sadness.

Compare against the person's own baseline, not against other people. Mention patterns to the person respectfully, record them factually, and share them with your supervisor: early recognition is the single biggest factor in getting effective help sooner.`,
      'Risk indicators': `Some signs need a faster response than "keep an eye on it". Take seriously: talk of death, dying, being a burden, or having no future; giving away possessions; saying goodbye; sudden calm after a period of deep distress; researching methods; increased impulsivity or substance use; and any statement about self-harm, even if framed as a joke.

Context raises risk further: recent losses, relationship breakdown, previous suicide attempts, chronic pain, and social isolation.

- Any mention of suicide or self-harm is reported the same day, every time
- Do not promise secrecy; explain you must share safety concerns
- Do not rely on your own judgement that "they didn't mean it"
- When immediate danger exists, stay with the person and call 000`,
      'Recording observations': `Mental health observations belong in the record with the same objectivity as physical ones. Describe what you saw and heard; leave the diagnosing to clinicians.

Write "Sam stayed in bed until 2pm, declined breakfast and lunch, said 'there's no point anymore'" rather than "Sam is depressed". Quote significant statements exactly: precise words about hopelessness or self-harm materially change a clinical risk assessment. Note dates, times, frequency, and what support you offered.

Record who you escalated to and when. If distress relates to something in the service, such as a conflict with another worker, record that factually too. These notes create the timeline that lets GPs and mental health teams see the pattern.`,
    },
    'Supportive response': {
      'Listening skills': `When someone is distressed, being genuinely heard is itself a powerful intervention. Your goal is to understand, not to fix, correct, or cheer up.

Give the person your full attention: sit at their level, put your phone away, and tolerate silence, which is where difficult things often get said. Use open questions: "How have things been for you lately?" Reflect back what you hear: "It sounds like the nights are the hardest part."

- Let the person finish; do not fill pauses
- Resist immediately offering advice or solutions
- Avoid "at least..." comparisons and instant reassurance
- Ask what would help rather than assuming
- Stay within your role: listening is support work, therapy is not`,
      'Validation without overpromising': `Validation means acknowledging that the person's feelings are real and understandable, without judging them and without pretending you can fix them. "That sounds exhausting, I can see why you're worn down" lands better than "Don't worry, everything will be fine."

Never promise what you cannot control: that things will get better, that a service will come through, that you will keep a safety concern secret. Broken promises corrode trust exactly when trust matters most. Be honest about your role: "I can't answer that, but I can help you get to someone who can."

Hope is still allowed. Point to real supports and real options: "There are people whose whole job is helping with this, and I can help you reach them."`,
      'De-escalation basics': `When someone is highly agitated, your calm is the intervention. Their nervous system reads your tone, pace, and posture before your words.

Speak slowly, quietly, and simply. Give physical space and stand slightly to the side rather than square-on. Do not argue with delusional or angry statements, and do not issue commands or threats. Acknowledge the feeling: "I can see you're really angry about this." Offer simple choices to return a sense of control: "Would you like to sit here or walk outside?"

- Lower your voice instead of matching theirs
- One person talks; others step back
- Remove the audience where you can
- Know your exit and never let the person block it
- If de-escalation is failing and danger is rising, leave and call for help`,
    },
    'Crisis escalation': {
      'Self harm risk': `If you are worried someone may be suicidal, ask directly: "Are you thinking about suicide?" Asking does not plant the idea; it opens the door to help and shows the topic is speakable.

If they say yes, stay calm and stay with them. Ask whether they have a plan and access to means. Do not agree to secrecy. Remove obvious means where safe to do so. Immediate danger means calling 000 and not leaving the person alone.

For risk that is present but not immediate, contact your supervisor the same day, follow your organisation's mental health escalation procedure, and connect the person with support: their GP, mental health team, or Lifeline on 13 11 14. Suicide Call Back Service 1300 659 467 offers ongoing counselling.`,
      'Emergency pathways': `Know your pathways before a crisis, because searching a policy folder mid-emergency fails everyone.

- Life-threatening emergency, active suicide attempt, or overdose: 000
- Acute mental health crisis: your state or territory mental health line (for example NSW Mental Health Line 1800 011 511, or the equivalent where you work)
- Lifeline 13 11 14 (24/7), text 0477 13 11 14
- Beyond Blue 1300 22 4636
- 13YARN 13 92 76 for Aboriginal and Torres Strait Islander people
- Kids Helpline 1800 55 1800 for participants under 25
- Your on-call supervisor, every time, in parallel

When emergency services attend, give them concise facts: what was said and done, medications involved, relevant diagnoses, and who else is present. Stay until care is formally handed over.`,
      'Post-incident documentation': `After a mental health crisis, documentation protects the participant's continuity of care and creates the record that clinicians, and sometimes investigators, will rely on.

Write it the same day, while details are exact. Record the timeline: what you observed, exact words spoken where significant, actions you took, calls you made with times, who attended, and how the situation resolved. Record the participant's state at the end of your involvement and the handover you gave.

Complete your organisation's incident report as well as the shift note; a crisis is always an incident. Then flag follow-up needs: increased monitoring, a plan review, or a referral. The record is not finished until the follow-up actions are assigned.`,
    },
    'Worker wellbeing': {
      'Debrief options': `Supporting someone through a mental health crisis affects you, and that is a normal human response, not a professional weakness. Debriefing is how you process it rather than carry it.

Operational debrief with your supervisor covers what happened and what happens next; ask for it if it is not offered. Personal debrief is about you: many organisations offer an Employee Assistance Program (EAP) with free confidential counselling. Peer support from experienced colleagues helps, kept de-identified and respectful.

- Debrief soon, ideally within days of a significant incident
- Watch yourself for intrusive thoughts, poor sleep, dread of shifts
- Use the EAP early; it is confidential and does not reach your manager
- If the work is affecting you weeks later, see your GP: support workers deserve support too`,
      'Boundary setting': `Boundaries protect the participant, the professional relationship, and you. In mental health support the pull to be endlessly available is strong, and it is also unsustainable.

Keep your role clear: you provide support during rostered shifts through proper channels. Giving your personal number, responding to messages at midnight, or becoming someone's sole emotional support sets up dependence that fails the person the day you burn out or leave.

A boundary can be held warmly: "I finish at five, but here is the crisis line that answers all night, and I will see you Thursday." Consistency is kindness. If a participant repeatedly pushes past boundaries, that is a support-planning issue to raise with your supervisor, not a private battle to manage alone.`,
      'Self-care planning': `Self-care in care work is not an indulgence; it is equipment maintenance. You cannot pour from an empty cup, and burnout helps no participant.

Build a plan with three layers. Daily: something that reliably resets you, such as exercise, time outdoors, or a real break between shifts. Weekly: genuine recovery time that is not on call and not spent thinking about work. Early warning: know your own signs, such as dreading shifts, snapping at people, sleeping badly, or feeling numb, and decide in advance what you will do when they appear.

Put it in writing and treat it like a roster commitment. The platform's burnout assessment is a good check-in every few months; a worsening score is a signal to act, not to push through.`,
    },
  },
  'Medication Administration & Management': {
    'Role boundaries': {
      'Delegation and policy': `What you may do with medication is defined by your training, your organisation's policy, and the participant's plan, not by confidence or habit. Support workers typically assist with or prompt medications from pre-packaged dose administration aids such as Webster-paks; anything beyond that requires specific delegation and training.

Tasks like injections, insulin, PRN psychotropic decisions, or altering doses sit with nurses and prescribers unless you hold documented, current competency for a named task with a named participant.

- Know exactly which medication tasks you are authorised for
- "Assist" and "administer" are different levels; know which applies
- Delegation is task-specific and person-specific, never general
- If asked to do something outside your authorisation, decline and escalate: "I'm not authorised" is a complete sentence`,
      'Participant consent': `Medication support requires consent like any other support. The person has the right to know what they are taking and why, and the right to refuse.

Ask each time, in plain language: "Ready for your morning tablets?" Watch for consent expressed non-verbally in people who do not use speech. If the person lacks capacity for medication decisions, a formal arrangement such as guardianship must be in place, and even then support is given respectfully, never by force or concealment.

Hiding medication in food without a documented, authorised plan is a covert administration and may constitute a restrictive practice. If you are ever instructed to do it informally, stop and escalate: consent shortcuts are where rights violations start.`,
      'When to seek clinical guidance': `Support workers observe; clinicians decide. Your value is knowing which observations need a clinical decision before you continue.

Seek guidance before giving medication when the person seems unusually drowsy, confused, unwell, or is vomiting; when a new medication has appeared without paperwork; when doses look different from the chart; or when the person has already taken something you were not told about.

- New or worsening symptoms after a medication: contact your supervisor or the prescriber's advice line
- Suspected side effects or allergic reaction: seek advice; call 000 for breathing difficulty, swelling, or collapse
- Missed or double dose: do not guess the correction; call for instructions
- When in doubt, withhold, make the person comfortable, document, and phone: a delayed dose with advice beats a wrong dose without it`,
    },
    'Safe administration checks': {
      'Medication records': `The medication chart or medication administration record (MAR) is the single source of truth. Support is given from the record, never from memory or verbal instruction alone.

Before assisting, check the record is current and legible, and that it matches the packaging in front of you: person's name, medication, dose, route, time, and any special instructions such as "with food". A dose administration aid must be intact, in date, and labelled by the pharmacy for this person.

If the chart and the pack disagree, or a change has been made verbally without paperwork, stop and confirm with your supervisor or the pharmacy before proceeding. Undocumented changes are one of the most common sources of serious medication errors.`,
      'Timing and dose checks': `Right person, right medication, right dose, right route, right time, and right documentation: run the checks the same way every time so they hold under distraction.

Timing matters more for some medications than others: Parkinson's medications, insulin, and antiepileptics have narrow windows, while others tolerate flexibility. Follow the chart's window as your organisation defines it, commonly within an hour either side, and never stockpile or pre-tip doses "to save time".

- Confirm identity even with familiar participants
- Check the blister label matches today's date and time slot
- Do not crush or split tablets without pharmacist instruction on the chart
- Stay with the person until the dose is actually taken
- If a dose is dropped or refused, document it; never re-plate or return it to the pack`,
      'Refusal and changed presentation': `Refusal is a right, not an incident of misconduct. If a person declines medication, do not pressure, trick, or hide the dose. Explore gently: pain, nausea, difficulty swallowing, side effects, or simply wanting a delay are all fixable reasons.

Record every refusal on the chart per policy and notify your supervisor; repeated refusals need a clinical review, because untreated conditions and abrupt cessation both carry risk.

Changed presentation is the other trigger to pause: unusually sedated, agitated, confused, or physically unwell compared with baseline. Giving a routine dose to someone who looks meaningfully different from yesterday is exactly when errors cause harm. Withhold, seek advice, document what you observed and who you contacted.`,
    },
    'Storage and documentation': {
      'Secure storage': `Medication storage protects people from accidental and intentional harm. The rules are simple and they are always in force.

Store medication in the agreed secure location: locked where required, out of reach of children and of participants for whom self-access is unsafe, and separate from other people's medication in shared settings. Follow label instructions on temperature; some medications need refrigeration in a dedicated, labelled container.

- Keep medication in original pharmacy packaging or dose aids
- Never carry loose tablets in pockets or bags
- Return ceased or expired medication to the pharmacy; do not bin or flush it
- In-home services follow the same principles adapted to the participant's home; note storage risks you observe
- Report missing or miscounted medication immediately`,
      'Recording administration': `If it is not recorded, it did not happen. Sign the chart at the time of administration, not at the end of shift from memory: batch-signing is how missed doses become invisible.

Record exactly what occurred, including partial doses, refusals with the code your chart uses, and PRN (as-needed) medications with the reason given and the outcome observed. PRN entries without documented reason and effect are a red flag in any audit and, more importantly, deprive prescribers of the information they need.

Corrections follow policy: a single line through the error, initialled, never correction fluid or scribble. Your signature on a chart states that you checked, assisted, and observed; treat it with that weight.`,
      'Incident and error reporting': `Medication errors happen in every service. What separates safe organisations from dangerous ones is whether errors surface quickly and honestly.

An error includes a wrong dose, wrong time beyond the window, wrong person, missed dose, or a dose given after it was ceased. A near miss is an error caught before it reached the person; report those too, because they map the holes in the system.

- First, the person: check on them and seek clinical advice about the error's significance
- Notify your supervisor immediately; some errors require urgent medical review
- Document factually on the chart and in an incident report
- Never conceal, backfill paperwork, or quietly "fix" an error
- Contribute honestly to the review; the goal is a safer process, not a scapegoat`,
    },
  },
  'Positive Behaviour Support': {
    'Understanding behaviour': {
      'Behaviour as communication': `All behaviour communicates something. When a person's words are limited or the system around them stops listening, behaviour becomes the loudest channel available: pain, fear, boredom, sensory overload, loss of control, and unmet needs all speak through it.

The shift positive behaviour support asks of you is from "How do we stop this behaviour?" to "What is this behaviour telling us, and what need can we meet better?" A person who hits out at shower time may be communicating pain, cold, fear, or a violated preference, not "being difficult".

Labels like attention-seeking close down curiosity. Reframe: connection-seeking is a legitimate human need, and the question is how the person can get connection reliably without distress.`,
      'Antecedents and consequences': `Behaviour rarely comes from nowhere. The ABC lens looks at what happens before (Antecedent), the Behaviour itself, and what happens after (Consequence), because both ends shape whether the behaviour recurs.

Antecedents can be immediate triggers such as noise, a demand, a refusal, or pain, and slower "setting events" such as poor sleep, hunger, illness, or a disrupted routine that lower the person's tolerance for everything else.

Consequences are what the behaviour achieves: escape from a demand, attention, a preferred item, sensory relief. If a behaviour reliably works, it continues; that is learning, not manipulation. Understanding the pattern lets the team meet the need earlier so the behaviour becomes unnecessary.`,
      'Environmental factors': `Environments drive behaviour more than character does. Before locating a problem in the person, audit the world around them.

Sensory load: noise, lighting, heat, crowding, and unpredictable activity exhaust people who process sensation differently. Predictability: unclear expectations and sudden changes produce anxiety that looks like defiance. Autonomy: environments that control every choice generate resistance, because resistance is the only power left. Relationships: a person may behave completely differently with different workers, which is data about approach, not personality.

- Map where and when behaviours occur; look for hotspots
- Note what is different in the settings where the person does well
- Small changes such as warnings before transitions and offering choices often outperform any reactive strategy`,
    },
    'Proactive support': {
      'Choice and control': `Loss of control is one of the most common functions behind behaviours of concern. People whose days are decided for them, from waking time to food to activities, find control wherever it remains: refusal, aggression, absconding.

Building genuine choice into every routine is therefore a frontline behaviour support strategy. Offer real options, honour them reliably, and hand over control wherever safety allows: pace, order of tasks, who assists, what to wear, when to take breaks.

- Offer choices before distress rises, not as a bargaining chip during it
- Keep promises about choices absolutely; broken promises teach that words are noise
- Use the person's communication system for choosing, not just yes or no questions
- Record which choices matter most to the person so the whole team respects them`,
      'Skill building': `Behaviour support that only manages incidents leaves the person stuck. The durable change comes from teaching skills that make the behaviour unnecessary: communication, coping, and daily living skills.

The priority is a functional communication alternative: a fast, easy way to achieve what the behaviour achieves. If screaming brings help, teach and honour a "help" card, sign, or device button, and make it work faster than screaming did. Then coping skills such as requesting breaks, using calming strategies, and tolerating short waits, built up gradually and practised when calm, never introduced mid-crisis.

Celebrate approximations. A person learning to ask for a break will get it wrong plenty of times; the teaching moments are the calm ones, and progress is measured in months.`,
      'Reducing triggers': `Once the pattern behind a behaviour is understood, the cheapest intervention is usually upstream: change the conditions so the trigger arrives less often or lands more softly.

Address setting events first, because pain, poor sleep, hunger, and illness lower everyone's coping. Then engineer the known triggers: give advance warning before transitions, break demands into smaller steps, schedule demanding tasks for the person's best time of day, and reduce sensory load where it overwhelms.

- Use visual schedules and timers to make the day predictable
- Pre-warn changes: "In five minutes we'll finish up"
- Pair demands with preferred activities rather than confrontation
- Never remove all challenge from a life; the aim is a life the person can enjoy and grow in, not an empty one`,
    },
    'Documentation and escalation': {
      'ABC notes': `ABC records turn incidents into usable data. For each significant behaviour, capture Antecedent, Behaviour, and Consequence factually and specifically.

Antecedent: where, when, who was present, what was happening, and any relevant setting events such as poor sleep or missed medication. Behaviour: what the person actually did, described observably: "banged fists on the table for around two minutes" rather than "had a meltdown". Consequence: what happened next, including what staff did and what the person obtained or avoided.

- Record soon after the event; memory reshapes details fast
- Include duration and intensity where you can
- Also log what preceded incidents that almost happened but resolved; near misses show what works
- Consistent ABC data across the team is what lets a practitioner find the function`,
      'Incident reporting': `Behavioural incidents follow your organisation's incident procedure like any other: report promptly, factually, and without blame, including injuries, property damage, and impacts on other participants or the public.

Write the person up respectfully. An incident report is part of their permanent record, and language like "violent outburst for no reason" is inaccurate (there is always a reason) and prejudicial to every worker who reads it later. Describe the event, the response, and the outcome.

Serious incidents involving harm may be reportable to the NDIS Commission; your prompt internal report enables those timeframes. Repeated incidents of the same shape are a signal the current plan is not meeting a need, and should trigger a review rather than resignation.`,
      'Restrictive practice concerns': `A restrictive practice is anything that restricts a person's rights or freedom of movement: physical or mechanical restraint, chemical restraint (medication used to control behaviour), seclusion, and environmental restrictions such as locked fridges or doors.

Under the NDIS rules these may only be used when authorised in a behaviour support plan, as a last resort, in the least restrictive form, for the shortest time, and they must be reported each time they are used. An unauthorised restrictive practice, however well-intentioned, is a reportable incident.

- Know which practices, if any, are authorised for the people you support
- Follow the plan exactly; improvised restraint is never acceptable
- Report every use through your organisation's process
- If you see informal restrictions creeping in, locked doors, withheld items, "calming" medication on request, raise it: rights erode quietly`,
    },
  },
  'Aged Care Quality Standards Masterclass': {
    'Standards 1 to 3 in practice': {
      'Consumer dignity and choice': `Standard 1 puts the older person's identity, culture, and autonomy at the centre. In practice it means the consumer is treated as the expert on their own life: care is delivered the way they want, information is provided so they can decide, and dignity of risk is respected, meaning people may make choices others consider risky.

For daily work this looks like asking rather than assuming, honouring preferences recorded in the care plan, supporting cultural and spiritual practices, protecting privacy during personal care, and never talking over or about a person in their presence.

Evidence assessors look for: preference documentation that is current and specific, consent records, and consumers who say, when asked, that they feel known and respected. The strongest evidence is the consumer's own account.`,
      'Ongoing assessment': `Standard 2 requires assessment and planning to be a living partnership with the consumer, not an admission-day form. Plans must reflect current needs, goals, and preferences, involve the consumer and others they choose, and be reviewed regularly and whenever circumstances change.

The practical discipline is triggered review: a fall, hospital return, new diagnosis, weight change, cognitive shift, or a family's raised concern each demand the plan be revisited, not just the incident closed.

- Involve the consumer in every review; record their voice, not just clinical input
- Set review dates and honour them
- Make plans usable: a document no worker reads protects nobody
- Check plans match reality: assessors compare what is written with what workers actually do and what consumers say happens`,
      'Safe and effective care': `Standard 3 covers personal and clinical care: it must be best practice, tailored to the person, and delivered safely. High-risk areas get particular scrutiny: falls, pressure injuries, swallowing and choking, medication management, restrictive practices, infection control, and recognising deterioration.

The core loop is the same everywhere: assess risk, plan controls, deliver consistently, watch for change, escalate early, and document each step. Deterioration recognised a day earlier is routinely the difference between a GP visit and a hospital admission.

Minimising restrictive practices is explicit in this standard: restraint only as last resort, authorised, monitored, and reported through the Serious Incident Response Scheme (SIRS) where required. Every worker should know what SIRS is and what must be reported.`,
    },
    'Services, feedback, and workforce': {
      'Service environment': `Standards 4 and 5 cover services supporting daily living and the physical service environment. Daily living services, meals, cleaning, social activities, transport, must actually promote wellbeing and independence, not just occur. Food is assessed seriously: nutrition, variety, dignity of dining, and consumer input into menus.

The environment must be safe, clean, comfortable, and enable independence: people can move freely, find their way, access outdoor space, and feel at home rather than institutionalised. Equipment must be safe, clean, and maintained.

- Walk the environment as a consumer would: signage, lighting, trip hazards, noise
- Treat meal feedback as quality data, not complaints
- Maintenance logs and cleaning schedules are audit evidence; keep them real and current`,
      'Feedback systems': `Standard 6 requires that consumers can easily raise feedback and complaints, that they are encouraged to do so, and that complaints drive improvement. Fear of retribution is the biggest barrier in aged care, so the culture around complaints matters more than the form.

Every worker is part of the system: a mealtime grumble, a family's worried aside, a consumer who goes quiet are all feedback. Capture it, pass it on, and make sure something happens. Open disclosure applies when things go wrong: acknowledge, apologise, explain, and involve the consumer in the resolution.

- Log verbal feedback, not only written complaints
- Close the loop: tell the person what changed because they spoke up
- Track themes across complaints; repeated small issues reveal systemic ones
- Advertise the Aged Care Quality and Safety Commission's complaint pathway; hiding it fails the standard`,
      'Workforce responsibilities': `Standard 7 requires a workforce that is sufficient, skilled, and supported. The number and mix of staff must let care actually be delivered as planned, and every worker must be competent, screened, and behaving in line with the Code of Conduct for Aged Care.

For workers this means keeping mandatory training current, working within your competence, and raising it when rosters or workloads make safe care impossible: understaffing that goes unreported becomes accepted. For organisations it means real induction, supervision, performance feedback, and development, not tick-box compliance.

Evidence includes training matrices, screening records, supervision notes, and, tellingly, whether workers can describe the standards in their own words when an assessor asks. If you can explain why you do something, not just what you do, the system is working.`,
    },
    'Governance and improvement': {
      'Governance evidence': `Standard 8 makes the governing body accountable for the quality and safety of care: accountability cannot be delegated to the quality team. Assessors look for evidence that leadership knows what is happening in the service and acts on it.

The core artefacts are a risk management system that identifies and treats risks to consumers, incident management with SIRS compliance, complaints data reaching board level, clinical governance arrangements, and financial and workforce governance that keep care sustainable.

- Board and management minutes should show quality and safety on the agenda with decisions, not just noting
- Incident and complaint trends need visible responses
- Delegations, policies, and review dates must be current
- Ask the killer question of any document: could we show how this changed what happens to consumers?`,
      'Continuous improvement': `Continuous improvement is the engine of the standards: services are expected to know their weaknesses and be visibly working on them. A Plan for Continuous Improvement (PCI) is the standard vehicle, but the substance is the loop: identify, plan, act, check.

Inputs come from everywhere: complaints, incidents, audits, clinical indicators, consumer and staff feedback, and benchmarking. Each improvement needs an owner, a due date, and, critically, a follow-up check that the change worked and stuck.

- Improvements should trace back to real data, not invented for the plan
- Small, completed improvements beat grand, stalled ones
- Involve consumers in prioritising; their view of what matters differs from management's more often than expected
- Keep evidence of the "check" step; that is what most services are missing`,
      'Audit readiness': `Audit readiness is not a cleanup sprint before an assessment contact; it is the ordinary state of a service doing the work. Assessors interview consumers, families, and workers, observe care, and sample documents, so the only durable strategy is that daily practice matches documented policy.

Prepare by self-assessing honestly against each standard, keeping evidence organised and current, and briefing staff on what assessors may ask: workers should answer from their real practice, not a script.

- Run internal audits with fresh eyes; invite someone external periodically
- Fix the gap between what policies say and what shifts actually do, in whichever direction is right
- Keep consumer files audit-ready: current plans, signed consents, review trails
- Treat every assessor finding, and every self-identified gap, as PCI input; the standards reward services that find their own problems first`,
    },
  },
}

// Match titles loosely: the live rows were seeded from an earlier catalogue
// revision with slightly different punctuation ("De escalation" vs
// "De-escalation", "Services feedback and workforce" vs the comma version).
function normalizeTitle(title) {
  return String(title).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function normalizeMap(map) {
  return Object.fromEntries(Object.entries(map).map(([key, value]) => [normalizeTitle(key), value]))
}

const normalizedCourseLessons = Object.fromEntries(
  Object.entries(courseLessons).map(([courseTitle, modules]) => [
    normalizeTitle(courseTitle),
    Object.fromEntries(
      Object.entries(modules).map(([moduleTitle, lessons]) => [normalizeTitle(moduleTitle), normalizeMap(lessons)])
    ),
  ])
)

function upgradeLessons(courseTitle, moduleTitle, lessons) {
  const moduleMap = normalizedCourseLessons[normalizeTitle(courseTitle)]?.[normalizeTitle(moduleTitle)]
  if (!Array.isArray(lessons)) return { lessons, updated: 0, missing: 0 }

  let updated = 0
  let missing = 0

  const next = lessons.map((lesson) => {
    const title = typeof lesson === 'string' ? lesson : lesson?.title
    if (!title) return lesson
    const content = moduleMap?.[normalizeTitle(title)]
    if (content) {
      updated += 1
      return { title, content }
    }
    missing += 1
    console.warn(`   ⚠️  no content authored for: ${courseTitle} › ${moduleTitle} › ${title}`)
    return typeof lesson === 'string' ? { title } : lesson
  })

  return { lessons: next, updated, missing }
}

async function seedCourseLessons() {
  console.log('📚 Attaching lesson content to courses...')

  const titles = Object.keys(courseLessons)
  const { data: courses, error } = await supabase
    .from('courses')
    .select('id, title, content')
    .in('title', titles)

  if (error) {
    console.error('❌ Error fetching courses:', error.message)
    process.exit(1)
  }

  const foundTitles = new Set(courses.map((c) => c.title))
  for (const title of titles) {
    if (!foundTitles.has(title)) console.warn(`⚠️  Course not found in DB: ${title}`)
  }

  let coursesUpdated = 0

  for (const course of courses) {
    const content = course.content
    if (!content || typeof content !== 'object' || !Array.isArray(content.modules)) {
      console.warn(`⚠️  Skipping ${course.title}: unexpected content shape`)
      continue
    }

    let courseUpdated = 0
    let courseMissing = 0

    const modules = content.modules.map((mod) => {
      const { lessons, updated, missing } = upgradeLessons(course.title, mod?.title, mod?.lessons)
      courseUpdated += updated
      courseMissing += missing
      return { ...mod, lessons }
    })

    if (courseUpdated === 0) {
      console.log(`•  ${course.title}: nothing to update (${courseMissing} lessons unmatched)`)
      continue
    }

    const { error: updateError } = await supabase
      .from('courses')
      .update({ content: { ...content, modules } })
      .eq('id', course.id)

    if (updateError) {
      console.error(`❌ Failed to update ${course.title}:`, updateError.message)
      process.exit(1)
    }

    coursesUpdated += 1
    console.log(`✅ ${course.title}: ${courseUpdated} lessons updated${courseMissing ? `, ${courseMissing} unmatched` : ''}`)
  }

  console.log(`\nDone. ${coursesUpdated} course(s) updated.`)
}

seedCourseLessons()
