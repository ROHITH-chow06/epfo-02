# EPFO Member Portal — AI-Assisted Digital Guidance Prototype

A responsive web prototype combining an EPFO-style member portal with an AI-assisted guidance layer. The system demonstrates full-stack JavaScript development, contextual AI interaction, multilingual UX, voice-command testing, controlled action routing, and deterministic fallback behaviour.

> **Status:** Prototype / demonstration system using simulated member data and claim journeys. It is not connected to live EPFO systems and should not be used for real submissions.

## Highlights

- Responsive member dashboard, passbook, claims, service history and account views.
- Context-aware AI assistant using the user's message **and current portal state**.
- Guided flows for Form 19, Form 10C and Form 31.
- English, Hindi and Hinglish interaction support.
- Google Gemini and Groq model integration.
- Server-side validation of AI actions, journey IDs and response language.
- Deterministic fallback engine for predictable routing when AI is unavailable.
- Voice-command pipeline with multipart audio upload and test automation.
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
Node.js + Express
  ├── Static file serving
  ├── AI request routing
  ├── Voice command handling
  ├── Response validation
  └── Deterministic fallback engine
        │
        ├── Google Gemini
        └── Groq
```

The repository is intentionally lightweight. Its main branch contains the frontend, backend, localization module, package metadata and focused AI/voice test utilities. fileciteturn2file0L1-L3

## Technology Stack

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Responsive UI
- Client-side view/navigation logic
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
- Deterministic fallback rules

The declared dependencies include Express, CORS, dotenv, Multer, Google GenAI and Groq SDKs. fileciteturn3file0L1-L6

## Core Features

### 1. Member portal experience

The frontend includes dashboard, passbook, claims, service history, KYC, e-Nomination and related account actions. The application uses simulated data to demonstrate the workflows. fileciteturn5file0L1-L2

### 2. Context-aware AI guidance

The assistant interprets a user's natural-language request together with application context such as the current page, active journey, current step, target field and guidance status. The backend constrains the model to a fixed action vocabulary including `START_JOURNEY`, `CHOOSE_CLAIM_TYPE`, `GUIDE_NEXT_STEP`, `EXPLAIN_CURRENT_FIELD`, `EXPLAIN_CURRENT_PAGE`, `ANSWER_GENERAL_QUESTION`, pause/resume/stop actions, `TRACK_CLAIM` and `UNKNOWN`. fileciteturn4file0L1-L2

This is an important engineering pattern: the model produces a controlled command representation instead of being allowed to invent arbitrary application actions.

### 3. Multiple AI providers

The backend provides Gemini and Groq processing paths using the same contextual rules and structured-output contract. This gives the project a provider-independent AI integration pattern. fileciteturn4file0L1-L2

### 4. Deterministic fallback engine

The server also contains a rule-based fallback path that can interpret common intents, language patterns and portal context. This provides predictable behaviour when external AI services are unavailable and provides a useful baseline for evaluating model behaviour. fileciteturn4file0L1-L2

### 5. Multilingual interaction

The localization module separates UI strings from presentation logic, while the AI layer distinguishes English, Hindi and Hinglish. The backend also contains language heuristics for Romanized Hindi/Hinglish and Devanagari input. fileciteturn7file0L1-L6 fileciteturn4file0L1-L2

### 6. Voice-command testing

The repository includes a voice test pipeline that creates sample audio, sends it as multipart form data, passes optional application context and checks returned actions, journey IDs, claim types and language. fileciteturn9file0L1-L7

## Guided Claim Journeys

| Journey | Claim Type | Prototype purpose |
|---|---|---|
| `file_pf_claim` | Form 19 | Final PF settlement |
| `file_form10c_claim` | Form 10C | Pension-related withdrawal |
| `file_form31_claim` | Form 31 | PF advance / partial withdrawal |

The AI rules deliberately avoid guessing a claim type for a vague request and can instead return `CHOOSE_CLAIM_TYPE`. fileciteturn4file0L1-L2

## AI Response Contract

The model is asked to return a predictable structure similar to:

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

The server validates the action, journey ID, claim type and language against allow-lists before using the result. fileciteturn4file0L1-L2

## Running Locally

### Prerequisites

- Node.js and npm
- Gemini/Groq API keys if using the live model paths

### Install

```bash
npm install
```

### Start

```bash
npm start
```

`package.json` defines both `npm start` and `npm run dev` as `node server.js`. fileciteturn3file0L1-L2

### Environment variables

Create a local `.env` file as needed:

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=your_model_name
GROQ_API_KEY=your_key_here
GROQ_LLM_MODEL=your_model_name
```

Never commit real API keys or secrets.

## Testing

### Text AI tests

`test-ai.js` covers English and Hindi/Hinglish requests, poorly phrased input, context-aware questions, current-field explanations, paused journeys and canonical journey routing. fileciteturn8file0L1-L7

### Voice/fallback tests

`test-pipeline.js` synthesizes sample audio, posts it to the voice-command endpoint with optional context, checks the response and cleans up generated files. fileciteturn9file0L1-L7

## Engineering Practices Demonstrated

### Context-aware application design

The AI layer is state-aware rather than treating each question as an isolated prompt. This enables questions such as “What do I do next?” to be interpreted relative to the current portal state. fileciteturn4file0L1-L2

### Defensive AI integration

AI results are constrained to known actions and then validated on the server. Invalid values are normalized rather than trusted blindly. fileciteturn4file0L1-L2

### Fallback architecture

The project combines model-based reasoning with deterministic rules so the application can degrade gracefully.

### Scenario-based testing

The project contains explicit test cases rather than depending only on manual browser testing. fileciteturn8file0L1-L7

### Internationalization

UI strings are separated into an `i18n.js` translation structure, making localization easier to extend. fileciteturn7file0L1-L6

### Accessibility-minded UI implementation

The navigation code uses attributes such as `aria-expanded` and `aria-controls` and toggles hidden navigation regions programmatically. fileciteturn5file0L1-L2

## Relevance to Robotics / AI Projects in the Attached Document

**Yes. Several skills from this repository are useful, especially for AI/software-heavy robotics and autonomous-systems projects.** The important distinction is that the repo demonstrates transferable software and AI skills; it does **not** by itself demonstrate robotics-specific skills such as ROS 2, SLAM, kinematics, CAD or control theory.

| Skill demonstrated here | Why it matters | Match to document |
|---|---|---|
| Context-aware AI decision logic | Similar software pattern to turning observations/instructions into constrained actions | **Strong** for safe vision-language-action navigation. fileciteturn6file0L10-L38 |
| Structured action routing + validation | Useful for safe command generation and safety filtering | **Strong** for human-aware autonomous robots. fileciteturn6file1L76-L100 |
| AI/LLM integration | Transfers to intelligent decision layers and AI-agent systems | **Strong** |
| Scenario-based testing | Robotics projects require simulation, testing and performance evaluation | **Strong**. fileciteturn6file3L166-L189 |
| Git/repository workflow | Git experience is explicitly welcomed in at least one robotics project | **Strong**. fileciteturn6file0L30-L38 |
| Documentation | Robotics projects require code/result documentation and technical reports | **Strong**. fileciteturn6file0L21-L29 |
| Multimodal/voice interaction | Relevant conceptually to human-robot interfaces | **Moderate–Strong** |
| State/context management | Transferable to robot state, mission state and autonomy pipelines | **Moderate–Strong** |
| JavaScript/Node.js | Good software-engineering evidence, but many target projects specifically use Python/MATLAB/C++ | **Moderate** |
| CAD/kinematics/dynamics | Not shown in this repo | **Gap**. fileciteturn6file2L119-L149 |
| ROS 2/Gazebo/Linux robotics | Not shown in this repo | **Gap**. fileciteturn6file5L276-L305 |
| Sensor fusion / LiDAR / IMU / camera robotics | Not shown as robotics integration | **Gap**. fileciteturn6file5L285-L292 |
| Control / MPC | Not shown in this repo | **Gap**. fileciteturn6file6L315-L345 |
| Signal processing / vibration | Not shown in this repo | **Gap**. fileciteturn6file7L359-L393 |

## Strongest Project Matches

### 1. Safe Vision-Language-Action Navigation for Human-Aware Quadruped Robots — **Strong software/AI match**

This project combines perception, language-conditioned decision making, navigation-command generation, safety checks, simulation, evaluation, documentation and Python/MATLAB-style programming. Git experience is explicitly welcome. fileciteturn6file0L10-L38

Your repository demonstrates several directly transferable ideas: interpreting natural language, using application context, converting model output into constrained actions, handling ambiguity, testing multiple scenarios, and documenting the software. The missing part is robotics-specific perception, ROS/simulation and physical robot execution.

### 2. Quadruped Robot Perception and Control — **Strong software-side match**

The document calls for computer vision/control implementation, robot software improvement, simulation, physical experiments and reporting. fileciteturn6file8L403-L427

This repository strengthens the software engineering, AI interaction, testing and documentation side of that profile, but should not be used as evidence of robot control experience.

### 3. Autonomous Surface Vessel + Plant Detection — **Strong AI/software transfer; major robotics gap**

The project requires ROS 2, Python/C++, navigation, Linux, simulation, computer vision/deep learning and sensor integration. fileciteturn6file5L275-L305

The strongest overlap is structured AI logic, state management, testing and software development. The main gaps are ROS 2, navigation algorithms, camera/GPS/IMU/LiDAR integration and actual deep-learning perception.

### 4. Dynamics and Control of Robotics for Manufacturing — **Partial match**

This project emphasizes dynamics modelling, controller design, stability analysis, simulation, experimental validation and Python/MATLAB/Simulink. fileciteturn6file4L207-L239

The repository helps with software development, testing, AI integration and documentation, but not the core dynamics/control requirements.

### 5. Making Drones Safer with Model Predictive Control — **Partial match**

The document requires dynamic-system/control knowledge, Python or MATLAB, modelling, simulation and MPC/fault-tolerant-control work. fileciteturn6file3L166-L189 fileciteturn6file6L315-L345

Your project supports the programming and structured-decision narrative, but does not demonstrate MPC, UAV modelling, optimization or control theory.

### 6. Industrial AI Agents for Prognostics and Health Management — **Moderate AI/software match**

That project requires AI agents, data analysis, signal processing, machine learning, Python/MATLAB, software development and dynamics/vibration knowledge. fileciteturn6file7L359-L393

The overlap is strongest in AI-agent architecture, structured decision logic, testing and software engineering. Signal processing, vibration analysis and predictive-maintenance modelling are not demonstrated here.

### 7. CAD / Robotic Architecture / Prototyping — **Limited match**

The document includes projects using SolidWorks, MATLAB kinematics, Simscape Multibody, actuator selection and 3D printing. fileciteturn6file2L119-L149

This repository should only be used as supporting software evidence for those projects.

## Resume-Ready Project Description

> **AI-Assisted Member Portal / Conversational Guidance Prototype** — Built a responsive full-stack web application using Node.js/Express and browser-based JavaScript, integrating Gemini and Groq for context-aware intent routing, controlled action generation and multilingual guidance. Implemented server-side AI-output validation, deterministic fallback behaviour, voice-command testing and scenario-based integration tests.

This description highlights skills that genuinely transfer to robotics/AI research without claiming ROS, computer vision, control theory, CAD or hardware experience that is not present in this repository.

## Skills to Add Next for Robotics Applications

To make this project portfolio significantly stronger for the robotics opportunities in the document, the highest-value next skills are:

1. **Python for robotics** — NumPy, OpenCV, matplotlib and scientific computing.
2. **ROS 2 + Linux** — nodes, topics, services, launch files, TF and navigation basics.
3. **Robot simulation** — Gazebo, Isaac Sim, Webots or a comparable simulator.
4. **Computer vision** — camera pipelines, object/obstacle detection and introductory deep learning.
5. **Control systems** — PID, state estimation, trajectory tracking and introductory MPC.
6. **Sensors** — IMU, GPS, camera and LiDAR integration/fusion.
7. **Robotics mathematics** — coordinate transforms, kinematics, dynamics and optimization.

Those additions align closely with the requirements repeatedly appearing across the supplied robotics projects. fileciteturn6file0L30-L38 fileciteturn6file5L285-L292 fileciteturn6file6L340-L345

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
└── logo.png            # Branding asset
```

The current main branch contains these frontend, backend, localization and test assets. fileciteturn2file0L1-L3

## Scope / Limitations

- Member and claim information is simulated.
- No live EPFO submission or production account integration is demonstrated.
- AI outputs still require normal application-level validation and testing.
- ROS 2, SLAM, CAD, kinematics, dynamics, MPC, sensor fusion and physical robot control are **not** demonstrated by this repository.

## License

No explicit open-source license is currently indicated by the repository. Add a license file before presenting the project as reusable open-source software.

## Summary

This project is strongest as evidence of **full-stack AI application engineering, contextual decision logic, multilingual interaction, voice-pipeline testing, defensive AI integration, and disciplined software testing/documentation**. Those capabilities transfer particularly well to software-heavy robotics, autonomous-systems and AI research projects, while robotics-specific tools and theory should be listed separately once demonstrated.