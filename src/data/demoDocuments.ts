export interface DemoDocument {
  id: string;
  title: string;
  category: string;
  jurisdiction: string;
  description: string;
  content: string;
}

export const DEMO_DOCUMENTS: DemoDocument[] = [
  {
    id: 'rental-deposit-dispute',
    title: 'Sample Residential Tenancy Agreement (Deposit Dispute)',
    category: 'Rental / Housing',
    jurisdiction: 'India',
    description: 'A 2-bedroom residential lease agreement where the landlord retains a ₹50,000 security deposit for arbitrary painting and wear-and-tear.',
    content: `RESIDENTIAL LEASE AND TENANCY AGREEMENT

This Tenancy Agreement is entered into on the 1st day of April 2025 at Bangalore, Karnataka, by and between:
1. MR. S. K. SHARMA, residing at Indiranagar, Bangalore (hereinafter referred to as the "LESSOR / LANDLORD")
AND
2. MS. PRIYA RAMESH, residing at Koramangala, Bangalore (hereinafter referred to as the "LESSEE / TENANT").

WHEREAS the Lessor is the absolute owner of the residential flat located at Flat 302, Green Meadows, Koramangala 4th Block, Bangalore - 560034 (hereinafter referred to as the "Scheduled Premises").

NOW THIS AGREEMENT WITNESSETH AS FOLLOWS:

1. TERM AND TENURE:
The lease shall be for a duration of 11 (eleven) months commencing from 1st April 2025 to 28th February 2026. Either party may renew this agreement with a 10% rent escalation subject to mutual written consent.

2. MONTHLY RENT AND UTILITIES:
The Tenant agrees to pay a monthly rent of INR 28,000 (Twenty-Eight Thousand Rupees only), payable in advance on or before the 5th day of every calendar month via bank electronic transfer. Utility charges including electricity and water shall be paid directly by the Tenant based on actual consumption.

3. SECURITY DEPOSIT AND DEDUCTIONS:
The Tenant has deposited an interest-free refundable security deposit of INR 50,000 (Fifty Thousand Rupees only) with the Landlord. The Landlord covenants to refund the said deposit within 30 days of the Tenant peaceably handing over vacant possession of the premises, SUBJECT TO deductions for:
(a) Unpaid electricity or maintenance dues.
(b) Extraordinary damages to the fixtures or walls caused solely by gross negligence.
CRITICAL NOTE: Natural wear and tear resulting from ordinary habitation shall NOT be subject to deduction. The Landlord must provide itemized contractor bills and photographic evidence for any claimed deductions exceeding INR 2,000.

4. NOTICE PERIOD AND TERMINATION:
Either party may terminate this agreement prior to expiry of the 11-month term by serving 1 (one) full calendar month advance written notice, or by paying one month's rent in lieu of such notice.

5. INSPECTION AND VACATING PROTOCOL:
At least 7 days prior to vacating, both parties shall conduct a joint walkthrough inspection and sign a joint Handover Certificate noting the electricity meter reading and condition of fixtures.

6. DISPUTE RESOLUTION:
In the event of any dispute or unpaid deposit recovery arising out of this agreement, the dispute shall be referred to the competent Rent Court / Rent Authority constituted under the Model Tenancy Act / Karnataka Rent Act, and jurisdiction shall vest exclusively in the courts of Bangalore.

IN WITNESS WHEREOF, the parties hereto have set their hands on the date and year first above written.

Lessor: [Sd/- S. K. Sharma]
Lessee: [Sd/- Priya Ramesh]
Witness 1: [R. Verma]
Witness 2: [A. Sen]`,
  },
  {
    id: 'employment-severance-dispute',
    title: 'Sample Employment Contract & Notice (Unpaid Severance)',
    category: 'Employment',
    jurisdiction: 'India',
    description: 'An executive employment agreement with clauses governing 60-day notice, non-compete covenants, and pending salary settlements.',
    content: `EMPLOYMENT AND CONFIDENTIALITY AGREEMENT

Date: 15th January 2024
Company: CloudPulse Technologies Private Limited, Cyber City, Gurugram, Haryana
Employee: Rohan Nair, Senior Systems Engineer

1. APPOINTMENT AND REMUNERATION:
The Company hereby employs you as a full-time Senior Systems Engineer with an Annual Gross Cost to Company (CTC) of INR 14,40,000 (Fourteen Lakhs Forty Thousand Rupees), payable in monthly installments on the last working day of each calendar month.

2. PROBATION AND CONFIRMATION:
The Employee shall serve a probation period of 3 (three) months. Following successful performance review, employment shall be confirmed in writing.

3. TERMINATION AND NOTICE PERIOD:
After confirmation, either party may terminate employment by giving 60 (sixty) days prior written notice to the other party, or payment of gross salary in lieu of notice.
In the event of termination without cause by the Company:
(a) The Company shall provide 60 days advance notice or immediate salary payout in lieu thereof.
(b) The Company shall disburse all accrued gratuity, earned leave encashment, and pending monthly salary within 30 days of the last working day (Full and Final Settlement).

4. NON-COMPETE AND RESTRAINT OF TRADE (SECTION 27):
Clause 4.2 states: "For a period of 12 months post-employment, the Employee shall not work for any competitor firm in India."
[LEGAL NOTE: Under Section 27 of the Indian Contract Act 1872, post-employment restrictive non-compete covenants are generally void and unenforceable as restraints on lawful trade/profession.]

5. COMPANY PROPERTY AND DATA RETURN:
Upon notice of termination, the Employee agrees to return all laptops, cryptographic tokens, and confidential project repositories within 5 business days.

6. GOVERNING LAW & JURISDICTION:
This agreement is governed by the laws of India and relevant labour enactments including the Payment of Wages Act, 1936. Courts at Gurugram, Haryana shall have jurisdiction.

Authorized Signatory: [CloudPulse HR Services]
Employee Acceptance: [Rohan Nair]`,
  },
  {
    id: 'consumer-warranty-claim',
    title: 'Sample Consumer Warranty & Purchase Agreement (Defective Good)',
    category: 'Consumer',
    jurisdiction: 'India',
    description: 'An appliance purchase invoice and warranty covenant where the manufacturer refuses refund or replacement for a defective refrigerator within 14 days.',
    content: `CONSUMER PURCHASE INVOICE & COMPREHENSIVE WARRANTY POLICY

Retailer: MegaAppliance World Electronics LLP, Connaught Place, New Delhi
Customer: Ananya Gupta, Saket, New Delhi
Tax Invoice No: MAW-2025-88421
Date of Purchase: 10th August 2025
Item: FrostWave Double-Door 450L Smart Refrigerator (Model: FW-450X)
Total Amount Paid: INR 42,990 (Inclusive of 18% GST)
Payment Mode: Unified Payments Interface (UPI) - Transaction Ref: 521990421882

TERMS OF LIMITED WARRANTY & STATUTORY RIGHTS:

1. 1-YEAR COMPREHENSIVE WARRANTY:
The manufacturer (FrostWave Appliances India Ltd) warrants this product against defects in materials and manufacturing for a period of 12 months from the date of invoice.

2. REPAIR, REPLACEMENT, OR REFUND OBLIGATION:
Under the Consumer Protection Act, 2019 (Sections 2(7), 84, and 85):
(a) If a catastrophic defect or total cooling failure occurs within 30 days of installation, the consumer has the explicit right to demand a replacement unit or a full refund without deduction of depreciation.
(b) Authorized service engineers must inspect the appliance within 48 hours of ticket generation.
(c) If the manufacturer fails to rectify the defect within 14 business days, the consumer may seek refund and compensation through the National Consumer Helpline (consumerhelpline.gov.in) or e-Daakhil consumer commission.

3. DEFECT LOG & CLAIM HISTORY:
- 12th August 2025: Appliance delivered and installed.
- 16th August 2025: Compressor ceased cooling; food spoiled. Service Ticket #FW-9921 logged.
- 20th August 2025: Technician inspected and confirmed internal gas leak and faulty compressor coil.
- 28th August 2025: Retailer and manufacturer denied replacement, claiming "parts on back-order indefinitely".

4. STATUTORY LIMITATION:
Under Section 69 of the Consumer Protection Act, 2019, a consumer complaint may be filed within 2 (two) years from the date on which the cause of action arose.

Authorized Seal: MegaAppliance World Electronics LLP
Customer Copy Received: [Ananya Gupta]`,
  },
];
