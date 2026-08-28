// Automated Test Suite for Location & Multi-Currency with Live Exchange Rates

const API_BASE = 'http://127.0.0.1:3001/api';

async function runTests() {
  console.log('🚀 Starting Multi-Currency & Location Verification Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // Test 1: Live Exchange Rates API
    console.log('1. Testing Live Exchange Rates Endpoint (/api/exchange-rates)...');
    const rateRes = await fetch(`${API_BASE}/exchange-rates`);
    const rateData = await rateRes.json();
    assert(rateRes.ok, 'Exchange rates endpoint responded with 200 OK');
    assert(rateData.base === 'USD', `Base currency is USD (got ${rateData.base})`);
    assert(rateData.rates && rateData.rates.INR > 70, `INR rate is realistic (got ${rateData.rates?.INR})`);
    assert(rateData.rates && rateData.rates.EUR > 0.7, `EUR rate is present (got ${rateData.rates?.EUR})`);
    assert(rateData.rates && rateData.rates.GBP > 0.6, `GBP rate is present (got ${rateData.rates?.GBP})`);

    // Test 2: Maison Mirabelle Storefront Location & INR Currency
    console.log('\n2. Testing Maison Mirabelle Profile Location & Currency...');
    const bizRes = await fetch(`${API_BASE}/businesses/slug/maison-mirabelle`);
    const bizData = await bizRes.json();
    assert(bizRes.ok, 'Maison Mirabelle public endpoint returned 200 OK');
    assert(bizData.profile.country === 'India', `Country is India (got "${bizData.profile.country}")`);
    assert(bizData.profile.city === 'Mumbai', `City is Mumbai (got "${bizData.profile.city}")`);
    assert(bizData.profile.currency === '₹', `Currency symbol is ₹ (got "${bizData.profile.currency}")`);
    assert(bizData.profile.currencyCode === 'INR', `Currency code is INR (got "${bizData.profile.currencyCode}")`);

    // Test 3: Menu Items INR Pricing
    console.log('\n3. Testing Menu Items INR Pricing...');
    const sourdough = bizData.menu.find(m => m.name === 'Classic Sourdough Loaf');
    const chaiBun = bizData.menu.find(m => m.name === 'Cardamom Chai Bun');
    const masalaChai = bizData.menu.find(m => m.name === 'Masala Chai');
    const paneerPuff = bizData.menu.find(m => m.name === 'Paneer Tikka Puff');
    const gulabJamun = bizData.menu.find(m => m.name === 'Gulab Jamun Croissant');

    assert(sourdough && sourdough.price === 350, `Classic Sourdough Loaf is ₹350 (got ${sourdough?.price})`);
    assert(chaiBun && chaiBun.price === 180, `Cardamom Chai Bun is ₹180 (got ${chaiBun?.price})`);
    assert(masalaChai && masalaChai.price === 120, `Masala Chai is ₹120 (got ${masalaChai?.price})`);
    assert(paneerPuff && paneerPuff.price === 220, `Paneer Tikka Puff is ₹220 (got ${paneerPuff?.price})`);
    assert(gulabJamun && gulabJamun.price === 290, `Gulab Jamun Croissant is ₹290 (got ${gulabJamun?.price})`);

    // Test 4: Chat Grounding Quoting INR Prices
    console.log('\n4. Testing Chat Grounding Response Currency...');
    const chatRes = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'What is the price of the Cardamom Chai Bun and Masala Chai?' }],
        businessSlug: 'maison-mirabelle'
      })
    });
    const chatText = await chatRes.text();
    assert(chatText.includes('₹') || chatText.includes('180'), 'Chat response contains ₹ symbol or 180 INR pricing');

    // Test 5: Dynamic Exchange Conversion Math
    console.log('\n5. Testing Exchange Rate Conversion Logic...');
    const inrAmount = 350;
    const inrRate = rateData.rates.INR; // e.g. ~86.5
    const usdRate = rateData.rates.USD; // 1.0
    const inUSD = (inrAmount / inrRate) * usdRate;
    assert(inUSD > 3.5 && inUSD < 5.0, `₹350 converted to USD gives ~$${inUSD.toFixed(2)} (realistic range)`);

    console.log(`\n================================`);
    console.log(`TOTAL RESULTS: ${passed} Passed, ${failed} Failed`);
    console.log(`================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runTests();
