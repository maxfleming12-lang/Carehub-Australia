#!/usr/bin/env node

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

const sampleResources = [
  {
    title: 'NDIS Support Coordination Guide',
    description: 'Comprehensive guide for implementing support coordination within NDIS framework. Covers best practices, compliance requirements, and participant engagement strategies.',
    content: `# NDIS Support Coordination Guide

## Overview
Support coordination is a key component of the NDIS. This guide provides practical guidance for support coordinators and care organisations.

## Key Responsibilities
1. Understanding participant goals and aspirations
2. Facilitating connections with services and supports
3. Monitoring and reviewing participant progress
4. Advocating for participant rights and interests

## Compliance Requirements
- Regular participant contact (minimum monthly)
- Documentation of all interactions
- Annual review meetings
- Incident reporting procedures

## Best Practices
- Build strong relationships with participants
- Maintain detailed records
- Regular training and professional development
- Peer collaboration and support networks

## Resources
For more information, visit the NDIA website at www.ndia.gov.au`,
    file_url: null,
    category: 'NDIS',
    tags: ['NDIS', 'support', 'coordination', 'compliance'],
    access_tier: 'free',
    is_published: true,
  },
  {
    title: 'Aged Care Quality Standards Checklist',
    description: 'Compliance checklist aligned with Australian Aged Care Quality Standards. Includes all 8 standards and supporting assessment criteria.',
    content: null,
    file_url: 'https://example.com/aged-care-checklist.pdf',
    category: 'Aged Care',
    tags: ['aged care', 'compliance', 'quality', 'standards'],
    access_tier: 'starter',
    is_published: true,
  },
  {
    title: 'Care Plan Template - NDIS',
    description: 'Ready-to-use template for developing comprehensive care plans for NDIS participants. Includes all required sections and planning considerations.',
    content: null,
    file_url: 'https://example.com/care-plan-template.docx',
    category: 'Templates',
    tags: ['template', 'NDIS', 'care-plan', 'planning'],
    access_tier: 'professional',
    is_published: true,
  },
  {
    title: 'Manual Handling and Mobility Guide',
    description: 'Safe manual handling procedures and mobility assistance techniques for care workers. Includes risk assessment and injury prevention strategies.',
    content: `# Manual Handling and Mobility Guide

## Introduction
Manual handling injuries are a significant risk in care work. This guide provides evidence-based practices for safe handling.

## Risk Assessment
- Assess every task
- Identify hazards
- Use appropriate equipment
- Implement control measures

## Key Techniques
1. Proper body positioning
2. Use of mechanical aids
3. Two-person assists
4. Participant communication

## Training Requirements
All care workers must complete formal manual handling training annually.

## Emergency Procedures
In case of injury, report immediately and seek medical evaluation.`,
    file_url: null,
    category: 'Guides',
    tags: ['safety', 'manual handling', 'training', 'procedures'],
    access_tier: 'free',
    is_published: true,
  },
  {
    title: 'Safeguarding Vulnerable Adults Framework',
    description: 'Framework for identifying and responding to safeguarding concerns. Covers adult protection, reporting procedures, and support resources.',
    content: `# Safeguarding Vulnerable Adults Framework

## Purpose
Protect vulnerable adults from abuse, neglect, and exploitation in care settings.

## Types of Abuse
- Physical abuse
- Emotional/psychological abuse
- Sexual abuse
- Financial abuse
- Neglect
- Institutional abuse

## Reporting Procedures
1. Identify concern
2. Speak with participant (if safe)
3. Document details
4. Report to supervisor/safeguarding officer
5. Follow mandatory reporting requirements

## Prevention Strategies
- Thorough staff vetting
- Regular training
- Clear policies and procedures
- Open communication culture
- Regular supervision

## Support Resources
Employee assistance programs and counseling services available for all staff.`,
    file_url: null,
    category: 'Guides',
    tags: ['safeguarding', 'protection', 'procedures', 'compliance'],
    access_tier: 'professional',
    is_published: true,
  },
  {
    title: 'Privacy and Confidentiality Policy Template',
    description: 'Customizable privacy policy template compliant with Privacy Act and NDIS Code of Conduct. Covers data handling, retention, and participant rights.',
    content: null,
    file_url: 'https://example.com/privacy-policy-template.docx',
    category: 'Templates',
    tags: ['privacy', 'policy', 'template', 'compliance', 'GDPR'],
    access_tier: 'starter',
    is_published: true,
  },
  {
    title: 'Cultural Competency in Care - Advanced Training',
    description: 'Advanced training materials on cultural awareness, sensitivity, and competency in aged care and disability support. Exclusive to Professional and Enterprise tiers.',
    content: `# Cultural Competency in Care - Advanced Training

## Objectives
- Understand diverse cultural backgrounds
- Identify personal biases and assumptions
- Adapt care approaches for cultural appropriateness
- Build inclusive care environments

## Cultural Dimensions
1. Communication styles
2. Family structures and roles
3. Healthcare beliefs and practices
4. Dietary requirements
5. Spiritual and religious practices
6. Views on aging and disability

## Communication Strategies
- Use interpreters when needed
- Ask open questions
- Listen actively
- Respect personal preferences
- Document cultural information

## Case Studies
Real-world examples of culturally sensitive care delivery across diverse communities.

## Assessment and Reflection
Practical exercises for self-assessment and ongoing development.`,
    file_url: null,
    category: 'Guides',
    tags: ['cultural competency', 'training', 'diversity', 'advanced'],
    access_tier: 'professional',
    is_published: true,
  },
  {
    title: 'Enterprise Risk Management Framework',
    description: 'Comprehensive risk management framework for large care organisations. Includes risk assessment, mitigation strategies, and governance procedures. Enterprise tier exclusive.',
    content: null,
    file_url: 'https://example.com/enterprise-risk-framework.pdf',
    category: 'Guides',
    tags: ['risk', 'management', 'governance', 'enterprise', 'strategy'],
    access_tier: 'enterprise',
    is_published: true,
  },
  {
    title: 'Incident Reporting and Investigation Template',
    description: 'Standard template for documenting incidents and accidents. Includes investigation procedures and follow-up actions.',
    content: null,
    file_url: 'https://example.com/incident-report-template.xlsx',
    category: 'Templates',
    tags: ['incident', 'reporting', 'investigation', 'documentation'],
    access_tier: 'free',
    is_published: true,
  },
]

async function seedResources() {
  try {
    console.log('🌱 Seeding resources...')

    const { data, error } = await supabase
      .from('resources')
      .insert(
        sampleResources.map((resource) => ({
          ...resource,
          download_count: 0,
        }))
      )
      .select()

    if (error) {
      console.error('❌ Error seeding resources:', error.message)
      process.exit(1)
    }

    console.log(`✅ Successfully seeded ${data?.length || 0} resources`)
    console.log('\nResources created:')
    data?.forEach((r) => {
      console.log(`  • ${r.title} (${r.category}, ${r.access_tier})`)
    })
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  }
}

seedResources()
