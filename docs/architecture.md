# LegalEase AI - Architectural Design Document

## 1. System Overview

LegalEase AI is an accessible, production-grade legal intelligence web application engineered to bridge the legal access gap for non-lawyers (tenants, employees, consumers, students, small businesses). It translates opaque legal documents into plain English, classifies legal disputes, creates actionable next-step checklists, and connects citizens with statutory legal aid authorities without pretending to be a lawyer.

## 2. Architectural Diagram

```mermaid
graph TD
    Client[React 19 SPA (Vite + Tailwind CSS)]
    Client -->|HTTPS REST / JSON| Server[Express Full-Stack Server (server.ts)]

    subgraph Security Layer
        Server --> RateLimiter[Sliding-Window Rate Limiter]
        Server --> SecurityHeaders[Secure HTTP Headers]
        Server --> InjectionGuard[Adversarial Prompt Injection Sanitizer]
        Server --> FileValidator[MIME & Extension Security Validator]
    end

    subgraph Business Logic Layer
        Server --> AssistantRoute[/api/assistant/chat]
        Server --> DocAnalyzeRoute[/api/documents/analyze]
        Server --> DocQARoute[/api/documents/qa]
        Server --> IntakeRoute[/api/classifier/intake]
        Server --> ResourcesRoute[/api/resources/list]
    end

    subgraph Services & Intelligence Layer
        DocAnalyzeRoute --> DocService[Document Extraction Service (mammoth/text)]
        AssistantRoute --> AIService[AI Service Layer]
        DocAnalyzeRoute --> AIService
        DocQARoute --> AIService
        IntakeRoute --> AIService
        AIService --> GeminiSDK[@google/genai TypeScript SDK - gemini-3.8-flash]
        ResourcesRoute --> LegalSourcesRegistry[Authoritative Statutory & Legal Aid Registry]
    end

    subgraph Data & Fallbacks
        AIService --> StructuredValidator[Zod / Schema Validator]
        AIService --> DeterministicEngine[Deterministic Statutory Fallback Engine]
    end
```

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons, Plus Jakarta Sans & Newsreader typography.
- **Backend**: Node.js, Express, tsx.
- **AI Engine**: `@google/genai` TypeScript SDK (utilizing `gemini-3.8-flash`) with strictly enforced system constraints and structured JSON schemas.
- **Document Processing**: `mammoth` (DOCX extraction), text buffer parser, and base64 document streaming.
- **Testing**: `vitest` unit, integration, and security test runners.
- **Security**: In-memory rate limiting, prompt injection filtering, strict file type validation, zero document logging, sanitized filenames.

## 4. Prompt Architecture & Untrusted Demarcation

User inputs and uploaded documents are treated as untrusted data:

```
[SYSTEM INSTRUCTION: Ethical Legal Assistant Constraints + Zero Hallucinations Policy]
↓
[JURISDICTIONAL CONTEXT (e.g. India, United States, United Kingdom)]
↓
[AUTHORITATIVE STATUTES & OFFICIAL PORTALS]
↓
<untrusted_document_content>
  [Sanitized User Contract or Notice]
</untrusted_document_content>
↓
[USER INQUIRY / TASK DIRECTIVE]
```

The system instruction explicitly forbids following commands inside `<untrusted_document_content>` tags.
