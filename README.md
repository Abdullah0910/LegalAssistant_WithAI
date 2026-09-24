# LegalEase AI - AI for Legal Assistance & Access

> **"Understand the law. Know your options."**
> A production-quality, accessible web application that empowers everyday users (tenants, employees, consumers, students, small businesses) to navigate complex legal documents, understand their statutory rights, classify disputes, and execute structured next steps without legalese.

---

## 1. Project Overview

Navigating legal challenges—such as withheld tenancy security deposits, unfair employment termination, or warranty denials—is often intimidating, expensive, and linguistically inaccessible. 

**LegalEase AI** solves this problem by providing:
1. **AI Legal Assistant**: Conversational Q&A delivering plain-English explanations, applicable public statutes, ordered next-step checklists, evidence requirements, and statutory deadlines.
2. **Legal Document Analyzer**: In-memory parsing of PDF, DOCX, and TXT files, categorizing clauses with clear visual badges (`Termination Clause`, `Payment Obligation`, `Important Date`, `Notice Requirement`), extracting mutual obligations, highlighting red flags, and supporting grounded follow-up Q&A.
3. **Legal Issue Classifier & Guided Intake**: Natural language intake taxonomy across 12 legal domains (Employment, Consumer, Rental, Contract, Cybercrime, etc.) that asks only essential missing details and produces a tailored action plan.
4. **Jurisdiction Awareness**: Tailored to statutory frameworks (Default: **India** [Model Tenancy Act, Consumer Protection Act 2019, Contract Act 1872, Payment of Wages Act], with support for US, UK, Canada, and International).
5. **Authoritative Statutory Grounding**: Direct references to real, official government portals (India Code, e-Daakhil, NALSA Free Legal Aid, e-Courts). **Zero hallucinated citations.**
6. **Responsible AI & Safety Safeguards**: Explicit distinction between legal information and legal representation, zero document logging, prompt injection protection, and instant emergency helpline triggers (112, 1930, 1091, 15100).

---

## 2. Architecture & Data Flow

```mermaid
graph TD
    User([User Browser]) <-->|React 19 / Tailwind CSS| UI[LegalEase Frontend]
    UI <-->|REST API JSON /api/*| Server[Express Backend - server.ts]

    subgraph Security & Middleware
        Server --> RateLimit[Sliding-Window Rate Limiter]
        Server --> Sanitizer[Prompt Injection & XSS Guard]
        Server --> FileSec[MIME & 10MB Size Validator]
    end

    subgraph Application Services
        Server --> DocSvc[Document Text Extractor (mammoth/buffer)]
        Server --> AISvc[AI Legal Intelligence Service]
        Server --> SourcesReg[Authoritative Statutory Registry]
    end

    subgraph GenAI Engine
        AISvc --> GeminiSDK[@google/genai TypeScript SDK]
        GeminiSDK --> GeminiModel[gemini-3.8-flash]
        AISvc --> FallbackEngine[Statutory Deterministic Fallback Engine]
    end
```

---

## 3. Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons, Plus Jakarta Sans & Newsreader typography.
- **Backend**: Node.js, Express, tsx.
- **GenAI Provider**: Google GenAI TypeScript SDK (`@google/genai`) using `gemini-3.8-flash` with strictly enforced JSON schemas.
- **Document Processing**: `mammoth` (DOCX extraction), text buffer parsing, and base64 handling for PDFs.
- **Testing**: `vitest` unit, security, and integration test suites.
- **Security**: In-memory rate limiting, adversarial prompt injection filtering, strict file validation, zero document logging.

---

## 4. Getting Started & Setup

### Prerequisites
- Node.js 20+
- A Google Gemini API Key (configured automatically in AI Studio or via `.env`)

### Installation & Run

```bash
# 1. Clone or open the repository
cd legalease-ai

# 2. Install dependencies
npm install

# 3. Configure environment variables (copy .env.example)
cp .env.example .env

# 4. Start the full-stack development server (Port 3000)
npm run dev

# 5. Build for production
npm run build

# 6. Run production server
npm start
```

---

## 5. Running Tests

Testing is explicitly evaluated. The test suite covers unit logic, prompt injection protection, file validation, and integration flows:

```bash
# Run all tests once with Vitest
npm test

# Run tests in watch mode
npm run test:watch

# Validate TypeScript type safety and linting
npm run lint
```

### Test Coverage Highlights:
- **Unit Tests (`tests/unit.test.ts`)**: Input sanitization, path traversal prevention, file validation rules, authoritative source retrieval.
- **Security Tests (`tests/security.test.ts`)**: Prompt injection neutralization ("ignore previous instructions", "reveal system prompt", DAN mode), file size bounds, XSS script scrubbing, filename injection prevention.
- **Integration Tests (`tests/integration.test.ts`)**: Document extraction, structured AI legal assistant analysis, dispute classification with follow-up questions.

---

## 6. Security & Responsible AI Controls

1. **API Key Isolation**: Gemini API keys are accessible exclusively server-side via `process.env.GEMINI_API_KEY`.
2. **Prompt Injection Guard**: User documents are enclosed in `<untrusted_document_content>` tags, sanitized for adversarial directives, and capped at 100,000 characters.
3. **File Safety**: Uploads are restricted to PDF, DOCX, and TXT ($\le 10\text{MB}$), processed in transient memory, and never executed or written to permanent disk.
4. **Privacy**: Zero logging of document contents, passwords, or personal identifying information.
5. **No Hallucinated Citations**: The AI model is strictly constrained against fabricating statutes or case citations. Where verification is unavailable, it explicitly states so.
6. **Crisis Intervention**: Prominent hotline triggers for emergency police (112), cyber fraud (1930), women in distress (1091), and NALSA legal aid (15100).

---

## 7. Synthetic Demo Scenarios

Three pre-packaged synthetic agreements are available for 1-click testing:
1. **Sample Residential Tenancy Agreement**: Deposit dispute involving ₹50,000 held for ordinary wear-and-tear.
2. **Sample Employment Agreement & Notice**: Unpaid 60-day severance payout and non-compete clause evaluation.
3. **Sample Consumer Warranty Claim**: Purchase invoice with refused replacement for a defective refrigerator within statutory warranty.

---

## 8. License

Apache-2.0 License.
