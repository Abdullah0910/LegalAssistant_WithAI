import {
  assistantCache,
  documentAnalysisCache,
  issueClassificationCache,
  documentQACache,
  documentStore,
  ResponseCache,
} from './cacheService.js';
import { DEMO_DOCUMENTS } from '../../src/data/demoDocuments.js';
import {
  AssistantChatResponse,
  DocumentAnalysisResponse,
  IssueClassificationResponse,
} from './aiService.js';

export function seedDefaultCaches(): void {
  // =========================================================================
  // 1. SEED DEMO DOCUMENTS IN ANALYSIS CACHE & DOCUMENT STORE
  // =========================================================================

  // --- Document 1: Tenancy Agreement ---
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
          'Both you and the landlord must walk through the flat a week before moving out and sign an inspection sheet recording meter readings and fixture conditions.',
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

  // --- Document 2: Employment Severance ---
  const employmentDoc = DEMO_DOCUMENTS[1];
  const employmentAnalysis: DocumentAnalysisResponse = {
    summary:
      'Full-time employment agreement for a Senior Systems Engineer at CloudPulse Technologies, Gurugram. Sets CTC at ₹14,40,000 per annum, establishes a 60-day bilateral termination notice or salary payout in lieu, and includes a post-employment 12-month non-compete clause that is legally void under Indian contract law.',
    documentType: 'Employment and Confidentiality Agreement',
    governingLaw: 'Indian Contract Act, 1872 & Payment of Wages Act, 1936 (Haryana)',
    keyClauses: [
      {
        clauseTitle: 'Termination and Notice Period Payout',
        label: 'Termination Clause',
        originalSnippet:
          'The Company shall provide 60 days advance notice or immediate salary payout in lieu thereof... all accrued gratuity, earned leave, and pending salary within 30 days.',
        plainEnglishMeaning:
          'If the company terminates your employment without misconduct, they must give you 60 days notice or pay you 2 months gross salary immediately, plus full settlement within 30 days.',
        riskLevel: 'Standard',
      },
      {
        clauseTitle: 'Non-Compete and Restraint of Trade',
        label: 'Potentially Important Clause',
        originalSnippet:
          'For a period of 12 months post-employment, the Employee shall not work for any competitor firm in India.',
        plainEnglishMeaning:
          'While written into the agreement, under Section 27 of the Indian Contract Act, post-employment non-compete clauses are void as unlawful restraints on lawful trade.',
        riskLevel: 'Notice',
      },
      {
        clauseTitle: 'Company Property and Repository Return',
        label: 'Notice Requirement',
        originalSnippet:
          'The Employee agrees to return all laptops, cryptographic tokens, and confidential project repositories within 5 business days.',
        plainEnglishMeaning:
          'You must return all employer hardware and credentials within 5 business days of receiving notice.',
        riskLevel: 'Standard',
      },
      {
        clauseTitle: 'Full and Final Settlement Disbursement',
        label: 'Payment Obligation',
        originalSnippet:
          'The Company shall disburse all accrued gratuity, earned leave encashment, and pending monthly salary within 30 days of the last working day.',
        plainEnglishMeaning:
          'The employer is contractually and statutorily obligated to clear all dues within 30 days of your last working day.',
        riskLevel: 'Standard',
      },
    ],
    importantDates: [
      {
        dateOrTimeframe: '60 Days Prior',
        obligationOrMilestone: 'Advance written termination notice or salary in lieu',
        consequenceOfMissing: 'Breach of employment contract; wrongful termination claim',
      },
      {
        dateOrTimeframe: '30 Days Post-Exit',
        obligationOrMilestone: 'Full and Final (F&F) settlement disbursement',
        consequenceOfMissing: 'Violation of Payment of Wages Act; interest and recovery claimable',
      },
      {
        dateOrTimeframe: '5 Business Days Post-Notice',
        obligationOrMilestone: 'Return of company assets and repositories',
        consequenceOfMissing: 'Delay in relieving letter or asset recovery notice',
      },
    ],
    parties: [
      {
        name: 'CloudPulse Technologies Pvt Ltd',
        role: 'Employer',
        primaryObligations: [
          'Pay annual CTC of ₹14,40,000 in monthly installments',
          'Provide 60 days notice or pay in lieu upon termination without cause',
          'Disburse Full and Final settlement within 30 days',
        ],
      },
      {
        name: 'Mr. Rohan Nair',
        role: 'Employee (Senior Systems Engineer)',
        primaryObligations: [
          'Serve 3 months probation and deliver engineering duties',
          'Provide 60 days notice prior to resignation',
          'Return all proprietary assets and repositories within 5 days',
        ],
      },
    ],
    mutualObligations: {
      userObligations: [
        'Serve 60 days notice or pay gross salary in lieu',
        'Return all company hardware and credentials within 5 days',
        'Maintain confidentiality of proprietary software repositories',
      ],
      counterpartyObligations: [
        'Pay monthly salary on the last working day of each calendar month',
        'Provide 60 days advance notice or salary payout in lieu for termination without cause',
        'Issue relieving letter and experience certificate with full settlement within 30 days',
      ],
    },
    risksAndAttentionPoints: [
      {
        riskTitle: 'Unenforceable Post-Employment Non-Compete Restriction',
        severity: 'Medium',
        description:
          'The employer may attempt to threaten legal action or withhold relieving letters citing the 12-month non-compete clause.',
        mitigationTip:
          'Reference Section 27 of the Indian Contract Act and landmark Supreme Court rulings (e.g., Percept D’Mark v. Zaheer Khan) confirming non-competes post-termination are void.',
      },
      {
        riskTitle: 'Delay in Relieving Letter and F&F Settlement',
        severity: 'High',
        description:
          'Employers sometimes hold back experience letters to force employees to forfeit severance or notice pay.',
        mitigationTip:
          'Secure all email confirmations and offer letters, and issue a demand notice under the Payment of Wages Act if delayed beyond 30 days.',
      },
    ],
    questionsForLawyer: [
      'Can the company legally withhold my relieving letter if I join another technology company despite Clause 4?',
      'What legal remedy exists before the Labour Commissioner if the company terminates without paying the 60-day notice pay?',
      'Can gratuity and earned leave encashment be forfeited without a judicial finding of willful damage?',
      'What are the procedural steps to file a recovery petition under Section 15 of the Payment of Wages Act?',
    ],
    sources: [
      {
        name: 'India Code - Indian Contract Act, 1872',
        provision: 'Section 27 (Agreement in restraint of trade, void)',
        url: 'https://www.indiacode.nic.in/handle/123456789/2187',
      },
      {
        name: 'Ministry of Labour & Employment - Samadhan Portal',
        provision: 'Industrial dispute and wage grievance filing',
        url: 'https://samadhan.labour.gov.in',
      },
    ],
    disclaimer:
      'General legal literacy explanation only. Does not constitute an advocate-client relationship. Consult an employment advocate for formal proceedings.',
  };

  // --- Document 3: Consumer Warranty Claim ---
  const warrantyDoc = DEMO_DOCUMENTS[2];
  const warrantyAnalysis: DocumentAnalysisResponse = {
    summary:
      'Retail purchase invoice and warranty documentation for a ₹42,990 FrostWave refrigerator that suffered compressor failure within 6 days of delivery. Establishes the consumer’s right to a replacement unit or full refund under the Consumer Protection Act, 2019 after the retailer and manufacturer denied repair.',
    documentType: 'Consumer Purchase Invoice & Statutory Warranty Policy',
    governingLaw: 'Consumer Protection Act, 2019 (Sections 2(7), 84, 85, 69)',
    keyClauses: [
      {
        clauseTitle: '30-Day Defect Refund or Replacement Guarantee',
        label: 'Payment Obligation',
        originalSnippet:
          'If a catastrophic defect or total cooling failure occurs within 30 days of installation, the consumer has the explicit right to demand a replacement unit or a full refund without deduction of depreciation.',
        plainEnglishMeaning:
          'Because the appliance failed within 30 days, you are legally entitled to either a brand new replacement refrigerator or a 100% full refund.',
        riskLevel: 'Standard',
      },
      {
        clauseTitle: '14-Day Rectification Window',
        label: 'Notice Requirement',
        originalSnippet:
          'If the manufacturer fails to rectify the defect within 14 business days, the consumer may seek refund and compensation through the National Consumer Helpline or e-Daakhil.',
        plainEnglishMeaning:
          'The brand has a maximum of 14 days to fix the issue. Claiming parts are indefinitely on back-order triggers your immediate right to compensation.',
        riskLevel: 'Standard',
      },
      {
        clauseTitle: 'Statutory Product Liability',
        label: 'Liability / Indemnity',
        originalSnippet:
          'Under the Consumer Protection Act, 2019 (Sections 84 and 85)... both manufacturer and seller can be held liable for defective goods.',
        plainEnglishMeaning:
          'Both the shop where you bought it and the manufacturer share legal liability for selling a defective unit.',
        riskLevel: 'Caution',
      },
      {
        clauseTitle: '2-Year Statutory Limitation for Filing',
        label: 'Dispute Resolution',
        originalSnippet:
          'Under Section 69 of the Consumer Protection Act, 2019, a consumer complaint may be filed within 2 (two) years from the date on which the cause of action arose.',
        plainEnglishMeaning:
          'You have up to two years from the breakdown date to file an e-Daakhil case, though filing promptly is recommended.',
        riskLevel: 'Standard',
      },
    ],
    importantDates: [
      {
        dateOrTimeframe: 'Within 30 Days of Installation',
        obligationOrMilestone: 'Immediate replacement or full refund right for catastrophic failure',
        consequenceOfMissing: 'Transitions to standard repair warranty instead of direct refund right',
      },
      {
        dateOrTimeframe: '14 Business Days',
        obligationOrMilestone: 'Maximum permissible service rectification window',
        consequenceOfMissing: 'Unfair trade practice; consumer entitled to compensation for spoiled food',
      },
      {
        dateOrTimeframe: '2 Years from Incident',
        obligationOrMilestone: 'Statutory deadline to file complaint before District Consumer Commission',
        consequenceOfMissing: 'Barred by limitation under Section 69 CPA 2019',
      },
    ],
    parties: [
      {
        name: 'MegaAppliance World Electronics LLP',
        role: 'Retail Seller',
        primaryObligations: [
          'Deliver merchantable product conforming to specifications',
          'Honor warranty and facilitate manufacturer replacement',
        ],
      },
      {
        name: 'FrostWave Appliances India Ltd',
        role: 'Manufacturer',
        primaryObligations: [
          'Warrant parts and compressor for 12 months comprehensive',
          'Dispatch engineer within 48 hours and repair within 14 business days',
          'Replace or refund appliance failing within 30 days',
        ],
      },
      {
        name: 'Ms. Ananya Gupta',
        role: 'Consumer',
        primaryObligations: [
          'Pay purchase price (₹42,990 paid via UPI)',
          'Log service ticket and permit engineer inspection',
        ],
      },
    ],
    mutualObligations: {
      userObligations: [
        'Produce tax invoice MAW-2025-88421 and UPI transaction proof',
        'Preserve service job sheets and inspection reports',
      ],
      counterpartyObligations: [
        'Disburse full refund of ₹42,990 or replace appliance immediately',
        'Compensate consumer for consequential loss resulting from spoiled food',
      ],
    },
    risksAndAttentionPoints: [
      {
        riskTitle: 'Deflection Between Retailer and Manufacturer',
        severity: 'High',
        description:
          'Retailers frequently blame manufacturers while manufacturers claim parts shortages to stall past 30 days.',
        mitigationTip:
          'Name both retailer and manufacturer as joint opposite parties in your legal notice and e-Daakhil grievance.',
      },
    ],
    questionsForLawyer: [
      'Can I claim compensation for spoiled food and mental harassment in addition to the ₹42,990 refund before the Consumer Forum?',
      'How does the e-Daakhil online portal work for filing without hiring an advocate?',
      'Is the retailer jointly and severally liable under Section 86 of the Consumer Protection Act 2019?',
    ],
    sources: [
      {
        name: 'Department of Consumer Affairs - National Consumer Helpline',
        provision: 'Direct grievance resolution portal (consumerhelpline.gov.in / 1915)',
        url: 'https://consumerhelpline.gov.in',
      },
      {
        name: 'e-Daakhil Consumer Commission Filing Portal',
        provision: 'Online consumer complaint filing for District Commissions',
        url: 'https://edaakhil.nic.in',
      },
    ],
    disclaimer:
      'General legal literacy explanation only. Not a formal legal opinion. Consult a consumer law specialist for specific representation.',
  };

  // Seed all 3 demo documents in documentAnalysisCache & documentStore
  const docsToSeed = [
    { doc: tenancyDoc, analysis: tenancyAnalysis, filename1: 'sample_tenancy.txt' },
    { doc: employmentDoc, analysis: employmentAnalysis, filename1: 'sample_employment.txt' },
    { doc: warrantyDoc, analysis: warrantyAnalysis, filename1: 'sample_warranty.txt' },
  ];

  docsToSeed.forEach(({ doc, analysis, filename1 }) => {
    // Cache by sample filename and full title
    const key1 = ResponseCache.generateKey('doc_analyze', {
      filename: filename1,
      jurisdiction: 'India',
      docHash: doc.content,
    });
    const key2 = ResponseCache.generateKey('doc_analyze', {
      filename: doc.title + '.txt',
      jurisdiction: 'India',
      docHash: doc.content,
    });
    documentAnalysisCache.set(key1, analysis);
    documentAnalysisCache.set(key2, analysis);

    // Pre-seed into documentStore for instant Flow D Q&A retrieval
    const documentId1 = ResponseCache.generateKey('doc', {
      filename: filename1,
      docHash: doc.content.substring(0, 300) + doc.content.length,
    });
    const documentId2 = ResponseCache.generateKey('doc', {
      filename: doc.title + '.txt',
      docHash: doc.content.substring(0, 300) + doc.content.length,
    });

    const chunks = doc.content.split(/\n\s*\n+/).filter((c) => c.trim().length > 0);
    const storeEntry = {
      documentId: documentId2,
      filename: doc.title + '.txt',
      text: doc.content,
      chunks,
      jurisdiction: 'India',
      wordCount: doc.content.split(/\s+/).length,
      characterCount: doc.content.length,
    };

    documentStore.set(documentId1, storeEntry);
    documentStore.set(documentId2, storeEntry);
  });

  // =========================================================================
  // 2. SEED DOCUMENT Q&A FOR SAMPLE DOCUMENTS (Flow D Instant Hits)
  // =========================================================================
  const sampleQAs = [
    {
      docText: tenancyDoc.content,
      question: 'can the landlord deduct painting costs?',
      answer:
        'No. Clause 3 explicitly specifies: "Natural wear and tear resulting from ordinary habitation shall NOT be subject to deduction." Painting due to normal residential use is considered natural wear and tear. The landlord can only deduct for extraordinary damage caused by gross negligence and must provide itemized contractor bills and photographic proof for any deduction exceeding ₹2,000.',
      excerpts: [
        'Clause 3: Natural wear and tear resulting from ordinary habitation shall NOT be subject to deduction.',
        'Clause 3: The Landlord must provide itemized contractor bills and photographic evidence for any claimed deductions exceeding INR 2,000.',
      ],
    },
    {
      docText: tenancyDoc.content,
      question: 'what is the penalty for early termination?',
      answer:
        'Under Clause 4, either party may terminate this agreement prior to the expiry of the 11-month term by serving 1 (one) full calendar month advance written notice, or by paying one month’s rent in lieu of such notice. There are no additional punitive forfeiture penalties beyond the one-month notice period.',
      excerpts: [
        'Clause 4: Either party may terminate this agreement prior to expiry of the 11-month term by serving 1 (one) full calendar month advance written notice, or by paying one month\'s rent in lieu of such notice.',
      ],
    },
    {
      docText: tenancyDoc.content,
      question: 'when should the security deposit be refunded?',
      answer:
        'According to Clause 3, the landlord covenants to refund the entire ₹50,000 interest-free security deposit within 30 days of the tenant peaceably handing over vacant possession of the scheduled premises.',
      excerpts: [
        'Clause 3: The Landlord covenants to refund the said deposit within 30 days of the Tenant peaceably handing over vacant possession of the premises.',
      ],
    },
    {
      docText: employmentDoc.content,
      question: 'is the 12-month non-compete clause enforceable in india?',
      answer:
        'No. While Clause 4.2 states that the employee shall not work for any competitor for 12 months, Section 27 of the Indian Contract Act 1872 explicitly renders any post-employment restraint on lawful trade or profession void and unenforceable. Indian courts consistently uphold employees\' right to seek lawful employment post-exit.',
      excerpts: [
        'Clause 4: For a period of 12 months post-employment, the Employee shall not work for any competitor firm in India.',
        'LEGAL NOTE: Under Section 27 of the Indian Contract Act 1872, post-employment restrictive non-compete covenants are generally void.',
      ],
    },
    {
      docText: warrantyDoc.content,
      question: 'can i get a refund if the appliance is defective within 30 days?',
      answer:
        'Yes. Clause 2(a) and Sections 2(7), 84, and 85 of the Consumer Protection Act 2019 entitle the consumer to demand a replacement unit or a full 100% refund without deduction of depreciation if a catastrophic defect or total cooling failure occurs within 30 days of installation.',
      excerpts: [
        'Clause 2(a): If a catastrophic defect or total cooling failure occurs within 30 days of installation, the consumer has the explicit right to demand a replacement unit or a full refund without deduction of depreciation.',
      ],
    },
  ];

  sampleQAs.forEach((item) => {
    const key = ResponseCache.generateKey('doc_qa', {
      question: item.question.trim().toLowerCase(),
      jurisdiction: 'India',
      docHash: item.docText.substring(0, 300) + item.docText.length,
    });
    documentQACache.set(key, {
      answer: item.answer,
      relevantExcerpts: item.excerpts,
      disclaimer: 'General document interpretation only. Not a substitute for formal legal representation.',
    });
  });

  // =========================================================================
  // 3. SEED COMMON ASSISTANT QUESTIONS (Flow B Instant Hits)
  // =========================================================================
  const assistantQuestionsMap: Record<string, AssistantChatResponse> = {
    'my landlord has not returned my ₹50,000 security deposit. what options do i have?': {
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
    },

    'what should i do after receiving an employment termination notice without severance?': {
      understanding:
        'You have received an employment termination notice where the employer is refusing or omitting statutory notice pay, gratuity, or severance benefits. Under labour laws, involuntary termination without cause mandates statutory notice or equivalent wage payout in lieu.',
      relevantLegalConcepts: [
        {
          concept: 'Notice Period Wages and Retrenchment Compensation',
          statuteOrRule: 'Industrial Relations Code & Industrial Disputes Act, 1947',
          explanation:
            'Employees retrenched without proven misconduct are entitled to notice pay (or notice period worked) plus 15 days average pay for every completed year of service.',
        },
        {
          concept: 'Mandatory Timetable for Full & Final Settlement',
          statuteOrRule: 'Payment of Wages Act, 1936',
          explanation:
            'Wages and accrued earned leave must be disbursed within the statutory period (typically 7 to 30 days) of termination.',
        },
      ],
      possibleNextSteps: [
        {
          stepNumber: 1,
          title: 'Preserve Records Before IT Access Cutoff',
          description:
            'Immediately download your appointment letter, appraisal ratings, pay slips, and termination notice to personal storage.',
          priority: 'High',
        },
        {
          stepNumber: 2,
          title: 'Reply in Writing Rejecting Unlawful Forfeiture',
          description:
            'Submit a written response noting that termination without severance violates contract terms and applicable wage enactments.',
          priority: 'High',
        },
        {
          stepNumber: 3,
          title: 'Lodge Conciliation Grievance via Samadhan',
          description:
            'File an online conciliation dispute on the Ministry of Labour’s Samadhan portal to initiate free government mediation.',
          priority: 'Medium',
        },
      ],
      documentsToCollect: [
        {
          documentName: 'Appointment Letter & Amendments',
          purpose: 'Establishes agreed notice period and termination terms.',
          whereToObtain: 'Personal employment archives.',
        },
        {
          documentName: 'Last 6 Months Pay Slips',
          purpose: 'Calculates exact severance rate and accrued earned leave value.',
          whereToObtain: 'HR payroll portal or bank statements.',
        },
      ],
      importantConsiderations: {
        deadlines: [
          '30-day window standard for full and final clearance',
          '3-year limitation under Limitation Act 1963 for unpaid salary recovery',
        ],
        jurisdictionNotes: 'Applicable under State Shops & Establishments Act and Central labour regulations.',
        uncertaintyFactors: [
          'Managerial or supervisory roles above statutory wage caps may need civil remedy if excluded from workman definitions.',
        ],
      },
      sources: [
        {
          name: 'Ministry of Labour & Employment - Samadhan Portal',
          provision: 'Conciliation and grievance redressal for workers',
          url: 'https://samadhan.labour.gov.in',
          note: 'Central Government labour disputes portal',
        },
      ],
      disclaimer: 'General legal information only. Consult an employment advocate for formal proceedings.',
    },

    'what does section 27 of the indian contract act mean regarding non-compete clauses?': {
      understanding:
        'Section 27 of the Indian Contract Act, 1872 enacts that every agreement by which anyone is restrained from exercising a lawful profession, trade, or business of any kind, is to that extent void. In India, post-employment non-compete restrictions are strictly unenforceable.',
      relevantLegalConcepts: [
        {
          concept: 'Absolute Voidness of Post-Termination Restraint',
          statuteOrRule: 'Indian Contract Act, 1872 (Section 27)',
          explanation:
            'Unlike Western jurisdictions that balance reasonableness of non-competes, Indian law adopts an absolute bar on post-employment trade restraints.',
        },
        {
          concept: 'Non-Disclosure vs Non-Compete Distinction',
          statuteOrRule: 'Judicial precedent (Percept D’Mark v. Zaheer Khan, Niranjan Shankar Golikari)',
          explanation:
            'While confidentiality, trade secrets, and non-solicitation during employment can be enforced, prohibiting an ex-employee from taking a new job is void.',
        },
      ],
      possibleNextSteps: [
        {
          stepNumber: 1,
          title: 'Distinguish Confidentiality from Restraint of Trade',
          description:
            'Ensure you return all company data and confidential files while asserting your legal right to work for a competitor.',
          priority: 'High',
        },
        {
          stepNumber: 2,
          title: 'Cite Supreme Court Precedents in Response',
          description:
            'If threatened with an injunction or withholding of experience letter, formally respond citing Section 27 and Supreme Court precedents.',
          priority: 'Medium',
        },
      ],
      documentsToCollect: [
        {
          documentName: 'Employment Agreement Non-Compete Clause',
          purpose: 'Reviews the exact restrictive covenant language.',
          whereToObtain: 'Employment contract copy.',
        },
      ],
      importantConsiderations: {
        deadlines: ['Prompt response required if employer issues an interim cease-and-desist notice'],
        jurisdictionNotes: 'Applies uniformly across all Indian States under Central contract law.',
        uncertaintyFactors: [
          'Misappropriation of verifiable source code or patented trade secrets is actionable under tort/IP law even without a valid non-compete.',
        ],
      },
      sources: [
        {
          name: 'India Code - Indian Contract Act, 1872',
          provision: 'Section 27',
          url: 'https://www.indiacode.nic.in/handle/123456789/2187',
          note: 'Central statutory repository',
        },
      ],
      disclaimer: 'General educational explanation of statutory principles. Consult counsel for specific disputes.',
    },

    'the brand refuses to repair or refund my defective refrigerator after 2 weeks. what are my consumer rights?': {
      understanding:
        'You purchased a refrigerator that experienced defects within two weeks, and both retailer and manufacturer are refusing resolution. Under the Consumer Protection Act, 2019, selling defective goods and failing to provide contracted warranty service constitutes deficiency of service and unfair trade practice.',
      relevantLegalConcepts: [
        {
          concept: 'Deficiency of Service & Product Liability',
          statuteOrRule: 'Consumer Protection Act, 2019 (Sections 2(11), 84-86)',
          explanation:
            'Manufacturers and sellers are jointly responsible for defective goods and must repair, replace, or refund within a reasonable timeframe.',
        },
        {
          concept: 'National Consumer Grievance Mechanism',
          statuteOrRule: 'Consumer Protection Rules & NCH Framework',
          explanation:
            'Consumers can register immediate zero-cost complaints via the National Consumer Helpline (1915) before filing in District Commission.',
        },
      ],
      possibleNextSteps: [
        {
          stepNumber: 1,
          title: 'File Grievance on National Consumer Helpline (NCH)',
          description:
            'Call 1915 or file on consumerhelpline.gov.in. Brands are registered convergence partners and frequently resolve tickets within 10 days.',
          priority: 'High',
        },
        {
          stepNumber: 2,
          title: 'Issue Formal Notice Demanding Refund or Replacement',
          description:
            'Send an email to the customer grievance officer and store manager giving 7 days to replace or refund ₹42,990.',
          priority: 'High',
        },
        {
          stepNumber: 3,
          title: 'File e-Daakhil Complaint before District Commission',
          description:
            'If unresolved, file an online complaint at edaakhil.nic.in claiming replacement plus compensation for food spoilage.',
          priority: 'Medium',
        },
      ],
      documentsToCollect: [
        {
          documentName: 'Purchase Invoice & Payment Receipt',
          purpose: 'Proves date of purchase, warranty coverage, and price paid.',
          whereToObtain: 'Store receipt or digital invoice.',
        },
        {
          documentName: 'Service Job Sheet & Photo Evidence',
          purpose: 'Documents technician’s inspection confirming defect.',
          whereToObtain: 'Service technician report or SMS ticket link.',
        },
      ],
      importantConsiderations: {
        deadlines: ['2-year limitation period to file before District Consumer Commission under Section 69'],
        jurisdictionNotes: 'File in the District Commission where you reside or where the purchase was made.',
        uncertaintyFactors: ['Keep date-stamped photos of spoiled food to substantiate damage claims.'],
      },
      sources: [
        {
          name: 'National Consumer Helpline (NCH)',
          provision: 'Direct consumer redressal portal (consumerhelpline.gov.in / 1915)',
          url: 'https://consumerhelpline.gov.in',
          note: 'Government consumer grievance portal',
        },
      ],
      disclaimer: 'General consumer information only. Not a formal court pleading.',
    },

    'what documents and evidence should i collect before sending a formal legal notice?': {
      understanding:
        'Before drafting or dispatching a formal legal notice, having complete, chronological, and verifiable evidence is critical. A legal notice without documentary foundation weakens your position and limits pre-litigation settlement leverage.',
      relevantLegalConcepts: [
        {
          concept: 'Evidentiary Chain of Custody & Admissibility',
          statuteOrRule: 'Bharatiya Sakshya Adhiniyam, 2023 / Indian Evidence Act',
          explanation:
            'Documentary evidence (contracts, receipts) and electronic records (emails, WhatsApp, SMS) must be properly preserved with dates and certificates.',
        },
        {
          concept: 'Statutory Demand Period',
          statuteOrRule: 'Code of Civil Procedure & Specific Relief Act',
          explanation:
            'Standard legal notices provide a 15-day or 30-day notice period for the recipient to remedy breach prior to court filing.',
        },
      ],
      possibleNextSteps: [
        {
          stepNumber: 1,
          title: 'Construct a Chronological Dispute Timeline',
          description:
            'Write down all key dates: agreement signing, payment date, breach date, and communication attempts.',
          priority: 'High',
        },
        {
          stepNumber: 2,
          title: 'Export Unaltered Digital Communications',
          description:
            'Export full email threads with headers and back up chat conversations containing admissions or promises.',
          priority: 'High',
        },
        {
          stepNumber: 3,
          title: 'Calculate Exact Financial Claims & Statutory Interest',
          description:
            'Itemize principal amount, interest rate claimable, and incidental expenses with bills.',
          priority: 'Medium',
        },
      ],
      documentsToCollect: [
        {
          documentName: 'Primary Contract or Invoice',
          purpose: 'Proves existence of bilateral legal relationship.',
          whereToObtain: 'Personal archives or email trail.',
        },
        {
          documentName: 'Bank Statements & Payment Proofs',
          purpose: 'Establishes conclusive proof of consideration paid.',
          whereToObtain: 'Bank netbanking or UPI portal.',
        },
      ],
      importantConsiderations: {
        deadlines: ['Ensure legal notice is served well before limitation expiry (typically 3 years for contracts)'],
        jurisdictionNotes: 'Notice should be sent via Registered Speed Post with Acknowledgment Due (RPAD) and email.',
        uncertaintyFactors: ['Avoid exaggerated claims that contradict written records.'],
      },
      sources: [
        {
          name: 'National Legal Services Authority (NALSA)',
          provision: 'Pre-litigation counseling and legal notice assistance',
          url: 'https://nalsa.gov.in',
          note: 'Statutory authority providing legal aid',
        },
      ],
      disclaimer: 'General legal procedural guide. Consult an advocate to issue binding legal notices.',
    },
  };

  // Seed all assistant questions
  Object.entries(assistantQuestionsMap).forEach(([q, res]) => {
    const key = ResponseCache.generateKey('assistant', { question: q, jurisdiction: 'India' });
    assistantCache.set(key, res);
    // Also seed variations
    const keyVar = ResponseCache.generateKey('assistant', { question: q.replace('?', ''), jurisdiction: 'India' });
    assistantCache.set(keyVar, res);
  });

  // Also seed shorthand queries
  const depositKey = ResponseCache.generateKey('assistant', {
    question: 'my landlord is refusing to return my security deposit. what are my options?',
    jurisdiction: 'India',
  });
  assistantCache.set(depositKey, assistantQuestionsMap['my landlord has not returned my ₹50,000 security deposit. what options do i have?']);

  // =========================================================================
  // 4. SEED SAMPLE ISSUE INTAKE SCENARIOS (Flow Instant Hits)
  // =========================================================================
  const intakeScenarios: Array<{ text: string; resp: IssueClassificationResponse }> = [
    {
      text: "My employer hasn't paid my salary for two months and is refusing to issue my experience letter unless I forfeit my severance.",
      resp: {
        category: 'Employment',
        specificIssue: 'Unpaid Wages and Restraint on Relieving Letter',
        urgencyLevel: 'High',
        summary:
          'Your dispute involves non-payment of earned wages by your employer for two consecutive months combined with an unlawful refusal to issue an experience/relieving letter unless you forfeit severance.',
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
      },
    },
    {
      text: "My landlord has kept my ₹45,000 security deposit for arbitrary wall painting even though I stayed for 2 years with normal wear and tear.",
      resp: {
        category: 'Rental / Housing',
        specificIssue: 'Unlawful Retention of Security Deposit for Normal Wear and Tear',
        urgencyLevel: 'Medium',
        summary:
          'Your landlord has arbitrarily retained ₹45,000 from your refundable tenancy deposit for repainting walls after a 2-year tenancy, in violation of standard tenancy protections against deductions for natural wear and tear.',
        informationNeeded: [
          {
            field: 'Executed Lease Copy',
            question: 'Do you have the signed rent agreement and deposit clause?',
            importance: 'Establishes refund timeline and specific covenants regarding maintenance.',
          },
          {
            field: 'Move-out Inspection Photos',
            question: 'Did you photograph or video the walls when vacating the property?',
            importance: 'Proves absence of extraordinary damage beyond natural habitation weathering.',
          },
        ],
        immediateActions: [
          {
            stepNumber: 1,
            action: 'Send Written 15-Day Demand Notice to Landlord',
            reason: 'Establishes formal dispute notice demanding refund plus interest before filing petition.',
          },
          {
            stepNumber: 2,
            action: 'Petition Local Rent Authority / Rent Court',
            reason: 'Fast-track summary dispute resolution under Model Tenancy Act provisions.',
          },
        ],
        evidenceToPreserve: [
          'Signed lease agreement',
          'Bank transfer receipt for ₹45,000 deposit',
          'Move-out photos/videos and WhatsApp communication trail',
        ],
        potentialApplicableLaws: [
          'Model Tenancy Act (Security deposit caps & 30-day refund covenant)',
          'Indian Contract Act, 1872 (Section 73)',
          'State Rent Control Act',
        ],
        jurisdiction: 'India',
      },
    },
    {
      text: "I purchased an air conditioner that broke down within 10 days of delivery. The retailer refuses a refund and says parts are out of stock indefinitely.",
      resp: {
        category: 'Consumer',
        specificIssue: 'Defective Appliance and Refusal of Statutory Replacement/Refund',
        urgencyLevel: 'High',
        summary:
          'You purchased an air conditioner that suffered total failure within 10 days of delivery. The retailer’s refusal to replace or refund due to indefinite parts back-order constitutes deficiency of service under consumer protection law.',
        informationNeeded: [
          {
            field: 'Invoice & Service Ticket',
            question: 'Do you have the purchase tax invoice and technician service job sheet?',
            importance: 'Demonstrates purchase date, payment amount, and technician finding of internal defect.',
          },
        ],
        immediateActions: [
          {
            stepNumber: 1,
            action: 'Log Complaint on National Consumer Helpline (1915 / consumerhelpline.gov.in)',
            reason: 'Immediate government mediation channel with high brand convergence rate.',
          },
          {
            stepNumber: 2,
            action: 'Submit e-Daakhil Online Petition',
            reason: 'Initiate formal District Consumer Commission adjudication for refund plus compensation.',
          },
        ],
        evidenceToPreserve: [
          'Tax invoice and payment transaction receipt',
          'Service engineer report confirming product failure',
          'Customer care emails and call logs',
        ],
        potentialApplicableLaws: [
          'Consumer Protection Act, 2019 (Sections 2(7), 84, 85, 86)',
          'Consumer Protection (E-Commerce) Rules',
        ],
        jurisdiction: 'India',
      },
    },
    {
      text: "An unauthorized micro-lending app is making defamatory calls to my phone contacts claiming I owe a loan I never applied for.",
      resp: {
        category: 'Cybercrime',
        specificIssue: 'Digital Extortion, Contact Scraping, and Identity Fraud',
        urgencyLevel: 'Immediate Danger',
        summary:
          'You are experiencing criminal harassment and defamation from an unauthorized digital lending application that scraped your contacts and is extorting payments for a fraudulent loan.',
        informationNeeded: [
          {
            field: 'App Name and APK / Store Link',
            question: 'What is the name of the app and how was it installed?',
            importance: 'Determines if the lender is RBI-regulated or an illegal offshore syndicate.',
          },
          {
            field: 'Caller Numbers and Extortion Messages',
            question: 'Have you recorded audio or screenshots of threatening messages sent to contacts?',
            importance: 'Conclusive evidence for cyber police FIR registration under IT Act.',
          },
        ],
        immediateActions: [
          {
            stepNumber: 1,
            action: 'Call 1930 Cyber Fraud Helpline and File on cybercrime.gov.in Immediately',
            reason: 'Registers official cyber extortion incident and flags scam mobile numbers.',
          },
          {
            stepNumber: 2,
            action: 'Revoke App Permissions & Uninstall',
            reason: 'Prevents further unauthorized access to phone contacts and camera.',
          },
          {
            stepNumber: 3,
            action: 'Send Broadcast Notice to Contacts',
            reason: 'Informs contacts that your identity was spoofed and advises them to block extortion calls.',
          },
        ],
        evidenceToPreserve: [
          'Screenshots of defamatory messages sent to relatives/friends',
          'Phone numbers used by callers and audio recordings of threats',
          'Credit bureau report (CIBIL/Experian) showing no legitimate loan sanction',
        ],
        potentialApplicableLaws: [
          'Information Technology Act, 2000 (Section 66C, 66D: Identity theft and cheating)',
          'Bharatiya Nyaya Sanhita, 2023 (Extortion, Criminal Intimidation, Defamation)',
          'RBI Guidelines on Digital Lending (Mandatory RE/LSP registration)',
        ],
        jurisdiction: 'India',
      },
    },
    {
      text: "My company hasn't paid my salary for 2 months and says I cannot leave without paying them.",
      resp: {
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
        ],
        evidenceToPreserve: [
          'Appointment contract, CTC sheet, and company policy handbook',
          'Bank statement showing missing credit entries for the 2 months',
        ],
        potentialApplicableLaws: [
          'Payment of Wages Act, 1936 (Mandatory monthly wage disbursement)',
          'Industrial Relations Code / Shops & Establishments Act',
          'Indian Contract Act, 1872 (Section 27: Voidness of restrictive covenants)',
        ],
        jurisdiction: 'India',
      },
    },
  ];

  intakeScenarios.forEach((item) => {
    const key = ResponseCache.generateKey('intake', {
      situation: item.text.trim().toLowerCase(),
      jurisdiction: 'India',
    });
    issueClassificationCache.set(key, item.resp);
  });
}
