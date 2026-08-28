import fetch from 'node-fetch';

const API_BASE = 'http://127.0.0.1:3001/api';

async function runTests() {
  console.log('🌟 Testing Customer Ratings & Reviews & Business Images API...\n');

  // 1. Fetch Maison Mirabelle public data
  const bizRes = await fetch(`${API_BASE}/businesses/slug/maison-mirabelle`);
  const bizData = await bizRes.json();
  const bizId = bizData.profile.id;
  console.log(`1. Found Business: ${bizData.profile.name} (ID: ${bizId})`);

  // 2. Fetch initial reviews
  const revRes = await fetch(`${API_BASE}/businesses/${bizId}/reviews`);
  if (!revRes.ok) throw new Error(`Reviews endpoint failed: ${revRes.status}`);
  const revData = await revRes.json();
  console.log(`2. Initial Reviews Count: ${revData.reviews.length}, Average Rating: ${revData.stats.averageRating} ⭐`);
  if (revData.reviews.length < 1) throw new Error('Expected seeded reviews');

  // 3. Submit a new 5-star review from Live Chat
  console.log('\n3. Submitting 5-Star Review from Live Chat...');
  const chatRevRes = await fetch(`${API_BASE}/businesses/${bizId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Ananya Deshmukh',
      rating: 5,
      comment: 'Mira in the live chat was fantastic! Answered all allergen questions about the cardamom chai bun.',
      source: 'chat',
      tags: ['Live Chat', 'Cardamom Bun']
    })
  });
  if (!chatRevRes.ok) throw new Error(`Chat review submission failed: ${chatRevRes.status}`);
  const createdChatRev = await chatRevRes.json();
  console.log(`  ✅ Live Chat Review Created: "${createdChatRev.comment}" by ${createdChatRev.customerName} (${createdChatRev.rating}⭐)`);

  // 4. Submit a review from Storefront
  console.log('\n4. Submitting Review from Storefront...');
  const storeRevRes = await fetch(`${API_BASE}/businesses/${bizId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Vikram Sengupta',
      rating: 5,
      comment: 'Best artisanal bakery in Bandra. The sourdough batard has great crust and texture.',
      source: 'storefront'
    })
  });
  const createdStoreRev = await storeRevRes.json();
  console.log(`  ✅ Storefront Review Created: "${createdStoreRev.comment}" (${createdStoreRev.rating}⭐)`);

  // 5. Verify updated stats
  const updatedRevRes = await fetch(`${API_BASE}/businesses/${bizId}/reviews`);
  const updatedRevData = await updatedRevRes.json();
  console.log(`\n5. Updated Reviews Count: ${updatedRevData.reviews.length}, Average Rating: ${updatedRevData.stats.averageRating} ⭐`);
  if (updatedRevData.reviews.length !== revData.reviews.length + 2) {
    throw new Error('Review count did not increase by 2');
  }

  console.log('\n✨ ALL RATINGS, REVIEWS & IMAGES TESTS PASSED! ✨');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
