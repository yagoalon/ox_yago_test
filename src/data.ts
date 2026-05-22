/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Meeting, CalendarProvider, TimelineDetection } from './types';

export const USER_INFO = {
  name: 'Sarah',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsniav9iY9Svdj-p_XWiczBrQfyDDehP8TwrD1JSvW_eAMr8ZHCowFpdu2E70KVojQ7uyUSfItNYYblaSIdyZiJPUIJeijF3nSMgRcXFq1IDPRQ0ry2xLl0jCxJbiw6XbbKqudetP2D3dx7NueSWQKoBfsPBF-5qFSoMcWkyO80lokD9e-PoDP2bPpMLqfF_Wo6r2jRGA60KLDvSfK7cyddTtqw2AqVQApPNSdTFQYXOd2AB2S-_PvEW-zzjaX3unCaU2H90XMG_Y'
};

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'm1',
    title: 'Product Roadmap Finalization',
    date: 'Oct 24, 2026',
    time: '2:00 PM',
    duration: '45 mins',
    category: 'Q3 STRATEGY ALIGNMENT',
    status: '3 Risks Found',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaYBKL3_vz6wSO43xmGUloAGIH-XTguLTtd-23dQKEMtFFFV6hlq7ShYmnz52z1StxDJTjZBJdetJ2iGwMJyGqUmAuu4j10Lp2eYNZdOn1O7PkNsHAOQKmFujK1hDZTC1Gw7OFbBkw9NvDXgfFFTuIjy1DczeYoLvTBF__HMORSbVRMwfbZmjSbm4kttyRhmqiXhRl81gLBODaWKsj3ghbVr3ZqF4McCRGJ7mcxJ-wrUP1g3PPkGGAaRcTewgkoGjbgC5MmdpWi6U',
    summary: 'Mobile-first transition finalized for Q3. Target: 40% DAU growth through AI-native integration and revamped onboarding.',
    risks: [
      'Traffic Scalability (200%) - Spike potential in authentication gateway.',
      'Sec. Cert. Delay (v2.4) - Compliance queue backlogged by two weeks.',
      'Resource Constraint - Need dedicated engineering squad for animation engine.'
    ],
    insights: [
      'AI-Native Adoption Shift: Users engaging with summaries show 3.2x higher weekly sessions.',
      '15% Mobile Engagement Lift: Revamped onboarding flow drastically reduces drops in day 1.'
    ],
    talkingPoints: [
      'User Retention: Implement tiered loyalty program across all tiers.',
      'Architecture: Transition legacy backend to a serverless model.'
    ],
    nextSteps: [
      { id: 'ns1', text: 'Submit revised budget draft', completed: false },
      { id: 'ns2', text: 'Schedule v2.4 security audit', completed: false },
      { id: 'ns3', text: 'Finalize Q4 expansion roadmap', completed: false },
      { id: 'ns4', text: 'Technical stakeholder review', completed: true }
    ],
    participantsCount: 6,
    participantAvatars: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDFWMVB3LDygVHvjbMMF8tktZq3Qu3ldcZgOHrPuja7ab3Tu3fB_bp5Yk6Ke0sQ2xl6b-Yi15Jkc73Z7MU4b-mQsIgV70jRclORv6yApJnjtOwO-DyAUAfVs4c2gWYg8t_S0Qme5jedYeMhaHWr_MHlDt-WTYBHW7qf4OfowWbx_H7vx055NKpvrFFoVmXCayQQP4MmcCPlacywF3A2gqlNVMkzyXM8u9En23Ga7vMd1TvydjmvuCmevQJaElbXcfCG9--kt-Nc8Es',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCchZpKKlYGElmXrotka75A0djT-cUMd8qLulDxRO6zMBvNBqkEkoKyN3U5iw7FSCIl7Yel_Z8m4yEAMRkr-TW-GDTewzJxvpIjPkaEcG9Rd7X8TaRwIyG7f1TAyDNCXCzHyZLZTatNvJ9gB3hV7SbXzKAcwQNSGI7fVcn7F6EpJ2HzcttYbSEAcpI1_v2sFu96iwybc8GNnfuYflmcQP6pQVQCVw9AWaikw7MKdFlBlUYerAkIpuLDt-7us16yp_CEZJhoJBzyA4Y'
    ],
    attachments: ['DesignSystem_v2.pdf', 'MobileProposal.pptx'],
    fullTranscript: `Sarah (CEO): Welcome everyone to the Q3 strategy alignment meeting. Today we are looking at our Product Roadmap Finalization, specifically focusing on our transition to a mobile-first philosophy.

Mark (CTO): On the technical front, we have identified some scalability issues. The traffic could potentially spike by up to 200%, especially during our AI-Native onboarding flows.

Sarah: Understood. Let's make sure our transition of the legacy backend to serverless addresses this.

Elena (Head of Product): Based on initial surveys, our AI-Native features show users have 3.2x higher weekly sessions, pointing towards a massive user retention boost. We should introduce themed loyalty tiers.

Mark: My concern lies also with the compliance queue. We face a 2-week backlog for our security certificate v2.4, so the audit needs to be scheduled early.

Elena: I will prepare drafts for the visual roadmap by tomorrow so we can submit the revised budget package.`
  },
  {
    id: 'm2',
    title: 'Project Apollo Budget Review',
    date: 'Oct 23, 2026',
    time: '10:30 AM',
    duration: '60 mins',
    category: 'Budget Planning',
    status: 'Summarized',
    summary: 'Detailed financial allocation for Project Apollo reviewed. Initial budget approved with minor alterations to UI/UX and animation development allocations.',
    risks: [
      'Cost overrun on animation outsourcing packages.'
    ],
    insights: [
      'Strategic cost reallocation from server maintenance to local UI speedups.',
      'Tiered vendor pricing model could save up to 12% in operational expenditure.'
    ],
    talkingPoints: [
      'Vendor management consolidation.',
      'SaaS license updates for Figma and Google Cloud Workspace.'
    ],
    nextSteps: [
      { id: 'ns2_1', text: 'Send revised budget sheets to finance board', completed: true },
      { id: 'ns2_2', text: 'Approve vendor outsourcing contract', completed: false }
    ],
    participantsCount: 4,
    participantAvatars: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDFWMVB3LDygVHvjbMMF8tktZq3Qu3ldcZgOHrPuja7ab3Tu3fB_bp5Yk6Ke0sQ2xl6b-Yi15Jkc73Z7MU4b-mQsIgV70jRclORv6yApJnjtOwO-DyAUAfVs4c2gWYg8t_S0Qme5jedYeMhaHWr_MHlDt-WTYBHW7qf4OfowWbx_H7vx055NKpvrFFoVmXCayQQP4MmcCPlacywF3A2gqlNVMkzyXM8u9En23Ga7vMd1TvydjmvuCmevQJaElbXcfCG9--kt-Nc8Es'
    ],
    attachments: ['ApolloExpenseSheet.xlsx', 'VendorProposals.pdf'],
    fullTranscript: `Financial sync regarding Apollo Project. Sarah approved the budget subject to standard audits. Budget reallocations to focus heavily on local optimizations.`
  },
  {
    id: 'm3',
    title: 'Stakeholder Feedback Session',
    date: 'Oct 22, 2026',
    time: '4:00 PM',
    duration: '35 mins',
    category: 'User Experience Review',
    status: '1 Risk Found',
    summary: 'The team discussed feedback from the steering committee regarding the user interface overhaul. Stakeholders requested smoother page transitions and high accessibility contrast.',
    risks: [
      'Lack of contrast on low-tier screens.'
    ],
    insights: [
      'Steering committee advocates strongly for motion typography and Inter pairings.',
      'Touch targets must grow past 44px on devices to preserve seamless flow.'
    ],
    talkingPoints: [
      'Adhering to Inter and Hanken Grotesk typography guidelines.',
      'Touch sizes on mobile targets.'
    ],
    nextSteps: [
      { id: 'ns3_1', text: 'Increase stroke thickness on secondary labels', completed: false },
      { id: 'ns3_2', text: 'Conduct accessibility contrast scan', completed: true }
    ],
    participantsCount: 8,
    participantAvatars: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCchZpKKlYGElmXrotka75A0djT-cUMd8qLulDxRO6zMBvNBqkEkoKyN3U5iw7FSCIl7Yel_Z8m4yEAMRkr-TW-GDTewzJxvpIjPkaEcG9Rd7X8TaRwIyG7f1TAyDNCXCzHyZLZTatNvJ9gB3hV7SbXzKAcwQNSGI7fVcn7F6EpJ2HzcttYbSEAcpI1_v2sFu96iwybc8GNnfuYflmcQP6pQVQCVw9AWaikw7MKdFlBlUYerAkIpuLDt-7us16yp_CEZJhoJBzyA4Y',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDFWMVB3LDygVHvjbMMF8tktZq3Qu3ldcZgOHrPuja7ab3Tu3fB_bp5Yk6Ke0sQ2xl6b-Yi15Jkc73Z7MU4b-mQsIgV70jRclORv6yApJnjtOwO-DyAUAfVs4c2gWYg8t_S0Qme5jedYeMhaHWr_MHlDt-WTYBHW7qf4OfowWbx_H7vx055NKpvrFFoVmXCayQQP4MmcCPlacywF3A2gqlNVMkzyXM8u9En23Ga7vMd1TvydjmvuCmevQJaElbXcfCG9--kt-Nc8Es'
    ],
    attachments: ['ContrastComplianceReport.docx'],
    fullTranscript: `A detailed study of user comments. The core emphasis was on typography standards and accessibility levels.`
  },
  {
    id: 'm4',
    title: 'Frontend Architecture Sync',
    date: 'Oct 21, 2026',
    time: '2:15 PM',
    duration: '30 mins',
    category: 'Engineering Architecture',
    status: 'Success',
    summary: 'Decided on bundling strategies and CSS definitions. Confirmed integration of Tailwind CSS v4 and esbuild compilation profiles.',
    risks: [],
    insights: [
      'Bundler settings reduce load latency by 140ms on slow network conditions.'
    ],
    talkingPoints: [
      'Removal of legacy CSS classes.',
      'Deployment guidelines for static resources.'
    ],
    nextSteps: [
      { id: 'ns4_1', text: 'Update package build profile', completed: true }
    ],
    participantsCount: 3,
    participantAvatars: [],
    attachments: ['ArchDoc_v1.md'],
    fullTranscript: `Short developer sync regarding bundling speed and esbuild configurations. Decided to bundle CJS format servers for reliable starting speeds.`
  }
];

export const INITIAL_CALENDAR_PROVIDERS: CalendarProvider[] = [
  {
    id: 'google',
    name: 'Google Calendar',
    connected: false,
    description: 'Recommended for Google Workspace users',
    recommended: true
  },
  {
    id: 'outlook',
    name: 'Outlook Calendar',
    connected: false,
    description: 'For Microsoft 365 and Outlook.com'
  }
];

export const INITIAL_TIMELINE_DETECTIONS: TimelineDetection[] = [
  {
    id: 't1',
    title: 'Frontend Architect Interview',
    time: 'TODAY, 2:30 PM',
    candidate: 'Alex Rivera',
    type: 'Ready for Intel'
  },
  {
    id: 't2',
    title: 'Product Strategy Sync',
    time: 'TOMORROW, 10:00 AM',
    candidate: 'Team Alignment',
    type: 'Internal Only'
  }
];
