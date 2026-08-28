async function runTests() {
  const endpoint = 'http://127.0.0.1:4173/api/ai';

  const testCases = [
    {
      name: 'Test A - English',
      payload: { message: 'I want to withdraw my PF after leaving my job.' }
    },
    {
      name: 'Test B - Hindi/Hinglish',
      payload: { message: 'Mujhe job chhodne ke baad apna PF nikalna hai, kaise karu?' }
    },
    {
      name: 'Test C - Poorly framed request',
      payload: { message: 'bhai company chhod diya paise chahiye pf wale' }
    },
    {
      name: 'Test D - Context handling',
      payload: { 
        message: 'What do I do next?',
        context: {
          currentRoute: '/claims/file',
          currentPage: 'File a Claim',
          activeJourney: 'pf_claim',
          currentStep: 3,
          totalSteps: 8,
          currentTarget: 'claim_type_selector',
          currentTargetLabel: 'I want to apply for',
          currentInstruction: 'Choose the type of claim you want to file.',
          guideStatus: 'active',
          isPaused: false
        }
      }
    },
    {
      name: 'Test E - Current field explanation',
      payload: {
        message: 'What does this mean?',
        context: {
          currentPage: 'File a Claim',
          currentTarget: 'Bank account verification',
          currentTargetLabel: 'Verify your linked bank account',
          guideStatus: 'active'
        }
      }
    },
    {
      name: 'Test F - Paused journey',
      payload: {
        message: 'What do I do now?',
        context: {
          activeJourney: 'PF Claim',
          currentStep: '4 of 8',
          currentInstruction: 'Confirm your bank details',
          guideStatus: 'paused',
          isPaused: true
        }
      }
    },
    {
      name: 'Test G - Canonical journey ID',
      payload: { message: 'Mujhe job chhodne ke baad apna PF nikalna hai.' }
    },
    {
      name: 'Test H - Hinglish language',
      payload: { message: 'Bhai company chhod di hai, PF ka paisa kaise nikalun?' }
    }
  ];

  console.log('--- Starting Gemini Integration Tests ---\n');

  for (const test of testCases) {
    console.log(`Running ${test.name}...`);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test.payload)
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log(`✅ Success! Response:\n${JSON.stringify(data.response, null, 2)}\n`);
      } else {
        console.log(`❌ Failed! Error:\n${data.error}\n`);
      }
    } catch (error) {
      console.error(`❌ Network/Fetch Error:\n${error.message}\n`);
    }
  }
}

runTests();
