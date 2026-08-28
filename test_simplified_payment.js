// Test Simplified Payment Preference Flow
const BASE_URL = 'http://127.0.0.1:3001';

async function testPaymentPreference() {
  console.log('💳 Testing Simplified Payment Preference Flow (UPI vs Cash)...');

  // 1. Get business info for maison-mirabelle
  const bRes = await fetch(`${BASE_URL}/api/businesses/slug/maison-mirabelle`);
  const data = await bRes.json();
  const business = data.profile;
  console.log(`- Business: ${business.name} (ID: ${business.id})`);

  // 2. Submit UPI Order
  console.log('\n- Submitting UPI Order (2 Cardamom Chai Buns)...');
  const upiRes = await fetch(`${BASE_URL}/api/businesses/${business.id}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'order',
      customerName: 'Aarav Patel',
      customerPhone: '+91 98200 12345',
      paymentPreference: 'UPI',
      items: [{ name: 'Cardamom Chai Bun', quantity: 2, price: 180 }],
      totalAmount: 360,
      specialInstructions: 'Packing for takeaway'
    })
  });
  const upiOrder = await upiRes.json();
  console.log(`  ✅ UPI Order Created: #${upiOrder.orderNumber}`);
  console.log(`     Customer: ${upiOrder.customerName}, Phone: ${upiOrder.customerPhone}`);
  console.log(`     Payment Preference: ${upiOrder.paymentPreference}`);
  console.log(`     Total: ₹${upiOrder.totalAmount}`);

  if (upiOrder.paymentPreference !== 'UPI') {
    throw new Error(`Expected UPI paymentPreference, got: ${upiOrder.paymentPreference}`);
  }

  // 3. Submit Cash Order
  console.log('\n- Submitting Cash Order (1 Classic Sourdough Loaf)...');
  const cashRes = await fetch(`${BASE_URL}/api/businesses/${business.id}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'order',
      customerName: 'Priya Sharma',
      customerPhone: '+91 98111 67890',
      paymentPreference: 'Cash',
      items: [{ name: 'Classic Sourdough Loaf', quantity: 1, price: 350 }],
      totalAmount: 350,
      specialInstructions: 'Warm sliced if possible'
    })
  });
  const cashOrder = await cashRes.json();
  console.log(`  ✅ Cash Order Created: #${cashOrder.orderNumber}`);
  console.log(`     Customer: ${cashOrder.customerName}, Phone: ${cashOrder.customerPhone}`);
  console.log(`     Payment Preference: ${cashOrder.paymentPreference}`);
  console.log(`     Total: ₹${cashOrder.totalAmount}`);

  if (cashOrder.paymentPreference !== 'Cash') {
    throw new Error(`Expected Cash paymentPreference, got: ${cashOrder.paymentPreference}`);
  }

  // 4. Verify orders list in Owner Dashboard API (Login as demo user)
  console.log('\n- Logging in as owner to verify Orders inbox feed...');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@convo.app', password: 'demo123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;

  const listRes = await fetch(`${BASE_URL}/api/businesses/${business.id}/orders`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const allOrders = await listRes.json();
  const foundUpi = allOrders.find(o => o.id === upiOrder.id);
  const foundCash = allOrders.find(o => o.id === cashOrder.id);

  if (!foundUpi || foundUpi.paymentPreference !== 'UPI') {
    throw new Error('Failed to find UPI order in owner feed with payment preference');
  }
  if (!foundCash || foundCash.paymentPreference !== 'Cash') {
    throw new Error('Failed to find Cash order in owner feed with payment preference');
  }

  console.log('  ✅ Found both UPI and Cash orders in owner inbox feed!');
  console.log(`     Order #${foundUpi.orderNumber} -> Payment Method: ${foundUpi.paymentPreference}`);
  console.log(`     Order #${foundCash.orderNumber} -> Payment Method: ${foundCash.paymentPreference}`);
  console.log('\n✨ ALL SIMPLIFIED PAYMENT PREFERENCE TESTS PASSED! ✨');
}

testPaymentPreference().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
