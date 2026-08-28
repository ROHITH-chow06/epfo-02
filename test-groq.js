const fs = require('fs');
const { execSync } = require('child_process');

async function synthesizeAudio(text, voice, outputFile) {
  // Use MacOS say command to generate AIFF, then convert to WAV
  const aiffFile = outputFile.replace('.wav', '.aiff');
  const voiceFlag = voice ? `-v ${voice}` : '';
  
  execSync(`say ${voiceFlag} -o ${aiffFile} "${text}"`);
  execSync(`afconvert -f WAVE -d LEI16 ${aiffFile} ${outputFile}`);
  fs.unlinkSync(aiffFile);
  
  return outputFile;
}

async function testTranscription(name, audioFile) {
  console.log(`Running ${name}...`);
  try {
    const formData = new FormData();
    if (audioFile) {
      const buffer = fs.readFileSync(audioFile);
      const blob = new Blob([buffer], { type: 'audio/wav' });
      formData.append('audio', blob, audioFile);
    }

    const response = await fetch('http://127.0.0.1:4173/api/transcribe', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Success! Transcript: "${data.transcript}"\n`);
    } else {
      console.log(`❌ Failed! Error: ${data.error} (Code: ${data.code})\n`);
    }
  } catch (error) {
    console.error(`❌ Network/Fetch Error:\n${error.message}\n`);
  }
}

async function runTests() {
  console.log('--- Starting Groq Whisper Integration Tests ---\n');

  try {
    // 1. Synthesize audio
    console.log('Synthesizing test audio using MacOS text-to-speech...');
    await synthesizeAudio("I want to withdraw my PF.", "Samantha", "test_en.wav");
    
    // For Hindi/Hinglish, we use Lekha if available, or just fallback to default which will have a heavy accent but Whisper handles it.
    let hindiVoice = '';
    try {
      const voices = execSync('say -v ?').toString();
      if (voices.includes('Lekha')) hindiVoice = 'Lekha';
    } catch (e) {}

    await synthesizeAudio("Mujhe apna PF nikalna hai.", hindiVoice, "test_hi.wav");
    await synthesizeAudio("Mujhe job chhodne ke baad PF withdraw karna hai.", hindiVoice, "test_hinglish.wav");

    // 2. Run Tests
    await testTranscription('Test 1 - English', 'test_en.wav');
    await testTranscription('Test 2 - Hindi', 'test_hi.wav');
    await testTranscription('Test 3 - Hinglish', 'test_hinglish.wav');
    await testTranscription('Test 4 - No audio', null);
    
    // Test 5 - Invalid/corrupt input
    fs.writeFileSync('test_corrupt.wav', 'not a real audio file data here');
    await testTranscription('Test 5 - Invalid input (corrupt file)', 'test_corrupt.wav');

  } catch (error) {
    console.error('Fatal Test Error:', error);
  } finally {
    // Cleanup
    const files = ['test_en.wav', 'test_hi.wav', 'test_hinglish.wav', 'test_corrupt.wav'];
    files.forEach(f => {
      if (fs.existsSync(f)) fs.unlinkSync(f);
    });
  }
}

runTests();
