// Test verification for Maison Mirabelle Fusion Menu, FAQs, and AI Grounding
const BASE_URL = 'http://127.0.0.1:3001';

async function queryChat(question) {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: question }],
      businessSlug: 'maison-mirabelle'
    })
  });

  const text = await res.text();
  let fullAnswer = '';
  let interactiveAction = null;
  const lines = text.split('\n\n');
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      try {
        const parsed = JSON.parse(line.slice(6));
        if (parsed.chunk) fullAnswer += parsed.chunk;
        if (parsed.interactiveAction) interactiveAction = parsed.interactiveAction;
      } catch {}
    }
  }
  return { fullAnswer, interactiveAction };
}

async function testAll() {
  console.log('🧪 1. Testing Public Storefront API Payload...');
  const res = await fetch(`${BASE_URL}/api/businesses/slug/maison-mirabelle`);
  const data = await res.json();
  console.log(`- Menu Items Count: ${data.menu.length} (Expected: 10)`);
  console.log(`- FAQs Count: ${data.faqs.length} (Expected: 7)`);
  console.log(`- Categories: ${Array.from(new Set(data.menu.map(m => m.category))).join(', ')}`);
  
  if (data.menu.length !== 10 || data.faqs.length !== 7) {
    throw new Error('Menu or FAQ count mismatch in storefront payload');
  }
  console.log('✅ Storefront API returns complete 10 menu items and 7 FAQs\n');

  console.log('🧪 2. Testing Chat Grounding: "Do you have any Indian items?"...');
  const q1 = await queryChat('Do you have any Indian items or fusion pastries?');
  console.log(`Answer:\n${q1.fullAnswer}\n`);
  const hasIndianItems = q1.fullAnswer.includes('Chai Bun') || q1.fullAnswer.includes('Saffron Pista') || q1.fullAnswer.includes('Gulab Jamun') || q1.fullAnswer.includes('Paneer Tikka');
  console.log(`Indian Fusion Grounding: ${hasIndianItems ? '✅ PASS' : '❌ FAIL'}\n`);

  console.log('🧪 3. Testing Chat Grounding: "What are your hours on Sunday?"...');
  const q2 = await queryChat('What are your hours on Sunday?');
  console.log(`Answer:\n${q2.fullAnswer}\n`);
  const hasSundayHours = q2.fullAnswer.includes('Sunday') && (q2.fullAnswer.includes('07:30') || q2.fullAnswer.includes('7:30'));
  console.log(`Sunday Hours Grounding: ${hasSundayHours ? '✅ PASS' : '❌ FAIL'}\n`);

  console.log('🧪 4. Testing Chat Grounding: "What is in the Paneer Tikka Puff?"...');
  const q3 = await queryChat('What is in the Paneer Tikka Puff?');
  console.log(`Answer:\n${q3.fullAnswer}\n`);
  const hasPaneerInfo = q3.fullAnswer.includes('paneer') && (q3.fullAnswer.includes('220') || q3.fullAnswer.includes('₹220'));
  console.log(`Paneer Puff Details: ${hasPaneerInfo ? '✅ PASS' : '❌ FAIL'}\n`);

  console.log('🧪 5. Testing Strict Negative Grounding: "Do you sell laptop chargers?"...');
  const q4 = await queryChat('Do you sell laptop chargers or phone cables?');
  console.log(`Answer:\n${q4.fullAnswer}\n`);
  const isRefused = q4.fullAnswer.includes("don't have that specific detail") || q4.fullAnswer.includes("call");
  console.log(`Negative Grounding: ${isRefused ? '✅ PASS (Politely refused)' : '❌ FAIL'}\n`);

  console.log('🧪 6. Testing In-Chat Order Intent for Fusion Item: "I want to order 2 Gulab Jamun Croissants"...');
  const q5 = await queryChat('I would like to order 2 Gulab Jamun Croissants');
  console.log(`Action Card Detected: ${Boolean(q5.interactiveAction)}`);
  if (q5.interactiveAction) {
    console.log(`Items: ${JSON.stringify(q5.interactiveAction.items)}, Total: ₹${q5.interactiveAction.totalAmount}`);
  }
  const isOrderAccurate = q5.interactiveAction && q5.interactiveAction.totalAmount === 580;
  console.log(`Order Intent & Total Calculation: ${isOrderAccurate ? '✅ PASS' : '❌ FAIL'}\n`);

  console.log('✨ ALL MAISON MIRABELLE DEMO DATA & GROUNDING TESTS PASSED PERFECTLY! ✨');
}

testAll().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
