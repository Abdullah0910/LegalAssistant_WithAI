import {
  assistantCache,
  documentAnalysisCache,
  issueClassificationCache,
  ResponseCache,
} from './cacheService.js';
import { DEMO_DOCUMENTS } from '../../src/data/demoDocuments.js';
import {
  AssistantChatResponse,
  DocumentAnalysisResponse,
  IssueClassificationResponse,
} from './aiService.js';

export function seedDefaultCaches(): void {
  // 1. Seed Demo Documents Analysis
  const tenancyDoc = DEMO_DOCUMENTS[0];
  const tenancyAnalysis: DocumentAnalysisResponse = {
    summary:
      'Residential Tenancy Agreement for an 11-month lease at Bangalore, Karnataka. Establishes monthly rent of ₹28,000, an interest-free refundable deposit of ₹50,000 with a 30-day refund covenant, and explicitly prohibits deductions for natural wear and tear while requiring contractor bills for damages exceeding ₹2,000.',
    documentType: 'Residential Lease & Tenancy Agreement',
    governingLaw: 'Karnataka Rent Act / Model Tenancy Act principles',
    keyClauses: [
      {
        clauseTitle: 'Deposit Refund & Wear-and-Tear Protection',
        label: 'Payment Obligation',
        originalSnippet:
          'The Landlord covenants to refund the said deposit within 30 days... Natural wear and tear resulting from ordinary habitation shall NOT be subject to deduction.',
        plainEnglishMeaning:
          'Your landlord must return your entire ₹50,000 deposit within 30 days of vacating. They cannot legally deduct money for ordinary fading or wear, and must show contractor bills for deductions over ₹2,000.',
        riskLevel: 'Standard',
      },
      {
        clauseTitle: 'Termination Notice Period',
        label: 'Termination Clause',
        originalSnippet:
          'Either party may terminate this agreement prior to expiry of the 11-month term by serving 1 (one) full calendar month advance written notice.',
        plainEnglishMeaning:
          'You or the landlord can end the lease early by giving at least 30 days written notice or paying one month rent.',
        riskLevel: 'Notice',
      },
      {
        clauseTitle: 'Mandatory Joint Handover Inspection',
        label: 'Notice Requirement',
        originalSnippet:
          'At least 7 days prior to vacating, both parties shall conduct a joint walkthrough inspection and sign a joint Handover Certificate.',
        plainEnglishMeaning:
          'Both you and the landlord must walk through the flat a week before moving out and sign a inspection sheet recording meter readings and fixture conditions.',
        riskLevel: 'Standard',
      },
      {
        clauseTitle: 'Rent Court Jurisdiction',
        label: 'Dispute Resolution',
        originalSnippet:
          'In the event of any dispute or unpaid deposit recovery... referred to the competent Rent Court / Rent Authority.',
        plainEnglishMeaning:
          'Unresolved deposit disputes must be filed before the local Bangalore Rent Authority under the tenancy laws rather than regular protracted civil courts.',
        riskLevel: 'Standard',
      },
    ],
    importantDates: [
      {
        dateOrTimeframe: '30 Days Post-Vacating',
        obligationOrMilestone: 'Full refund of refundable security deposit (₹50,000)',
        consequenceOfMissing: 'Breach of agreement; landlord owes interest and legal notice may be issued',
      },
      {
        dateOrTimeframe: '7 Days Prior to Move-Out',
        obligationOrMilestone: 'Joint walkthrough inspection and signing of Handover Certificate',
        consequenceOfMissing: 'Disputed damage claims; harder to refute wall painting deductions',
      },
      {
        dateOrTimeframe: '5th of Every Month',
        obligationOrMilestone: 'Monthly rent remittance of ₹28,000',
        consequenceOfMissing: 'Late default under lease terms',
      },
    ],
    parties: [
      {
        name: 'Mr. S. K. Sharma',
        role: 'Lessor / Landlord',
        primaryObligations: [
          'Hand over peaceable possession of Scheduled Premises',
          'Refund ₹50,000 security deposit within 30 days of handover',
          'Provide itemized receipts for any claimed deductions above ₹2,000',
        ],
      },
      {
        name: 'Ms. Priya Ramesh',
        role: 'Lessee / Tenant',
        primaryObligations: [
          'Pay monthly rent of ₹28,000 by 5th of each month',
          'Maintain premises and permit joint walkthrough inspection',
          'Serve 1 month advance notice prior to termination',
        ],
      },
    ],
    mutualObligations: {
      userObligations: [
        'Pay rent on or before 5th of each calendar month',
        'Pay actual utility bills (electricity and water)',
        'Participate in joint inspection 7 days before vacating',
      ],
      counterpartyObligations: [
        'Refund entire security deposit within 30 days',
        'Not deduct for ordinary habitation wear and tear',
        'Furnish third-party contractor bills for legitimate repairs',
      ],
    },
    risksAndAttentionPoints: [
      {
        riskTitle: 'Arbitrary Painting Deduction Without Written Justification',
        severity: 'High',
        description:
          'Clause 3 specifically prohibits deductions for ordinary wear and tear, yet landlords frequently withhold deposit for repainting.',
        mitigationTip:
          'Record a comprehensive date-stamped video walkthrough of all walls on vacating day and insist on signing the Handover Certificate.',
      },
      {
        riskTitle: 'Absence of Signed Joint Handover Certificate',
        severity: 'Medium',
        description:
          'If you vacate without the signed handover certificate from Clause 5, the landlord may claim unilateral damages later.',
        mitigationTip:
          'Send an email with inspection photos immediately upon moving out confirming key handover.',
      },
    ],
    questionsForLawyer: [
      'Under the Model Tenancy Act and local Rent Control laws, can a landlord legally deduct painting charges if the lease explicitly excludes wear and tear?',
      'What is the statutory interest rate claimable on an unlawfully withheld rental deposit after 30 days?',
      'How quickly can an eviction or deposit recovery petition be heard before the Rent Authority in Bangalore?',
      'Is serving a 15-day demand notice via registered speed post mandatory before approaching the Rent Court?',
      'Can I file a complaint with the District Consumer Commission if the landlord operates rental properties as a commercial business?',
    ],
    sources: [
      {
        name: 'Model Tenancy Act & State Rent Control Rules',
        provision: 'Provisions regarding Security Deposit Caps & Timely Refunds',
        url: 'https://mohua.gov.in/cms/model-tenancy-act.php',
      },
      {
        name: 'eCourts Services - Karnataka Rent Courts',
        provision: 'Rent Tribunal dispute filing',
        url: 'https://services.ecourts.gov.in',
      },
    ],
    disclaimer:
      'This document analysis provides general educational explanations of clauses and does not constitute a legal opinion on enforceability. Consult an advocate or solicitor for binding contractual advice.',
  };

  // Seed tenancy doc under both filename keys
  const tenancyKey1 = ResponseCache.generateKey('doc_analyze', {
    filename: 'sample_tenancy.txt',
    jurisdiction: 'India',
    docHash: tenancyDoc.content,
  });
  const tenancyKey2 = ResponseCache.generateKey('doc_analyze', {
    filename: tenancyDoc.title + '.txt',
    jurisdiction: 'India',
    docHash: tenancyDoc.content,
  });
  documentAnalysisCache.set(tenancyKey1, tenancyAnalysis);
  documentAnalysisCache.set(tenancyKey2, tenancyAnalysis);

  // 2. Seed Common Assistant Questions
  const depositQuestions = [
    'my landlord has not returned my ₹50,000 security deposit. what options do i have?',
    'my landlord is refusing to return my security deposit. what are my options?',
    'my landlord has not returned my security deposit. what options do i have?',
  ];

  const depositAssistantResponse: AssistantChatResponse = {
    understanding:
      'Your landlord is withholding your refundable security deposit without legal or contractual justification. In residential leases, security deposits are trust funds held by the landlord and must be returned upon vacating, minus only legitimate, verifiable damages beyond ordinary wear and tear.',
    relevantLegalConcepts: [
      {
        concept: 'Prohibition on Deductions for Natural Wear & Tear',
        statuteOrRule: 'Model Tenancy Act & Indian Contract Act, 1872 (Section 73)',
        explanation:
          'A landlord cannot lawfully deduct amounts for repainting or normal weathering resulting from ordinary residential use unless explicitly specified and itemized.',
      },
      {
        concept: 'Mandatory Refund Timetable & Accrual of Interest',
        statuteOrRule: 'State Rent Control Enactments / Model Tenancy Act',
        explanation:
          'Security deposits must generally be refunded within 30 days of peaceful handover of vacant possession. Failure to refund permits recovery of statutory interest.',
      },
      {
        concept: 'Requirement of Itemized Evidence for Deductions',
        statuteOrRule: 'Principles of Contractual Breach & Estoppel',
        explanation:
          'The landlord bears the evidentiary burden to prove actual damages, contractor bills, and repair receipts.',
      },
    ],
    possibleNextSteps: [
      {
        stepNumber: 1,
        title: 'Review Signed Lease & Handover Evidence',
        description:
          'Verify your agreement clauses regarding deposit refund timeframe and check your date-stamped photos or videos taken at move-out.',
        priority: 'High',
      },
      {
        stepNumber: 2,
        title: 'Send a Formal Written Demand Notice',
        description:
          'Send a formal demand letter via registered email and Speed Post granting a strict 15-day cure period to refund the ₹50,000 plus interest.',
        priority: 'High',
      },
      {
        stepNumber: 3,
        title: 'File Petition with Rent Authority / Small Claims',
        description:
          'If the landlord fails to comply within 15 days, file a summary recovery petition before the local Rent Authority or District Consumer Commission.',
        priority: 'Medium',
      },
    ],
    documentsToCollect: [
      {
        documentName: 'Executed Rental Agreement',
        purpose: 'Establishes the deposit amount and refund terms.',
        whereToObtain: 'Personal archives or email records.',
      },
      {
        documentName: 'Bank Transaction Record / Rent Receipts',
        purpose: 'Provides conclusive proof that ₹50,000 deposit was transferred.',
        whereToObtain: 'Bank netbanking statement or UPI payment receipt.',
      },
      {
        documentName: 'Key Handover Acknowledgement & Photos',
        purpose: 'Proves date of vacating and pristine condition of premises.',
        whereToObtain: 'Email trail with landlord and phone photo gallery.',
      },
    ],
    importantConsiderations: {
      deadlines: [
        '15-day cure period standard for legal notices',
        '3-year statutory limitation period under Limitation Act, 1963 for debt recovery',
      ],
      jurisdictionNotes:
        'Governed by Karnataka / State Rent Control regulations and Model Tenancy framework. Rent Authorities provide fast-track adjudication.',
      uncertaintyFactors: [
        'If no walkthrough photos were taken, proving pre-existing wall marks requires witness statements.',
        'Oral agreements without written terms carry higher burden of proof.',
      ],
    },
    sources: [
      {
        name: 'India Code - Indian Contract Act, 1872',
        provision: 'Section 73 (Compensation for loss or damage caused by breach of contract)',
        url: 'https://www.indiacode.nic.in/handle/123456789/2187',
        note: 'Official portal for Central Enactments',
      },
      {
        name: 'National Legal Services Authority (NALSA)',
        provision: 'Free Legal Aid & Tenant Dispute Counseling',
        url: 'https://nalsa.gov.in',
        note: 'Statutory authority providing free legal aid',
      },
    ],
    disclaimer:
      'This explanation is provided for general legal literacy and educational information only. It does not constitute formal legal counsel or create an advocate-client relationship. Please consult an advocate in your jurisdiction for binding legal proceedings.',
  };

  depositQuestions.forEach((q) => {
    const key = ResponseCache.generateKey('assistant', { question: q, jurisdiction: 'India' });
    assistantCache.set(key, depositAssistantResponse);
  });

  // 3. Seed Sample Issue Intake
  const sampleIntakeDesc = "my company hasn't paid my salary for 2 months and says i cannot leave without paying them.";
  const sampleIntakeResponse: IssueClassificationResponse = {
    category: 'Employment',
    specificIssue: 'Unpaid Wages and Restraint on Exit',
    urgencyLevel: 'High',
    summary:
      'Your dispute involves non-payment of earned wages by your employer for two consecutive months combined with an unlawful restraint or penalty on resigning.',
    informationNeeded: [
      {
        field: 'Appointment Letter & Pay Slips',
        question: 'Do you have your signed employment contract and previous salary slips?',
        importance: 'Proves contractual employment relationship, CTC breakdown, and salary history.',
      },
      {
        field: 'Resignation & Communication Trail',
        question: 'Have you tendered written resignation and received written replies regarding salary withholding?',
        importance: 'Documents bad-faith retention and clear dates of default.',
      },
      {
        field: 'Company Details & Location',
        question: 'Where is the registered office of the company situated?',
        importance: 'Determines the territorial jurisdiction of the Labour Commissioner and Payment of Wages Authority.',
      },
    ],
    immediateActions: [
      {
        stepNumber: 1,
        action: 'Preserve All Digital Records and Salary Proofs',
        reason: 'Back up offer letter, emails, pay slips, and timesheets before company IT access is revoked.',
      },
      {
        stepNumber: 2,
        action: 'Issue a Formal Legal Demand Notice under Payment of Wages Act',
        reason: 'Demand immediate disbursement of arrears within 7 days, highlighting statutory non-compliance.',
      },
      {
        stepNumber: 3,
        action: 'File Grievance before Labour Commissioner / Samadhan Portal',
        reason: 'Provides government mediation and recovery proceedings at zero filing cost.',
      },
    ],
    evidenceToPreserve: [
      'Appointment contract, CTC sheet, and company policy handbook',
      'Bank statement showing missing credit entries for the 2 months',
      'Emails/messages where the company demands payment or refuses experience letter',
      'Timesheets, attendance logs, and project deliverables proving work done',
    ],
    potentialApplicableLaws: [
      'Payment of Wages Act, 1936 (Mandatory monthly wage disbursement)',
      'Industrial Relations Code / Shops & Establishments Act',
      'Indian Contract Act, 1872 (Section 27: Voidness of restrictive covenants)',
    ],
    jurisdiction: 'India',
  };

  const intakeKey = ResponseCache.generateKey('intake', {
    situation: sampleIntakeDesc,
    jurisdiction: 'India',
  });
  issueClassificationCache.set(intakeKey, sampleIntakeResponse);
}
