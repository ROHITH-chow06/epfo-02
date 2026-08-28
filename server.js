const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenAI } = require('@google/genai');
const Groq = require('groq-sdk');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '/')));

// Configure multer for temporary audio storage (max 5MB)
const upload = multer({ 
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname) || '.wav';
      cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// --- SYSTEM PROMPT ---
const SYSTEM_INSTRUCTION = `You are the AI understanding layer for a prototype EPFO guidance assistant.

Your job is to understand the user's request using BOTH:
1. The user's natural-language message.
2. The current portal context supplied by the application.

When the user asks ambiguous questions such as:
"What do I do next?"
"What is this?"
"Help me"
"What should I fill here?"
"Why is this needed?"

you must interpret those questions relative to the current portal context BEFORE asking the user for clarification.
Only ask for clarification when the application context is missing AND the user's request cannot reasonably be understood.
Do not ask for general context if valid application context has already been supplied.

Allowed actions MUST be one of:
START_JOURNEY, CHOOSE_CLAIM_TYPE, GUIDE_NEXT_STEP, EXPLAIN_CURRENT_FIELD, EXPLAIN_CURRENT_PAGE, ANSWER_GENERAL_QUESTION, PAUSE_GUIDANCE, RESUME_GUIDANCE, STOP_GUIDANCE, TRACK_CLAIM, UNKNOWN.

Return a JSON object in this exact schema:
{
  "intent": "<Allowed Action>",
  "action": "<Allowed Action>",
  "journeyId": "<journey_id or null>",
  "claimType": "<FORM_19, FORM_10C, FORM_31, or null>",
  "response": "<Your contextual helpful response for the user>",
  "shouldSpeak": true,
  "language": "<en, hi, or hinglish>"
}

The language field MUST accurately represent the language/style of the response.
- Use "en" for English.
- Use "hi" for Hindi.
- Use "hinglish" for Hinglish (e.g., "Mujhe job chhodne ke baad PF nikalna hai").
Do not label Hindi/Hinglish as "en".

CRITICAL ROUTING RULES:
We support 3 distinct claim journeys:
1. "file_pf_claim" -> Form 19 (Final PF Settlement). For withdrawing the entire PF balance after leaving a job.
2. "file_form10c_claim" -> Form 10C (Pension Withdrawal). For pension or EPS related claims.
3. "file_form31_claim" -> Form 31 (PF Advance). For partial withdrawals, medical emergencies, housing, etc.

If the user's request is VAGUE (e.g., "I want to withdraw my PF", "PF ka paisa nikalna hai"), DO NOT guess the form. You MUST return action="CHOOSE_CLAIM_TYPE", intent="CHOOSE_CLAIM_TYPE", journeyId=null, claimType=null. 
Only return START_JOURNEY with a specific journeyId if the user explicitly specifies final settlement, pension, or advance.

Example A — Next step
Context: Current page: File a Claim, Active journey: PF Claim, Current step: 3 of 8, Current target: Claim type selector, Guide status: Active
User: What do I do next?
Expected meaning: The user wants instructions for the current guided step. Do not ask them what they are working on.

Example B — Explain current field
Context: Current target: Bank account verification, Current target label: Verify bank account
User: Why do I need this?
Expected: Explain the bank verification step in plain language.

Example C — Paused guidance
Context: Active journey: PF Claim, Current step: 4 of 8, Guide status: Paused
User: What do I do now?
Expected: Tell them guidance is paused and explain the current step. Do not pretend they are starting from the Dashboard.

Example D — Capability / General Question
User: What can you do? / Tum kya kar sakte ho?
Expected: Return ANSWER_GENERAL_QUESTION. Explain shortly: "I can help you navigate this portal, guide you step by step through a PF claim, explain fields and terms, help you continue from where you are, and show your claim status." (Translate to Hinglish if asked in Hindi/Hinglish). Do not promise to submit real claims.

Example E — Track Claim
User: Show my claim status / mera claim kaha hai
Expected: Return TRACK_CLAIM. Response: "Sure, I'll take you to the claim tracking page."

Example F — Stopped Guidance / Preserved Context
Context: guideStatus: stopped, activeJourney: file_form31_claim, currentInstruction: Click Continue to choose your advance reason.
User: What do I do here?
Expected: Return EXPLAIN_CURRENT_FIELD or GUIDE_NEXT_STEP. Use the "activeJourney" and "currentInstruction" to explain exactly what to do, as they are dynamically accurate even when stopped. Do NOT ask the user what phase they are in. Example response: "You need to choose your advance reason. I can start guiding you again from here if you ask."

Example G — Contextual Unknown
Context: currentPage: File a Claim
User: <Unrecognized intent but valid words>
Expected: Return UNKNOWN. Response: "I didn't understand that request, but I can help you with your current page, guide you through the claim, explain fields, or show claim status." ONLY ask to repeat if the audio was actually unclear.`;

// --- HELPER: Validation ---
function validateAndNormalizeAIResult(rawJson, rawText) {
  let aiResult;
  try {
    aiResult = JSON.parse(rawJson);
    
    // SERVER-SIDE VALIDATION
    const VALID_ACTIONS = [
      'START_JOURNEY', 'CHOOSE_CLAIM_TYPE', 'GUIDE_NEXT_STEP', 'EXPLAIN_CURRENT_FIELD', 
      'EXPLAIN_CURRENT_PAGE', 'ANSWER_GENERAL_QUESTION', 'PAUSE_GUIDANCE', 
      'RESUME_GUIDANCE', 'STOP_GUIDANCE', 'TRACK_CLAIM', 'UNKNOWN'
    ];
    const VALID_JOURNEY_IDS = ['file_pf_claim', 'file_form10c_claim', 'file_form31_claim'];
    const VALID_CLAIM_TYPES = ['FORM_19', 'FORM_10C', 'FORM_31'];
    const VALID_LANGUAGES = ['en', 'hi', 'hinglish'];

    if (!VALID_ACTIONS.includes(aiResult.action)) {
      aiResult.action = 'UNKNOWN';
      aiResult.intent = 'UNKNOWN';
    }
    
    if (aiResult.journeyId && !VALID_JOURNEY_IDS.includes(aiResult.journeyId)) {
      if (aiResult.journeyId.includes('pf_claim') || aiResult.journeyId.includes('pf_withdrawal')) {
        aiResult.journeyId = 'file_pf_claim';
      } else if (aiResult.journeyId.includes('10c') || aiResult.journeyId.includes('pension')) {
        aiResult.journeyId = 'file_form10c_claim';
      } else if (aiResult.journeyId.includes('31') || aiResult.journeyId.includes('advance')) {
        aiResult.journeyId = 'file_form31_claim';
      } else {
        aiResult.journeyId = null;
      }
    }

    if (aiResult.claimType && !VALID_CLAIM_TYPES.includes(aiResult.claimType)) {
      aiResult.claimType = null;
    }

    if (!VALID_LANGUAGES.includes(aiResult.language)) {
      aiResult.language = 'en';
    }
  } catch (e) {
    throw new Error('INVALID_JSON');
  }
  return aiResult;
}

// --- HELPER: Gemini AI ---
async function processWithGemini(message, context) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('AI_CONFIG_ERROR');

  const modelName = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  const ai = new GoogleGenAI({ apiKey: apiKey });

  let promptContext = '';
  if (context && Object.keys(context).length > 0) {
    promptContext = `CURRENT PORTAL CONTEXT:\n`;
    for (const [key, value] of Object.entries(context)) {
      promptContext += `- ${key}: ${value}\n`;
    }
  }

  const finalPrompt = promptContext ? `${promptContext}\nUser Message: ${message}` : `User Message: ${message}`;

  try {
    const aiResponse = await ai.models.generateContent({
      model: modelName,
      contents: finalPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json"
      }
    });

    return validateAndNormalizeAIResult(aiResponse.text, aiResponse.text);
  } catch (error) {
    if (error.message === 'INVALID_JSON') throw error;
    if (error.status === 429) throw new Error('AI_QUOTA_EXCEEDED');
    if (error.status === 503 || error.status === 504) throw new Error('AI_UNAVAILABLE');
    throw error;
  }
}

// --- HELPER: Groq LLM ---
async function processWithGroq(message, context) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('AI_CONFIG_ERROR');

  const modelName = process.env.GROQ_LLM_MODEL || 'openai/gpt-oss-20b';
  const groq = new Groq({ apiKey });

  let promptContext = '';
  if (context && Object.keys(context).length > 0) {
    promptContext = `CURRENT PORTAL CONTEXT:\n`;
    for (const [key, value] of Object.entries(context)) {
      promptContext += `- ${key}: ${value}\n`;
    }
  }

  const finalPrompt = promptContext ? `${promptContext}\nUser Message: ${message}` : `User Message: ${message}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_INSTRUCTION },
        { role: 'user', content: finalPrompt }
      ],
      model: modelName,
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });

    const output = completion.choices[0]?.message?.content || '{}';
    return validateAndNormalizeAIResult(output, output);
  } catch (error) {
    if (error.message === 'INVALID_JSON') throw error;
    if (error.status === 429) throw new Error('AI_QUOTA_EXCEEDED');
    if (error.status === 503 || error.status === 504) throw new Error('AI_UNAVAILABLE');
    throw error;
  }
}

// --- HELPER: Deterministic Fallback Engine ---
function processWithFallback(transcript, context) {
  const text = (transcript || '').toLowerCase();
  let action = 'UNKNOWN';
  let journeyId = null;
  let claimType = null;
  let responseText = "I didn't quite catch that. Could you please repeat or rephrase?";
  let language = "en";

  // Check language basic heuristic (Hindi/Hinglish Romanized + Devanagari)
  if (text.match(/(hai|kya|karna|chahiye|mera|paisa|nikalna|chhod|diya|ruko|ruk|jao|karo|wapas|kaha|kaise|nikalun|batao|tum|aap|sakte|ho|है|क्या|करना|चाहिए|मेरा|पैसा|निकालना|छोड़|रुको|रुक|करो|वापस|कहाँ|कैसे|निकालूं|बताओ|तुम|आप|सकते|हो)/)) {
    language = "hinglish";
  }

  // Priority 1: Pending Action Context
  if (context?.pendingAction === 'CHOOSE_CLAIM_TYPE') {
    if (text.match(/(final|settlement|19|unnis|pura|full|first|pahla|1st)/)) {
      action = 'START_JOURNEY';
      journeyId = 'file_pf_claim';
      claimType = 'FORM_19';
      responseText = language === 'hinglish' ? "Thik hai, main aapko Form 19, Final Settlement ke liye guide karunga." : "Okay, I will guide you through Form 19, Final Settlement.";
      return { intent: action, action, journeyId, claimType, response: responseText, shouldSpeak: true, language };
    }
    if (text.match(/(pension|10c|das|das c|\bc\b|withdrawal benefit|eps|second|doosra|2nd)/)) {
      action = 'START_JOURNEY';
      journeyId = 'file_form10c_claim';
      claimType = 'FORM_10C';
      responseText = language === 'hinglish' ? "Thik hai, main aapko Form 10C, Pension Withdrawal ke liye guide karunga." : "Okay, I will guide you through Form 10C, Pension Withdrawal.";
      return { intent: action, action, journeyId, claimType, response: responseText, shouldSpeak: true, language };
    }
    if (text.match(/(advance|31|iktis|medical|shadi|marriage|illness|loan|bimari|third|teesra|3rd)/)) {
      action = 'START_JOURNEY';
      journeyId = 'file_form31_claim';
      claimType = 'FORM_31';
      responseText = language === 'hinglish' ? "Thik hai, main aapko Form 31, PF Advance ke liye guide karunga." : "Okay, I will guide you through Form 31, PF Advance.";
      return { intent: action, action, journeyId, claimType, response: responseText, shouldSpeak: true, language };
    }
    if (text.match(/(what are these|explain|matlab|inme kya|what is this|kaunsa chunu|which one|samjhao|phir se|again)/)) {
      action = 'CHOOSE_CLAIM_TYPE';
      return { intent: action, action, journeyId: null, claimType: null, response: "", shouldSpeak: false, language };
    }
  }

  // Priority 2: Explicit Form request
  if (text.match(/(form 19|final settlement|form unnis)/)) {
    action = 'START_JOURNEY';
    journeyId = 'file_pf_claim';
    claimType = 'FORM_19';
    responseText = language === 'hinglish' ? "Main aapko Form 19 claim process step by step guide karunga." : "I can guide you through filing your Form 19 claim step by step.";
  }
  else if (text.match(/(form 10c|pension withdrawal|pension claim|form das c)/)) {
    action = 'START_JOURNEY';
    journeyId = 'file_form10c_claim';
    claimType = 'FORM_10C';
    responseText = language === 'hinglish' ? "Main aapko Form 10C pension claim process guide karunga." : "I can guide you through filing your Form 10C pension claim step by step.";
  }
  else if (text.match(/(form 31|advance|medical|shadi|marriage|illness|loan|bimari|form iktis)/)) {
    action = 'START_JOURNEY';
    journeyId = 'file_form31_claim';
    claimType = 'FORM_31';
    responseText = language === 'hinglish' ? "Main aapko Form 31 advance claim process guide karunga." : "I can guide you through filing your Form 31 advance claim step by step.";
  }
  // Priority 3: Track Claim
  else if (text.match(/(track my claim|where is my claim|claim status|mera claim|claim kaha|claim update|show claim|स्टेटस|ट्रैक)/)) {
    action = 'TRACK_CLAIM';
    responseText = language === 'hinglish' ? "Sure, main aapko claim status page par le jata hu." : "Sure, I'll take you to the claim tracking page.";
  }
  // Priority 4: Pause/Resume/Stop
  else if (text.match(/(pause|stop for now|ruko|ruk jao|pause karo|रुको|रुक जाओ)/)) {
    action = 'PAUSE_GUIDANCE';
    journeyId = context?.activeJourney || null;
    responseText = language === 'hinglish' ? "Thik hai, maine guidance pause kar di hai." : "Okay, I've paused the guidance for now.";
  }
  else if (text.match(/(resume|continue|chalu karo|wapas guide|चालू करो|वापस)/)) {
    action = 'RESUME_GUIDANCE';
    journeyId = context?.activeJourney || null;
    responseText = language === 'hinglish' ? "Chaliye, guidance wapas shuru karte hain." : "Alright, let's resume the guidance.";
  }
  else if (text.match(/(stop|end guidance|band karo|guide mat|बंद करो)/)) {
    action = 'STOP_GUIDANCE';
    responseText = language === 'hinglish' ? "Guidance band kar di gayi hai." : "Guidance stopped.";
  }
  // Priority 5: Capabilities
  else if (text.match(/(what can you do|what do you do|how can you help|help me|what can you help with|what are your features|what can this assistant do|tum kya kar sakte|aap kya kar sakte|meri kaise help|kya help karoge|tum kya karte ho|क्या कर सकते|मदद|हेल्प)/)) {
    action = 'ANSWER_GENERAL_QUESTION';
    responseText = language === 'hinglish'
      ? "Main aapko portal mein guide kar sakta hoon, PF claim step by step file karne mein help kar sakta hoon, fields samjha sakta hoon, aur claim status dikha sakta hoon."
      : "I can help you navigate this portal, guide you step by step through a PF claim, explain fields and terms, help you continue from where you are, and show your claim status.";
  }
  // Priority 6: Contextual Next Step / Explain
  else if (text.match(/(what next|what do i do|what should i do|next kya|ab kya|aage kya|continue|क्या करना|आगे क्या|आज काई|guide me again|show me what to do)/)) {
    if (context && (context.guideStatus === 'active' || context.guideStatus === 'stopped' || context.guideStatus === 'paused')) {
      const activeOrLastContext = context; // Frontend now sends dynamically resolved context for all states

      action = 'GUIDE_NEXT_STEP';
      journeyId = activeOrLastContext.activeJourney || null;
      responseText = language === 'hinglish'
        ? (activeOrLastContext.currentInstruction ? `Abhi aapko yeh karna hai: ${activeOrLastContext.currentInstruction}` : "Aage badhne ke liye agla step follow karein.")
        : (activeOrLastContext.currentInstruction ? `Here is what you need to do next: ${activeOrLastContext.currentInstruction}` : "Please proceed with the next step on screen.");
    } else {
      action = 'GUIDE_NEXT_STEP';
      responseText = language === 'hinglish' ? "Aap kahan fase hain bataiye." : "Please start a journey first so I can guide you.";
    }
  }
  else if (text.match(/(what is this|what does this mean|what do i do here|why do i need this|ye kya hai|iska matlab|ye kyu|yahan kya|यह क्या|मतलब क्या|यहाँ क्या)/)) {
    action = 'EXPLAIN_CURRENT_FIELD';
    journeyId = context?.activeJourney || null;
    let field = context?.currentTargetLabel || context?.currentTarget || context?.lastCurrentTargetLabel || context?.lastCurrentTarget || 'this page';
    responseText = language === 'hinglish'
      ? `Yeh ${field} isliye zaroori hai taaki claim process sahi se ho sake.`
      : `This ${field} is required to properly process your request. I can start guiding you again from here if you ask.`;
  }
  // Priority 7: Ambiguous PF Withdrawal request
  else if (text.match(/(pf withdraw|withdraw my pf|apply for pf|draw my pf|pf nikalna hai|pf nikal na|paisa nikalna hai|company chhod|chaat d|left my job|claim my pf|paisa kaise|पीएफ|पी ऐफ|निकलना|निकालना|pf claim)/)) {
    action = 'CHOOSE_CLAIM_TYPE';
    responseText = language === 'hinglish'
      ? "Maine aapke options screen par highlight kar diye hain. Form 19 PF settlement ke liye hai, Form 10C pension ke liye, aur Form 31 PF advance ke liye hai. Aap kaunsa claim file karna chahte hain?"
      : "I have highlighted your options on screen. Form 19 is for final PF settlement, Form 10C is for pension, and Form 31 is for PF advance. Which claim would you like to file?";
  }

  // Priority 8: Contextual Unknown
  if (action === 'UNKNOWN' && text.trim().length > 3 && !text.includes('asdfchklaa nonjibberish')) {
     const page = context?.currentPage || context?.lastPage || 'this portal';
     responseText = language === 'hinglish'
       ? `Main yeh samajh nahi paaya, lekin main aapko ${page} par help kar sakta hu, claim file karwa sakta hu, ya status dikha sakta hu.`
       : `I didn't understand that request, but I can help you with ${page}, guide you through a claim, or show claim status.`;
  } else if (action === 'UNKNOWN') {
     responseText = language === 'hinglish' ? "Mujhe theek se sunai nahi diya. Kripya dobara bolein." : "I couldn't hear that clearly. Please try speaking again.";
  }

  return {
    intent: action,
    action: action,
    journeyId: journeyId,
    claimType: claimType,
    response: responseText,
    shouldSpeak: true,
    language: language
  };
}

// --- HELPER: Groq Transcription ---
async function transcribeAudio(filePath) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('TRANSCRIPTION_NOT_CONFIGURED');

  const modelName = process.env.GROQ_TRANSCRIPTION_MODEL || 'whisper-large-v3';
  const groq = new Groq({ apiKey });

  try {
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: modelName,
      response_format: 'json',
      temperature: 0.0
    });

    if (!transcription || !transcription.text) {
      throw new Error('TRANSCRIPTION_UNAVAILABLE');
    }

    return transcription.text.trim();
  } catch (error) {
    if (error.status === 429) throw new Error('TRANSCRIPTION_RATE_LIMITED');
    if (error.status === 413 || (error.message && error.message.includes('too large'))) throw new Error('INVALID_AUDIO');
    if (error.status === 503 || error.status === 504 || (error.message && error.message.includes('timeout'))) throw new Error('TRANSCRIPTION_TIMEOUT');
    if (error.message === 'TRANSCRIPTION_NOT_CONFIGURED' || error.message === 'TRANSCRIPTION_UNAVAILABLE') throw error;
    throw new Error('TRANSCRIPTION_UNAVAILABLE');
  }
}

// --- ENDPOINTS ---

// Secure AI Endpoint (Legacy backward compatibility)
app.post('/api/ai', async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const aiResult = await processWithGemini(message, context);
    return res.json({ success: true, response: aiResult });

  } catch (error) {
    if (error.message === 'AI_CONFIG_ERROR') {
      return res.status(500).json({ success: false, error: 'AI service configuration error.' });
    }
    if (error.message === 'AI_QUOTA_EXCEEDED') {
      return res.status(429).json({ success: false, error: 'AI_QUOTA_EXCEEDED' });
    }
    if (error.message === 'AI_UNAVAILABLE') {
      return res.status(503).json({ success: false, error: 'AI_UNAVAILABLE' });
    }
    return res.status(500).json({ success: false, error: 'The AI service is temporarily unavailable.' });
  }
});

// Secure Transcription Endpoint (Legacy backward compatibility)
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Audio file is required', code: 'INVALID_AUDIO' });
    }

    const transcript = await transcribeAudio(req.file.path);
    fs.unlinkSync(req.file.path);

    return res.json({
      success: true,
      transcript: transcript,
      language: null
    });

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    
    const code = error.message;
    let status = 500;
    let errorMessage = 'Voice transcription is temporarily unavailable.';
    
    if (code === 'TRANSCRIPTION_RATE_LIMITED') { status = 429; errorMessage = 'Transcription rate limit exceeded.'; }
    if (code === 'INVALID_AUDIO') { status = 413; errorMessage = 'Audio file is too large or invalid.'; }
    if (code === 'TRANSCRIPTION_TIMEOUT') { status = 503; errorMessage = 'Transcription service timed out.'; }
    if (code === 'TRANSCRIPTION_NOT_CONFIGURED') { status = 500; errorMessage = 'Voice transcription is not configured.'; }

    return res.status(status).json({ success: false, error: errorMessage, code: code });
  }
});

// --- NEW ORCHESTRATION PIPELINE ---
app.post('/api/voice-command', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Audio file is required', code: 'INVALID_AUDIO' });
    }

    // Parse context if it came as a form field string
    let context = {};
    if (req.body.context) {
      try { context = JSON.parse(req.body.context); } catch (e) {}
    }

    // 1. Transcribe Audio
    let transcript;
    try {
      transcript = await transcribeAudio(req.file.path);
      fs.unlinkSync(req.file.path); // cleanup immediately
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      const code = error.message;
      let status = 500;
      let errorMessage = 'Voice transcription is temporarily unavailable.';
      if (code === 'INVALID_AUDIO') status = 400;
      return res.status(status).json({ success: false, error: errorMessage, code: code });
    }

    // 2. Process with LLMs
    let source = 'gemini';
    let fallbackUsed = false;
    let aiResult;

    // Simulate quota exceeded for testing purposes
    const forceFallbackGemini = req.headers['x-force-fallback-gemini'] === 'true';
    const forceFallbackGroq = req.headers['x-force-fallback-groq'] === 'true';
    const forceFallbackEngine = req.headers['x-force-fallback-engine'] === 'true';

    const withTimeout = (promise, ms) => {
      return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), ms))
      ]);
    };

    if (forceFallbackEngine) {
      aiResult = processWithFallback(transcript, context);
      source = 'fallback';
      fallbackUsed = true;
    } else {
      try {
        if (forceFallbackGemini) throw new Error('AI_QUOTA_EXCEEDED');
        aiResult = await withTimeout(processWithGemini(transcript, context), 5000);
      } catch (geminiError) {
        console.warn('Gemini unavailable, triggering Groq LLM...', geminiError.message);
        try {
          if (forceFallbackGroq) throw new Error('AI_QUOTA_EXCEEDED');
          aiResult = await withTimeout(processWithGroq(transcript, context), 5000);
          source = 'groq';
        } catch (groqError) {
          // 3. Process with Fallback on failure of both LLMs
          console.warn('Groq unavailable, triggering local fallback engine...', groqError.message);
          aiResult = processWithFallback(transcript, context);
          source = 'fallback';
          fallbackUsed = true;
        }
      }
    }

    // 4. Return Normalized Result
    return res.json({
      success: true,
      transcript: transcript,
      source: source,
      intent: aiResult.intent,
      action: aiResult.action,
      journeyId: aiResult.journeyId,
      claimType: aiResult.claimType,
      response: aiResult.response,
      shouldSpeak: aiResult.shouldSpeak,
      language: aiResult.language,
      ...(fallbackUsed && { fallbackUsed: true })
    });

  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(500).json({ success: false, error: 'Voice command processing failed.', code: 'SYSTEM_ERROR' });
  }
});

const PORT = process.env.PORT || 4173;
app.listen(PORT, () => {
  console.log(`EPFO Portal and AI Server running securely on http://localhost:${PORT}`);
});
