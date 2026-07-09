-- Scribe & Thrive Australia - reviewed starter catalogue content
-- Safe to run more than once: rows are inserted only when a title is absent.

WITH seed(title, description, duration_hours, level, category, access_tier, certificate_enabled, content) AS (
  VALUES
    (
      'NDIS Fundamentals for Support Workers',
      'Essential knowledge for anyone working in the NDIS sector. Covers NDIS principles, participant rights, quality and safeguarding, and your role as a support worker.',
      4,
      'beginner',
      'NDIS',
      'free',
      true,
      jsonb_build_object(
        'overview', 'Build the practical baseline every support worker needs before working under the NDIS. This course focuses on participant rights, worker responsibilities, safeguarding, and clear documentation.',
        'learningOutcomes', jsonb_build_array(
          'Explain the purpose of the NDIS and participant choice and control.',
          'Identify core support worker responsibilities under the NDIS Code of Conduct.',
          'Recognise common safeguarding risks and escalation pathways.',
          'Create accurate, objective notes that support continuity of care.'
        ),
        'modules', jsonb_build_array(
          jsonb_build_object('title', 'NDIS foundations', 'duration', '45 min', 'summary', 'How the NDIS works and how support workers contribute to participant outcomes.', 'lessons', jsonb_build_array('Participant choice and control', 'Reasonable and necessary supports', 'Roles in the support ecosystem')),
          jsonb_build_object('title', 'Rights, dignity, and consent', 'duration', '55 min', 'summary', 'Practical ways to uphold rights while delivering everyday supports.', 'lessons', jsonb_build_array('Consent and supported decision making', 'Privacy and confidentiality', 'Cultural safety and respect')),
          jsonb_build_object('title', 'Safeguarding and incidents', 'duration', '65 min', 'summary', 'Recognising risks, responding early, and reporting clearly.', 'lessons', jsonb_build_array('What counts as an incident', 'Immediate response steps', 'Escalation and notification basics')),
          jsonb_build_object('title', 'Documentation basics', 'duration', '50 min', 'summary', 'Writing factual, person-centred notes that are useful to the team.', 'lessons', jsonb_build_array('Objective language', 'Shift note structure', 'Handover essentials'))
        ),
        'practicalActivities', jsonb_build_array(
          'Rewrite a subjective shift note into objective, person-centred language.',
          'Map three safeguarding concerns to the correct escalation action.'
        ),
        'assessment', 'Complete a short knowledge check and a documentation scenario.',
        'certificate', 'Certificate of completion available when assessment requirements are met.'
      )
    ),
    (
      'Safe Manual Handling in Care Settings',
      'Practical training on safe manual handling techniques to prevent injury when assisting with mobility, transfers, and repositioning in home and residential care settings.',
      2,
      'beginner',
      'Health & Safety',
      'free',
      true,
      jsonb_build_object(
        'overview', 'A practical introduction to manual handling risk management for support work, home care, and residential care environments.',
        'learningOutcomes', jsonb_build_array(
          'Identify manual handling hazards before a task starts.',
          'Apply basic body mechanics and positioning principles.',
          'Use equipment and team support within role limits.',
          'Document and escalate manual handling risks.'
        ),
        'modules', jsonb_build_array(
          jsonb_build_object('title', 'Risk before technique', 'duration', '30 min', 'summary', 'Assess the person, task, environment, and equipment before moving.', 'lessons', jsonb_build_array('Hazard spotting', 'When to stop', 'Dynamic risk assessment')),
          jsonb_build_object('title', 'Safer movement principles', 'duration', '40 min', 'summary', 'Reduce strain through planning, communication, and positioning.', 'lessons', jsonb_build_array('Base of support', 'Avoiding twisting', 'Prompting and communication')),
          jsonb_build_object('title', 'Equipment and escalation', 'duration', '35 min', 'summary', 'Know when aids, extra staff, or clinical review are required.', 'lessons', jsonb_build_array('Common mobility aids', 'Equipment checks', 'Reporting changed needs'))
        ),
        'practicalActivities', jsonb_build_array(
          'Complete a task risk scan for a chair-to-stand support.',
          'Write a short escalation note for a changed mobility need.'
        ),
        'assessment', 'Scenario-based manual handling risk questions.',
        'certificate', 'Certificate of completion available when assessment requirements are met.'
      )
    ),
    (
      'Mental Health First Aid for Carers',
      'Learn how to recognise and respond to mental health crises, support participants with mental health conditions, and maintain your own mental wellbeing.',
      6,
      'intermediate',
      'Mental Health',
      'starter',
      true,
      jsonb_build_object(
        'overview', 'Strengthen confidence in recognising mental health concerns, responding calmly, and connecting people with the right supports.',
        'learningOutcomes', jsonb_build_array(
          'Recognise warning signs that require prompt support.',
          'Use safe, respectful language during distress.',
          'Escalate crisis risks through appropriate channels.',
          'Maintain worker boundaries and self-care after incidents.'
        ),
        'modules', jsonb_build_array(
          jsonb_build_object('title', 'Recognising changes', 'duration', '60 min', 'summary', 'Common signs of deterioration, distress, and crisis.', 'lessons', jsonb_build_array('Mood and behaviour changes', 'Risk indicators', 'Recording observations')),
          jsonb_build_object('title', 'Supportive response', 'duration', '75 min', 'summary', 'Respond with calm, respectful, person-centred communication.', 'lessons', jsonb_build_array('Listening skills', 'Validation without overpromising', 'De-escalation basics')),
          jsonb_build_object('title', 'Crisis escalation', 'duration', '60 min', 'summary', 'Know when and how to escalate urgent concerns.', 'lessons', jsonb_build_array('Suicide and self-harm risk', 'Emergency pathways', 'Post-incident documentation')),
          jsonb_build_object('title', 'Worker wellbeing', 'duration', '45 min', 'summary', 'Debrief, boundaries, and recovery after difficult shifts.', 'lessons', jsonb_build_array('Debrief options', 'Boundary setting', 'Self-care planning'))
        ),
        'practicalActivities', jsonb_build_array(
          'Draft a factual observation note after a mental health concern.',
          'Build a personal post-incident debrief plan.'
        ),
        'assessment', 'Knowledge check plus one written response scenario.',
        'certificate', 'Certificate of completion available when assessment requirements are met.'
      )
    ),
    (
      'Medication Administration & Management',
      'Comprehensive training on safe medication administration for care workers. Covers medication types, administration routes, documentation, and error management.',
      3,
      'intermediate',
      'Clinical',
      'starter',
      true,
      jsonb_build_object(
        'overview', 'A role-aware course for support workers who assist with medication under employer procedures and participant plans.',
        'learningOutcomes', jsonb_build_array(
          'Describe the rights and checks used in safe medication support.',
          'Identify storage, timing, and documentation requirements.',
          'Respond appropriately to missed doses or medication errors.',
          'Work within role boundaries and local procedures.'
        ),
        'modules', jsonb_build_array(
          jsonb_build_object('title', 'Role boundaries', 'duration', '35 min', 'summary', 'What support workers can and cannot do with medication support.', 'lessons', jsonb_build_array('Delegation and policy', 'Participant consent', 'When to seek clinical guidance')),
          jsonb_build_object('title', 'Safe administration checks', 'duration', '55 min', 'summary', 'Practical checks before, during, and after medication support.', 'lessons', jsonb_build_array('Medication records', 'Timing and dose checks', 'Refusal and changed presentation')),
          jsonb_build_object('title', 'Storage and documentation', 'duration', '45 min', 'summary', 'Storage, recording, and reporting expectations.', 'lessons', jsonb_build_array('Secure storage', 'Recording administration', 'Incident and error reporting'))
        ),
        'practicalActivities', jsonb_build_array(
          'Review a sample medication support record for missing information.',
          'Write an escalation note for a refused medication scenario.'
        ),
        'assessment', 'Medication safety scenario check.',
        'certificate', 'Certificate of completion available when assessment requirements are met.'
      )
    ),
    (
      'Positive Behaviour Support',
      'Learn evidence-based approaches to understanding and supporting people with challenging behaviour. Covers the NDIS Behaviour Support Rules and positive strategies.',
      5,
      'intermediate',
      'NDIS',
      'professional',
      true,
      jsonb_build_object(
        'overview', 'Understand behaviour as communication and apply proactive, rights-focused support strategies aligned with positive behaviour support principles.',
        'learningOutcomes', jsonb_build_array(
          'Describe behaviour as communication and identify possible functions.',
          'Use proactive strategies that reduce distress and restriction.',
          'Record behaviour observations clearly and respectfully.',
          'Understand restrictive practice escalation and reporting basics.'
        ),
        'modules', jsonb_build_array(
          jsonb_build_object('title', 'Understanding behaviour', 'duration', '60 min', 'summary', 'Look beyond the behaviour to unmet needs, triggers, and context.', 'lessons', jsonb_build_array('Behaviour as communication', 'Antecedents and consequences', 'Environmental factors')),
          jsonb_build_object('title', 'Proactive support', 'duration', '70 min', 'summary', 'Plan supports that build safety, predictability, and skills.', 'lessons', jsonb_build_array('Choice and control', 'Skill building', 'Reducing triggers')),
          jsonb_build_object('title', 'Documentation and escalation', 'duration', '60 min', 'summary', 'Record behaviour support information without blame or stigma.', 'lessons', jsonb_build_array('ABC notes', 'Incident reporting', 'Restrictive practice concerns'))
        ),
        'practicalActivities', jsonb_build_array(
          'Complete an ABC observation from a short scenario.',
          'Convert a reactive response into a proactive support strategy.'
        ),
        'assessment', 'Written scenario and knowledge check.',
        'certificate', 'Certificate of completion available when assessment requirements are met.'
      )
    ),
    (
      'Aged Care Quality Standards Masterclass',
      'Deep-dive training on all 8 Aged Care Quality Standards. Includes compliance assessment, evidence requirements, and continuous improvement strategies.',
      8,
      'advanced',
      'Aged Care',
      'professional',
      true,
      jsonb_build_object(
        'overview', 'A practical guide to applying the Aged Care Quality Standards in daily care, documentation, governance, and continuous improvement.',
        'learningOutcomes', jsonb_build_array(
          'Explain the intent of each Quality Standard in daily practice.',
          'Identify evidence that demonstrates safe, person-centred care.',
          'Link incidents, feedback, and audits to continuous improvement.',
          'Prepare clear documentation for quality review activities.'
        ),
        'modules', jsonb_build_array(
          jsonb_build_object('title', 'Standards 1 to 3 in practice', 'duration', '90 min', 'summary', 'Consumer dignity, assessment, planning, and safe personal care.', 'lessons', jsonb_build_array('Consumer dignity and choice', 'Ongoing assessment', 'Safe and effective care')),
          jsonb_build_object('title', 'Services, feedback, and workforce', 'duration', '95 min', 'summary', 'Daily services, complaints, workforce capability, and organisational culture.', 'lessons', jsonb_build_array('Service environment', 'Feedback systems', 'Workforce responsibilities')),
          jsonb_build_object('title', 'Governance and improvement', 'duration', '80 min', 'summary', 'Clinical governance, evidence, and improvement cycles.', 'lessons', jsonb_build_array('Governance evidence', 'Continuous improvement', 'Audit readiness'))
        ),
        'practicalActivities', jsonb_build_array(
          'Map a care documentation sample to relevant Quality Standards.',
          'Draft a continuous improvement action from a complaint scenario.'
        ),
        'assessment', 'Quality Standards scenario workbook and knowledge check.',
        'certificate', 'Certificate of completion available when assessment requirements are met.'
      )
    )
)
INSERT INTO public.courses (
  title,
  description,
  duration_hours,
  level,
  category,
  access_tier,
  certificate_enabled,
  content,
  is_published
)
SELECT
  seed.title,
  seed.description,
  seed.duration_hours,
  seed.level,
  seed.category,
  seed.access_tier,
  seed.certificate_enabled,
  seed.content,
  true
FROM seed
WHERE NOT EXISTS (
  SELECT 1
  FROM public.courses existing
  WHERE existing.title = seed.title
);

WITH seed(title, description, category, tags, access_tier, content) AS (
  VALUES
    (
      'NDIS Support Worker Induction Pack',
      'Complete onboarding package for new NDIS support workers. Includes role overview, participant rights, code of conduct, and key contacts.',
      'NDIS',
      ARRAY['induction', 'support worker', 'onboarding'],
      'free',
      $$NDIS SUPPORT WORKER INDUCTION PACK

Purpose
Use this pack to orient new support workers to person-centred, rights-based NDIS support.

Core induction checklist
1. Confirm worker role, roster expectations, and emergency contacts.
2. Review participant rights, consent, privacy, and confidentiality.
3. Review the NDIS Code of Conduct and reportable incident expectations.
4. Confirm medication, manual handling, transport, and behaviour support boundaries.
5. Explain documentation requirements for shift notes, handovers, and incident reports.

First shift focus
- Read the participant support plan before providing support.
- Ask before assisting and explain each support step.
- Record objective observations and escalate changed needs early.
- Seek supervisor guidance when a task falls outside your training or delegation.

Supervisor sign-off
Record the induction date, worker name, supervisor name, and any follow-up training required.$$ 
    ),
    (
      'Incident Report Template (NDIS)',
      'NDIS-compliant incident report template with guidance notes. Covers all required fields and aligns with NDIS Commission reporting requirements.',
      'NDIS',
      ARRAY['incident', 'template', 'reporting'],
      'free',
      $$INCIDENT REPORT TEMPLATE (NDIS)

Incident details
- Date and time:
- Location:
- Participant:
- Staff involved:
- Witnesses:
- Incident type:

What happened
Write a factual sequence of events. Include what was seen, heard, or reported. Avoid blame, assumptions, or emotional labels.

Immediate response
- Support provided to the participant:
- First aid or emergency services:
- Family, guardian, nominee, or coordinator contacted:
- Supervisor notified:

Risk and follow-up
- Current risk level:
- Actions to prevent recurrence:
- Referrals or reviews required:
- Reportable incident notification required: Yes / No / Unsure

Review
Manager review date, outcome, and any improvement actions.$$ 
    ),
    (
      'Medication Management Policy Template',
      'Comprehensive medication management policy for care organisations. Includes risk assessment, administration protocols, and error reporting procedures.',
      'Templates',
      ARRAY['medication', 'policy', 'clinical'],
      'starter',
      $$MEDICATION MANAGEMENT POLICY TEMPLATE

Policy intent
Medication support must be safe, documented, consent-based, and delivered within worker training and delegation.

Minimum procedure
1. Confirm current medication authority or medication chart.
2. Check participant identity, medication, dose, route, time, and expiry.
3. Support the participant according to their plan and organisational policy.
4. Record the support immediately after completion.
5. Escalate refusal, missed doses, side effects, or discrepancies.

Storage expectations
Medication must be stored securely, separately where required, and according to label instructions.

Errors and incidents
Any medication error or near miss must be reported immediately to a supervisor and documented through the incident process.$$ 
    ),
    (
      'NDIS Participant Rights Handbook',
      'Plain English guide to NDIS participant rights, NDIS Act obligations, and how to support participants to understand and exercise their rights.',
      'NDIS',
      ARRAY['rights', 'participant', 'guide'],
      'free',
      $$NDIS PARTICIPANT RIGHTS HANDBOOK

Participant rights in practice
Participants have the right to dignity, respect, privacy, choice, control, and freedom from abuse, neglect, and exploitation.

Support worker responsibilities
- Explain choices in a way the participant can understand.
- Ask for consent before providing support.
- Respect cultural, communication, and personal preferences.
- Protect private information.
- Report concerns about safety or rights restrictions.

Supported decision making
Support the person to understand options, consequences, and preferences. Do not replace their decision unless a legal authority applies.

When to escalate
Escalate any concern involving abuse, neglect, unexplained injury, coercion, restrictive practice, or loss of choice and control.$$ 
    ),
    (
      'Aged Care Quality Standards Checklist',
      'Comprehensive self-assessment checklist against all 8 Aged Care Quality Standards. Includes evidence requirements and improvement planning prompts.',
      'Aged Care',
      ARRAY['aged care', 'quality standards', 'checklist'],
      'starter',
      $$AGED CARE QUALITY STANDARDS CHECKLIST

How to use
Review each standard and record evidence, gaps, risk rating, and improvement actions.

Evidence prompts
1. Consumer dignity and choice - care preferences, consent records, feedback.
2. Ongoing assessment and planning - current plans, review notes, goal progress.
3. Personal care and clinical care - risk assessments, incident follow-up, clinical oversight.
4. Services and supports for daily living - activity records, nutrition, social connection.
5. Organisation's service environment - safety checks, maintenance, accessibility.
6. Feedback and complaints - complaint logs, responses, improvement actions.
7. Human resources - training records, supervision, competency checks.
8. Organisational governance - audits, risk registers, continuous improvement.

Action planning
Each gap should have an owner, due date, risk rating, and review date.$$ 
    ),
    (
      'Manual Handling Risk Assessment Tool',
      'Systematic risk assessment framework for manual handling tasks in care settings. Includes risk rating prompts and control measures.',
      'Templates',
      ARRAY['manual handling', 'risk assessment', 'safety'],
      'free',
      $$MANUAL HANDLING RISK ASSESSMENT TOOL

Task description
Describe the movement, transfer, repositioning, or support task.

Risk scan
- Person: pain, fatigue, mobility, cognition, cooperation, changed condition.
- Task: force, repetition, awkward posture, duration, urgency.
- Environment: floor surfaces, space, lighting, clutter, pets, weather.
- Equipment: availability, fit, maintenance, worker competence.

Controls
1. Stop or delay unsafe tasks.
2. Use equipment according to training and manufacturer instructions.
3. Seek a second worker or clinical review when required.
4. Update the support plan if needs change.

Documentation
Record hazards, controls used, residual risk, and escalation actions.$$ 
    ),
    (
      'Behaviour Support Plan Template',
      'Comprehensive positive behaviour support plan template aligned with NDIS Behaviour Support Rules. Includes functional behaviour assessment prompts.',
      'NDIS',
      ARRAY['behaviour support', 'PBS', 'template'],
      'professional',
      $$BEHAVIOUR SUPPORT PLAN TEMPLATE

Participant profile
Strengths, communication preferences, sensory needs, health factors, and important relationships.

Behaviour summary
Describe the behaviour factually. Include frequency, duration, intensity, setting events, and known triggers.

Function and unmet need
Record the likely purpose of the behaviour, such as communication, escape, access, pain, sensory need, or emotional regulation.

Proactive strategies
- Environmental changes.
- Communication supports.
- Predictable routines.
- Skill building.
- Positive reinforcement.

Response plan
Use least restrictive, trauma-informed responses. Include escalation steps and post-incident support.

Review
Track outcomes, incidents, restrictive practice concerns, and plan review dates.$$ 
    ),
    (
      'Care Plan Review Framework',
      'Structured framework for regular care plan reviews. Includes participant goals review, progress assessment, and plan update process.',
      'Templates',
      ARRAY['care plan', 'review', 'goals'],
      'starter',
      $$CARE PLAN REVIEW FRAMEWORK

Review purpose
Confirm the care plan remains current, person-centred, safe, and aligned with participant goals.

Before the review
- Gather shift notes, incident reports, health updates, and feedback.
- Ask the participant how supports are working.
- Confirm changes in goals, risks, routines, or preferences.

Review agenda
1. What is working well.
2. Goals and progress.
3. Risks and safeguards.
4. Changes in support needs.
5. Actions, owners, and due dates.

Update rules
Only keep instructions that are current, clear, and practical for the support team.$$ 
    ),
    (
      'Restrictive Practices Decision-Making Guide',
      'Comprehensive guide to restrictive practices under the NDIS, including authorisation processes, least restrictive alternatives, and monitoring requirements.',
      'NDIS',
      ARRAY['restrictive practices', 'rights', 'behaviour support'],
      'professional',
      $$RESTRICTIVE PRACTICES DECISION-MAKING GUIDE

Core principle
Restrictive practices must never be used for convenience, punishment, or staff preference. They require appropriate authorisation, documentation, and review.

Decision prompts
1. Is there an immediate risk of harm?
2. What less restrictive alternatives have been tried?
3. Is the response included in an authorised behaviour support plan?
4. Who must be notified?
5. What monitoring and review is required?

Worker action
Follow the approved plan, preserve dignity, document objectively, and escalate any unplanned or unauthorised restriction immediately.$$ 
    ),
    (
      'Carer Self-Care Action Plan Workbook',
      'Personal development workbook for care workers to create their own wellbeing and self-care plan. Evidence-based strategies for preventing burnout.',
      'Guides',
      ARRAY['self-care', 'burnout', 'wellbeing'],
      'free',
      $$CARER SELF-CARE ACTION PLAN WORKBOOK

Purpose
Use this workbook to identify pressure points, early warning signs, and realistic recovery actions.

Reflection
- What parts of care work give me energy?
- What tasks or situations drain me most?
- What warning signs tell me I need support?
- Who can I contact for practical or emotional support?

Action plan
1. One daily reset action.
2. One weekly recovery activity.
3. One boundary I will protect.
4. One person or service I will contact early.

Escalation
If you feel unsafe, overwhelmed, or at risk of harm, contact emergency services or a crisis support service immediately.$$ 
    ),
    (
      'Home Care Package Policy Manual',
      'Complete policy manual template for home care package providers. Covers regulatory requirements, service agreements, and consumer directed care.',
      'Aged Care',
      ARRAY['home care', 'policy', 'aged care'],
      'professional',
      $$HOME CARE PACKAGE POLICY MANUAL

Policy areas
- Consumer directed care.
- Assessment and care planning.
- Service agreements and budgets.
- Risk management and incident response.
- Complaints and feedback.
- Workforce screening, training, and supervision.
- Privacy and information handling.

Implementation notes
Each policy should identify the responsible role, procedure steps, records required, review cycle, and related legislation or standards.

Review cycle
Review annually or earlier after serious incidents, regulatory change, audit findings, or material service changes.$$ 
    ),
    (
      'Supported Decision Making Toolkit',
      'Practical toolkit for implementing supported decision making for NDIS participants. Includes conversation guides, documentation templates, and training activities.',
      'NDIS',
      ARRAY['decision making', 'communication', 'rights'],
      'starter',
      $$SUPPORTED DECISION MAKING TOOLKIT

Principles
Assume capacity, provide information in accessible ways, respect preferences, and record the participant's will and preferences.

Conversation guide
1. What decision needs to be made?
2. What options are available?
3. What matters most to the participant?
4. Who does the participant want involved?
5. What support is needed to understand the options?

Documentation prompt
Record the participant's expressed preference, supports used, people involved, risks discussed, and final decision.

Practice activity
Convert a complex service choice into three plain-English options with pros, cons, and support needs.$$ 
    )
)
INSERT INTO public.resources (
  title,
  description,
  category,
  tags,
  access_tier,
  content,
  download_count,
  is_published
)
SELECT
  seed.title,
  seed.description,
  seed.category,
  seed.tags,
  seed.access_tier,
  seed.content,
  0,
  true
FROM seed
WHERE NOT EXISTS (
  SELECT 1
  FROM public.resources existing
  WHERE existing.title = seed.title
);
