# EPFO Member Portal — AI-Assisted Digital Guidance Prototype

LIVE : https://epfo-02.onrender.com/#/dashboard

A responsive web prototype that combines an EPFO-style member portal with an AI-assisted digital guidance layer. The project demonstrates full-stack JavaScript development, contextual AI interaction, multilingual UX, voice-command testing, controlled action routing, and deterministic fallback behaviour.

> **Status:** Prototype / demonstration system using simulated member data and claim journeys. It is not connected to live EPFO systems and should not be used for real submissions.

## Skills Gained

- **AI / LLM Integration** — Google Gemini and Groq integration for intelligent application workflows.
- **Natural Language Processing** — intent classification and interpretation of free-form user requests.
- **Context-Aware Decision Making** — using application state and user context to determine the appropriate action.
- **Intelligent Action Routing** — converting natural-language requests into structured, predefined actions.
- **AI Output Validation** — validating model-generated actions, journey IDs, claim types and languages before application use.
- **Rule-Based Decision Systems** — deterministic fallback logic for reliable behaviour when AI services are unavailable.
- **AI-Assisted Automation** — connecting intelligent interpretation with application workflows.
- **Voice Command Processing** — audio input handling, voice-command testing and contextual command processing.
- **Multilingual AI Interaction** — English, Hindi and Hinglish language handling and localization.
- **State Management** — structured handling of journeys, steps, targets and guidance states.
- **Scenario-Based Testing** — testing ambiguous requests, multilingual input, contextual commands and voice workflows.
- **Backend API Development** — Node.js and Express API development for AI and voice workflows.
- **Frontend Development** — responsive interfaces using HTML, CSS and JavaScript.
- **Defensive Software Engineering** — validation, controlled outputs and fallback behaviour.
- **Git & GitHub** — repository management, version control and project documentation.
- **Technical Documentation** — documenting architecture, features, setup, testing and implementation details.

## Project Highlights

- Responsive member dashboard, passbook, claims, service history and account views.
- Context-aware AI assistant using both the user's message and current portal state.
- Guided flows for Form 19, Form 10C and Form 31.
- English, Hindi and Hinglish interaction support.
- Google Gemini and Groq model integration.
- Server-side validation of AI actions, journey IDs and response language.
- Deterministic fallback engine for predictable routing when AI is unavailable.
- Voice-command pipeline with multipart audio upload and testing.
- Dedicated AI and voice/fallback test scripts.

## Architecture

```text
Browser UI
  ├── index.html
  ├── app.js
  ├── styles.css
  └── i18n.js
        │
        │ HTTP / JSON / multipart audio
        ▼
Node.js + Express Backend
  ├── Static file serving
  ├── AI request routing
  ├── Voice command handling
  ├── Input/output validation
  └── Deterministic fallback engine
        │
        ├── Google Gemini
        └── Groq
```

The project intentionally uses a lightweight source structure rather than a large framework-generated application.

## Technology Stack

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript
- Responsive UI patterns
- Client-side navigation/view logic
- Localization dictionary architecture

### Backend

- Node.js
- Express
- CORS
- dotenv
- Multer

### AI / Intelligent Interaction

- Google Gemini via `@google/genai`
- Groq via `groq-sdk`
- Structured JSON responses
- Intent/action classification
- Context-aware prompting
- Deterministic rule-based fallback

## Core Features

### 1. Member Portal Experience

The frontend provides dashboard, passbook, claims, service history, KYC, e-Nomination and related account actions. The application uses simulated account information to demonstrate the workflows.

### 2. Context-Aware AI Guidance

The assistant interprets two major inputs together:

1. The user's natural-language request.
2. The current state of the portal.

Application context can include:

- Current page
- Active journey
- Current step
- Total steps
- Current target field
- Current instruction
- Guidance status
- Pause/resume state

This allows a request such as `What do I do next?` to be interpreted relative to the user's current workflow rather than as an isolated question.

### 3. Controlled AI Action Routing

The backend uses a constrained action vocabulary such as:

- `START_JOURNEY`
- `CHOOSE_CLAIM_TYPE`
- `GUIDE_NEXT_STEP`
- `EXPLAIN_CURRENT_FIELD`
- `EXPLAIN_CURRENT_PAGE`
- `ANSWER_GENERAL_QUESTION`
- `PAUSE`
- `RESUME`
- `STOP`
- `TRACK_CLAIM`
- `UNKNOWN`

The model is not treated as an unrestricted command executor. Its output is converted into a controlled application-level command and validated before being used.

### 4. Multiple AI Providers

The backend supports both Gemini and Groq processing paths. This demonstrates a provider-independent approach to AI integration and allows the application to avoid depending on a single external model service.

### 5. Deterministic Fallback Engine

A rule-based fallback path handles common intents, language patterns and contextual actions. This provides predictable behaviour when an external AI service is unavailable and also creates a useful baseline for testing AI behaviour.

### 6. Multilingual Interaction

The project separates UI strings into a localization module and supports English, Hindi and Hinglish interaction patterns. The AI layer can distinguish Romanized Hindi/Hinglish and Devanagari-style input.

### 7. Voice Command Pipeline

The repository includes a voice testing pipeline that:

1. Creates test audio.
2. Sends audio to the voice-command endpoint as multipart form data.
3. Passes optional application context.
4. Receives the interpreted command.
5. Checks the returned action, journey, claim type and language.
6. Cleans up generated test files.

## Guided Claim Journeys

| Journey | Claim Type | Prototype Purpose |
|---|---|---|
| `file_pf_claim` | Form 19 | Final PF settlement |
| `file_form10c_claim` | Form 10C | Pension-related withdrawal |
| `file_form31_claim` | Form 31 | PF advance / partial withdrawal |

The application can handle ambiguity rather than automatically guessing a claim type. For example, a generic PF-withdrawal request can be routed toward a claim-type selection step.

## AI Response Contract

The AI layer uses a structured response concept similar to:

```json
{
  "intent": "GUIDE_NEXT_STEP",
  "action": "GUIDE_NEXT_STEP",
  "journeyId": "file_pf_claim",
  "claimType": "FORM_19",
  "response": "...",
  "shouldSpeak": true,
  "language": "en"
}
```

The server validates important fields such as the action, journey ID, claim type and language against known values before returning the result to the frontend.

This is a useful pattern for AI-enabled systems because it creates a boundary between probabilistic model output and deterministic application behaviour.

## Running Locally

### Prerequisites

- Node.js
- npm
- Gemini and/or Groq API credentials if using the live AI paths

### Installation

```bash
npm install
```

### Start the Application

```bash
npm start
```

The project also provides:

```bash
npm run dev
```

Both scripts run the Node.js server.

### Environment Variables

Create a local `.env` file when using the external AI providers:

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=your_model_name
GROQ_API_KEY=your_key_here
GROQ_LLM_MODEL=your_model_name
```

**Never commit real API keys, credentials or other secrets to GitHub.**

## Testing

### Text AI Tests

`test-ai.js` includes test cases covering:

- English requests
- Hindi/Hinglish requests
- Poorly phrased natural-language input
- Context-aware questions
- Current-field explanations
- Paused journeys
- Canonical journey routing

### Voice / Fallback Tests

`test-pipeline.js` covers voice-command scenarios including:

- Ambiguous PF requests
- Explicit Form 10C requests
- Explicit Form 31 requests
- Pension-related requests
- Medical-advance requests
- Context-dependent commands
- Claim-type selection

The test pipeline also cleans up generated temporary audio files.

## Engineering Practices Demonstrated

### Context-Aware Application Design

Application state is passed into the AI interpretation layer so the same natural-language phrase can have different meanings depending on where the user is in a workflow.

### Defensive AI Integration

AI output is treated as untrusted structured data and validated before application use.

### Fallback Architecture

Model-based interpretation is complemented by deterministic rules, improving resilience and predictability.

### Scenario-Based Testing

The project uses explicit test scenarios for different languages, levels of ambiguity, application states and voice inputs.

### Internationalization

UI strings are separated from view logic through the `i18n.js` localization structure.

### Accessibility-Minded UI

The frontend uses semantic interaction patterns including navigation state attributes such as `aria-expanded` and `aria-controls`.

## Robotics-Relevant Skills Demonstrated

- Artificial Intelligence and Machine Learning Integration
- Large Language Model Integration
- Natural Language Processing
- Context-Aware Decision Making
- Intelligent Command Interpretation
- Structured Action Generation
- Action Validation and Safety-Oriented Logic
- AI-Agent Architecture
- Autonomous Decision-Layer Development
- Voice and Multimodal Interaction
- State and Task Management
- Robust Fallback Systems
- Scenario-Based Testing
- Software Architecture
- API Development
- Full-Stack Development
- Git and Version Control
- Technical Documentation

## Repository Structure

```text
.
├── app.js              # Main frontend application and portal views
├── index.html          # HTML entry point
├── styles.css          # UI styling and responsive behaviour
├── i18n.js             # Localization strings
├── server.js           # Express backend, AI and voice routes
├── test-ai.js          # Text AI integration tests
├── test-groq.js        # Groq test utility
├── test-mic.html       # Microphone/voice test page
├── test-pipeline.js    # Voice/fallback pipeline tests
├── package.json        # Scripts and dependencies
├── package-lock.json   # Locked dependency tree
└── logo.png            # Portal branding asset
```

## Scope and Limitations

- Member and claim data are simulated.
- The application is a prototype and is not a live government-service integration.



## Summary

This project demonstrates a strong foundation in **AI application engineering, contextual decision making, controlled action generation, multilingual interaction, voice pipelines, fallback systems, testing, Git/GitHub and technical documentation**.
