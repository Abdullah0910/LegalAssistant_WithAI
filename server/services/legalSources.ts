export interface LegalSource {
  id: string;
  name: string;
  category: string;
  jurisdiction: string;
  relevantProvision?: string;
  url: string;
  description: string;
  authorityType: 'Government Legislation' | 'Judiciary' | 'Regulatory Agency' | 'Legal Aid / Public Assistance' | 'Official Helpline';
  lastVerifiedDate: string;
}

export interface EmergencyResource {
  name: string;
  jurisdiction: string;
  contactNumber: string;
  portalUrl?: string;
  purpose: string;
  category: 'Immediate Danger' | 'Women Helpline' | 'Cyber Fraud' | 'Child Protection' | 'Senior Citizens';
}

export const EMERGENCY_RESOURCES: EmergencyResource[] = [
  {
    name: 'National Emergency Response System (Pan-India)',
    jurisdiction: 'India',
    contactNumber: '112',
    portalUrl: 'https://112.gov.in',
    purpose: 'Immediate emergency police, fire, or medical distress assistance',
    category: 'Immediate Danger',
  },
  {
    name: 'National Cyber Crime Reporting Helpline',
    jurisdiction: 'India',
    contactNumber: '1930',
    portalUrl: 'https://cybercrime.gov.in',
    purpose: 'Financial cyber fraud reporting within golden hours and online abuse assistance',
    category: 'Cyber Fraud',
  },
  {
    name: 'Women in Distress National Helpline (NCW)',
    jurisdiction: 'India',
    contactNumber: '7827170170 / 1091',
    portalUrl: 'http://ncw.nic.in',
    purpose: 'Domestic violence, sexual harassment, and emergency crisis intervention',
    category: 'Women Helpline',
  },
  {
    name: 'National Legal Aid Toll-Free Helpline (NALSA)',
    jurisdiction: 'India',
    contactNumber: '15100',
    portalUrl: 'https://nalsa.gov.in',
    purpose: 'Free legal aid and representation for marginalized citizens, women, workers, and undertrials',
    category: 'Immediate Danger',
  },
  {
    name: 'Emergency Services (USA)',
    jurisdiction: 'United States',
    contactNumber: '911',
    portalUrl: 'https://www.usa.gov',
    purpose: 'Emergency dispatch for police, fire, and medical situations',
    category: 'Immediate Danger',
  },
  {
    name: 'National Domestic Violence Hotline (USA)',
    jurisdiction: 'United States',
    contactNumber: '1-800-799-7233',
    portalUrl: 'https://www.thehotline.org',
    purpose: '24/7 confidential support for domestic violence and crisis safety planning',
    category: 'Women Helpline',
  },
];

export const AUTHORITATIVE_SOURCES: LegalSource[] = [
  // India Sources
  {
    id: 'in-code',
    name: 'India Code - Digital Repository of All Central and State Acts',
    category: 'General / Legislation',
    jurisdiction: 'India',
    relevantProvision: 'Central Acts repository including Contract Act, Consumer Protection, Labour Codes',
    url: 'https://www.indiacode.nic.in',
    description: 'Official Government of India portal for all enacted central and state legislation, notifications, and statutory amendments.',
    authorityType: 'Government Legislation',
    lastVerifiedDate: '2026-09-01',
  },
  {
    id: 'in-nalsa',
    name: 'National Legal Services Authority (NALSA)',
    category: 'Legal Aid',
    jurisdiction: 'India',
    relevantProvision: 'Legal Services Authorities Act, 1987 (Free legal aid provisions Section 12)',
    url: 'https://nalsa.gov.in',
    description: 'Statutory body providing free, competent legal services to eligible weaker sections of society and organizing Lok Adalats.',
    authorityType: 'Legal Aid / Public Assistance',
    lastVerifiedDate: '2026-09-01',
  },
  {
    id: 'in-consumer',
    name: 'Department of Consumer Affairs - National Consumer Helpline (NCH)',
    category: 'Consumer',
    jurisdiction: 'India',
    relevantProvision: 'Consumer Protection Act, 2019 (Sections 2(7), 35, 84 Product Liability)',
    url: 'https://consumerhelpline.gov.in',
    description: 'Official Government grievance portal for unfair trade practices, defective goods, service deficiencies, and e-daakhil filing.',
    authorityType: 'Regulatory Agency',
    lastVerifiedDate: '2026-09-01',
  },
  {
    id: 'in-edaakhil',
    name: 'e-Daakhil Portal (Consumer Dispute Redressal Commissions)',
    category: 'Consumer',
    jurisdiction: 'India',
    relevantProvision: 'E-filing platform for District, State, and National Consumer Commissions',
    url: 'https://edaakhil.nic.in',
    description: 'Official online dispute filing system allowing consumers to file complaints before consumer commissions without physical court appearance.',
    authorityType: 'Judiciary',
    lastVerifiedDate: '2026-09-01',
  },
  {
    id: 'in-tenancy',
    name: 'Ministry of Housing and Urban Affairs - Model Tenancy Act',
    category: 'Rental / Housing',
    jurisdiction: 'India',
    relevantProvision: 'Model Tenancy Act provisions regarding security deposit caps (max 2 months for residential) and Rent Court adjudication',
    url: 'https://mohua.gov.in',
    description: 'Official framework for state rent regulation, eviction protections, security deposit retention rules, and landlord-tenant rights.',
    authorityType: 'Government Legislation',
    lastVerifiedDate: '2026-09-01',
  },
  {
    id: 'in-labour',
    name: 'Ministry of Labour & Employment (SAMADHAN & Shram Suvidha)',
    category: 'Employment',
    jurisdiction: 'India',
    relevantProvision: 'Industrial Disputes Act / Industrial Relations Code & Payment of Wages Act, 1936',
    url: 'https://labour.gov.in',
    description: 'Central portal for labour welfare, conciliation officer grievances, wage non-payment claims, and workplace rights.',
    authorityType: 'Regulatory Agency',
    lastVerifiedDate: '2026-09-01',
  },
  {
    id: 'in-ecourts',
    name: 'eCourts Integrated Mission Mode Project',
    category: 'Civil / Criminal',
    jurisdiction: 'India',
    relevantProvision: 'District and High Court case status, cause lists, orders, and judgment verification',
    url: 'https://ecourts.gov.in',
    description: 'Official national portal providing transparent case status, certified orders, and filing data across Indian judicial courts.',
    authorityType: 'Judiciary',
    lastVerifiedDate: '2026-09-01',
  },
  {
    id: 'in-cybercrime',
    name: 'National Cyber Crime Reporting Portal',
    category: 'Cybercrime',
    jurisdiction: 'India',
    relevantProvision: 'Information Technology Act, 2000 (Sections 43, 66C, 66D, 67)',
    url: 'https://cybercrime.gov.in',
    description: 'Official platform facilitated by Ministry of Home Affairs to file complaints regarding cybercrimes, financial frauds, and digital harassment.',
    authorityType: 'Official Helpline',
    lastVerifiedDate: '2026-09-01',
  },
  {
    id: 'in-contract',
    name: 'Indian Contract Act, 1872',
    category: 'Contract',
    jurisdiction: 'India',
    relevantProvision: 'Sections 10 (Essential elements), 23 (Lawful consideration), 73-75 (Breach and damages)',
    url: 'https://www.indiacode.nic.in/handle/123456789/2187',
    description: 'Governing statute for contract validity, performance, termination notice, and monetary compensation for breach in India.',
    authorityType: 'Government Legislation',
    lastVerifiedDate: '2026-09-01',
  },

  // US Sources
  {
    id: 'us-cfpb',
    name: 'Consumer Financial Protection Bureau (CFPB)',
    category: 'Consumer',
    jurisdiction: 'United States',
    relevantProvision: 'Dodd-Frank Wall Street Reform and Consumer Protection Act',
    url: 'https://www.consumerfinance.gov',
    description: 'U.S. government agency making sure banks, lenders, and other financial companies treat consumers fairly.',
    authorityType: 'Regulatory Agency',
    lastVerifiedDate: '2026-09-01',
  },
  {
    id: 'us-lsc',
    name: 'Legal Services Corporation (LSC)',
    category: 'Legal Aid',
    jurisdiction: 'United States',
    relevantProvision: 'Public funding directory for civil legal aid to low-income Americans',
    url: 'https://www.lsc.gov',
    description: 'Federally funded legal aid non-profit providing financial support for civil legal assistance across all 50 states.',
    authorityType: 'Legal Aid / Public Assistance',
    lastVerifiedDate: '2026-09-01',
  },
  {
    id: 'us-hud',
    name: 'U.S. Department of Housing and Urban Development (HUD)',
    category: 'Rental / Housing',
    jurisdiction: 'United States',
    relevantProvision: 'Fair Housing Act (Title VIII of the Civil Rights Act of 1968)',
    url: 'https://www.hud.gov',
    description: 'Official agency administering fair housing laws, tenant rights guidelines, and state-by-state rental assistance.',
    authorityType: 'Regulatory Agency',
    lastVerifiedDate: '2026-09-01',
  },
  {
    id: 'us-eeoc',
    name: 'U.S. Equal Employment Opportunity Commission (EEOC)',
    category: 'Employment',
    jurisdiction: 'United States',
    relevantProvision: 'Title VII of the Civil Rights Act of 1964, ADA, ADEA, Equal Pay Act',
    url: 'https://www.eeoc.gov',
    description: 'Federal agency enforcing civil rights laws against workplace discrimination, harassment, and retaliatory termination.',
    authorityType: 'Regulatory Agency',
    lastVerifiedDate: '2026-09-01',
  },

  // UK Sources
  {
    id: 'uk-legislation',
    name: 'The National Archives - Legislation.gov.uk',
    category: 'General / Legislation',
    jurisdiction: 'United Kingdom',
    relevantProvision: 'Official statutory database of UK Public General Acts, Statutory Instruments, and devolved legislation',
    url: 'https://www.legislation.gov.uk',
    description: 'Official home of UK legislation maintained by The National Archives on behalf of HM Government.',
    authorityType: 'Government Legislation',
    lastVerifiedDate: '2026-09-01',
  },
  {
    id: 'uk-citizensadvice',
    name: 'Citizens Advice UK',
    category: 'Legal Aid',
    jurisdiction: 'United Kingdom',
    relevantProvision: 'Independent charity offering free, confidential advice on consumer rights, employment tribunals, housing and debt',
    url: 'https://www.citizensadvice.org.uk',
    description: 'Nationwide network of independent charities providing free legal guidance and assistance with government benefits and housing.',
    authorityType: 'Legal Aid / Public Assistance',
    lastVerifiedDate: '2026-09-01',
  }
];

export function getSourcesForQuery(jurisdiction: string = 'India', category?: string): LegalSource[] {
  let matched = AUTHORITATIVE_SOURCES.filter(
    (s) => s.jurisdiction.toLowerCase() === jurisdiction.toLowerCase()
  );

  if (category && category !== 'All') {
    const categoryMatched = matched.filter(
      (s) => s.category.toLowerCase().includes(category.toLowerCase()) || category.toLowerCase().includes(s.category.toLowerCase())
    );
    if (categoryMatched.length > 0) {
      matched = categoryMatched;
    }
  }

  // Fallback to primary jurisdiction sources if category specific not found
  if (matched.length === 0) {
    matched = AUTHORITATIVE_SOURCES.filter(
      (s) => s.jurisdiction.toLowerCase() === jurisdiction.toLowerCase()
    );
  }

  return matched;
}

export function getEmergencyHelplines(jurisdiction: string = 'India'): EmergencyResource[] {
  return EMERGENCY_RESOURCES.filter(
    (e) => e.jurisdiction.toLowerCase() === jurisdiction.toLowerCase()
  );
}
