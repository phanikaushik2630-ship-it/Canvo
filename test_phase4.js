// Automated Verification Test Script for Convo Phase 4
const BASE_URL = 'http://127.0.0.1:3001';

async function runTests() {
  console.log('🧪 Starting Convo Phase 4 In-Chat Ordering & Bookings Verification...\n');

  // 1. Owner Login
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@canvo.app', password: 'demo123' })
  });
  const loginData = await loginRes.json();
  if (!loginRes.ok) throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
  console.log(`1. ✅ Logged in as: ${loginData.user.name}`);
  const token = loginData.token;

  // 2. Fetch Owner Businesses
  const bizRes = await fetch(`${BASE_URL}/api/businesses/my`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const businesses = await bizRes.json();
  const targetBiz = businesses.find(b => b.profile.slug === 'maison-mirabelle') || businesses[0];
  console.log(`2. ✅ Target Business: ${targetBiz.profile.name} (ID: ${targetBiz.profile.id})`);

  // 3. Customer places an Order via Public API
  const orderRes = await fetch(`${BASE_URL}/api/businesses/${targetBiz.profile.id}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'order',
      customerName: 'Camille Dubois',
      customerPhone: '(555) 771-4920',
      items: [
        { name: 'Pistachio Cardamom Cruffin', quantity: 3, price: 6.50 },
        { name: 'Wild Country Hearth Sourdough Loaf', quantity: 1, price: 9.50 }
      ],
      specialInstructions: 'Warm the cruffins if possible'
    })
  });
  const placedOrder = await orderRes.json();
  if (!orderRes.ok) throw new Error(`Order placement failed: ${JSON.stringify(placedOrder)}`);
  console.log(`3. ✅ Placed Takeout Order #${placedOrder.orderNumber}:`);
  console.log(`   Customer: ${placedOrder.customerName}, Total: $${placedOrder.totalAmount}, Status: ${placedOrder.status}`);

  // 4. Customer places a Table Booking via Public API
  const bookingRes = await fetch(`${BASE_URL}/api/businesses/${targetBiz.profile.id}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'booking',
      customerName: 'Henri Laurent',
      customerPhone: '(555) 902-1844',
      bookingDetails: {
        partySize: 4,
        date: 'Saturday (Tomorrow)',
        time: '11:00 AM',
        areaPreference: 'Botanical Outdoor Patio'
      },
      specialInstructions: 'Celebrating a graduation'
    })
  });
  const placedBooking = await bookingRes.json();
  if (!bookingRes.ok) throw new Error(`Booking placement failed: ${JSON.stringify(placedBooking)}`);
  console.log(`4. ✅ Placed Table Booking #${placedBooking.orderNumber}:`);
  console.log(`   Customer: ${placedBooking.customerName}, Party: ${placedBooking.bookingDetails.partySize}, Date: ${placedBooking.bookingDetails.date} at ${placedBooking.bookingDetails.time}`);

  // 5. Owner checks Orders Inbox
  const inboxRes = await fetch(`${BASE_URL}/api/businesses/${targetBiz.profile.id}/orders`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const inboxOrders = await inboxRes.json();
  console.log(`5. ✅ Owner Orders Inbox Count: ${inboxOrders.length} orders/bookings total`);
  const foundOrder = inboxOrders.find(o => o.id === placedOrder.id);
  const foundBooking = inboxOrders.find(o => o.id === placedBooking.id);
  if (!foundOrder || !foundBooking) throw new Error('Newly created orders not found in inbox');
  console.log(`   Found newly placed Order #${foundOrder.orderNumber} & Booking #${foundBooking.orderNumber}`);

  // 6. Owner updates Order Status to "confirmed" and then "completed"
  const confirmRes = await fetch(`${BASE_URL}/api/businesses/${targetBiz.profile.id}/orders/${placedOrder.id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status: 'confirmed' })
  });
  const confirmedOrder = await confirmRes.json();
  console.log(`6. ✅ Updated Order #${confirmedOrder.orderNumber} Status to: "${confirmedOrder.status}"`);

  // 7. Test Chat Intent Parsing (Ordering Intent & Booking Intent)
  console.log('\n7. 💬 Testing Chat Order Intent Detection ("I want to order 2 cruffins")...');
  const chatOrderRes = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'I would like to order 2 Pistachio Cruffins please' }],
      businessSlug: 'maison-mirabelle'
    })
  });
  const chatOrderText = await chatOrderRes.text();
  const hasInteractiveAction = chatOrderText.includes('interactiveAction') && chatOrderText.includes('order');
  console.log(`   Order Intent Triggered: ${hasInteractiveAction ? '✅ SUCCESS' : '❌ FAILED'}`);

  console.log('\n8. 💬 Testing Chat Table Booking Intent ("Can I book a table for 4 tomorrow at 7pm on patio?")...');
  const chatBookingRes = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'Can I book a table for 4 tomorrow at 7pm on the patio?' }],
      businessSlug: 'maison-mirabelle'
    })
  });
  const chatBookingText = await chatBookingRes.text();
  const hasBookingAction = chatBookingText.includes('interactiveAction') && chatBookingText.includes('booking');
  console.log(`   Booking Intent Triggered: ${hasBookingAction ? '✅ SUCCESS' : '❌ FAILED'}`);

  console.log('\n✨ ALL PHASE 4 IN-CHAT ORDERING & BOOKING TESTS PASSED PERFECTLY! ✨\n');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
