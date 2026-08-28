const fs = require('fs');
const { execSync } = require('child_process');

async function synthesizeAudio(text, voice, outputFile) {
  const aiffFile = outputFile.replace('.wav', '.aiff');
  const voiceFlag = voice ? `-v ${voice}` : '';
  try {
    execSync(`say ${voiceFlag} -o ${aiffFile} "${text}"`);
    execSync(`afconvert -f WAVE -d LEI16 ${aiffFile} ${outputFile}`);
    fs.unlinkSync(aiffFile);
  } catch (e) {
    fs.writeFileSync(outputFile, "DUMMY AUDIO CONTENT");
  }
  return outputFile;
}

async function testVoiceCommand(name, audioFile, context = null, forceEngine = true) {
  console.log(`\nRunning ${name}...`);
  try {
    const formData = new FormData();
    if (audioFile) {
      const buffer = fs.readFileSync(audioFile);
      const blob = new Blob([buffer], { type: 'audio/wav' });
      formData.append('audio', blob, audioFile);
    }
    if (context) {
      formData.append('context', JSON.stringify(context));
    }

    const headers = {};
    if (forceEngine) headers['x-force-fallback-engine'] = 'true';

    const response = await fetch('http://127.0.0.1:4174/api/voice-command', {
      method: 'POST',
      headers: headers,
      body: formData
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Success! [Source: ${data.source}]`);
      console.log(`Transcript: "${data.transcript}"`);
      console.log(`Action: ${data.action} | Journey: ${data.journeyId} | ClaimType: ${data.claimType} | Lang: ${data.language}`);
    } else {
      console.log(`❌ Failed! Error: ${data.error} (Code: ${data.code})`);
    }
  } catch (error) {
    console.error(`❌ Network/Fetch Error:\n${error.message}`);
  }
}

async function runTests() {
  console.log('--- Starting Fallback Engine Tests (Fix 2) ---\n');

  try {
    console.log('Synthesizing test audio using MacOS text-to-speech...');
    const files = [
      { f: 'test_a.wav', t: "I want to apply for PF." },
      { f: 'test_c.wav', t: "I want to file Form 10C pension claim." },
      { f: 'test_d.wav', t: "Medical emergency advance form 31" },
      { f: 'test_e.wav', t: "Pension wala" },
      { f: 'test_f.wav', t: "Medical ke liye advance chahiye" },
      { f: 'test_g.wav', t: "What are these three?" },
      { f: 'test_first.wav', t: "First one" }
    ];

    for (let f of files) {
      await synthesizeAudio(f.t, "Samantha", f.f);
    }
    
    const pendingContext = { pendingAction: 'CHOOSE_CLAIM_TYPE' };

    await testVoiceCommand('Test A - Ambiguous PF', 'test_a.wav');
    await testVoiceCommand('Test B - Explicit Form 19 (Handled by UI click)', null); // Test B is a UI click in instructions, so we skip backend test. We do Test "First one" instead.
    await testVoiceCommand('Test First One - (START_JOURNEY)', 'test_first.wav', pendingContext);
    await testVoiceCommand('Test C - Explicit Form 10C', 'test_c.wav');
    await testVoiceCommand('Test D - Explicit Form 31', 'test_d.wav');
    await testVoiceCommand('Test E - Pension wala (START_JOURNEY context)', 'test_e.wav', pendingContext);
    await testVoiceCommand('Test F - Medical ke liye advance (START_JOURNEY context)', 'test_f.wav', pendingContext);
    await testVoiceCommand('Test G - Explain these three (CHOOSE_CLAIM_TYPE context)', 'test_g.wav', pendingContext);

  } catch (error) {
    console.error('Fatal Test Error:', error);
  } finally {
    ['test_a.wav', 'test_c.wav', 'test_d.wav', 'test_e.wav', 'test_f.wav', 'test_g.wav', 'test_first.wav'].forEach(f => {
      if (fs.existsSync(f)) fs.unlinkSync(f);
    });
  }
}

runTests();
