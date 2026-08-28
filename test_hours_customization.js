// Test Opening and Closing Timing Customization
const BASE_URL = 'http://127.0.0.1:3001';

async function testHours() {
  console.log('🕒 Testing Opening & Closing Customization API & Chat Grounding...');

  // 1. Fetch public business
  const res = await fetch(`${BASE_URL}/api/businesses/slug/maison-mirabelle`);
  const data = await res.json();
  const monday = data.hours.find(h => h.day === 'Monday');
  console.log(`- Monday Current Timings: ${monday.openTime} – ${monday.closeTime} (${monday.isOpen ? 'Open' : 'Closed'})`);

  // 2. Query chat about Monday hours
  const chatRes = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'What time do you open and close on Monday?' }],
      businessSlug: 'maison-mirabelle'
    })
  });
  const chatText = await chatRes.text();
  console.log(`- Chat Grounding Response:\n${chatText}\n`);

  if (chatText.includes('07:00') || chatText.includes('7:00')) {
    console.log('✅ PASS: AI Concierge accurately quotes customized opening & closing timings!');
  } else {
    console.log('❌ FAIL: AI Concierge did not quote hours properly.');
    process.exit(1);
  }
}

testHours().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
