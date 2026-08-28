// Test script for Forgot Password, Reset Password, and Account Switching
const BASE_URL = 'http://127.0.0.1:3001';

async function testAuthFlow() {
  console.log('🧪 1. Testing Forgot Password Request...');
  const res1 = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@canvo.app' })
  });
  const data1 = await res1.json();
  console.log('Forgot Password response:', data1);
  if (!res1.ok || !data1.success) throw new Error('Forgot password request failed');
  console.log('✅ Forgot password request: PASS\n');

  console.log('🧪 2. Testing Password Reset to "newdemo123"...');
  const res2 = await fetch(`${BASE_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@canvo.app', newPassword: 'newdemo123' })
  });
  const data2 = await res2.json();
  console.log('Reset Password response:', data2);
  if (!res2.ok || !data2.token) throw new Error('Reset password failed');
  console.log('✅ Reset password: PASS\n');

  console.log('🧪 3. Testing Login with New Password "newdemo123"...');
  const res3 = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@canvo.app', password: 'newdemo123' })
  });
  const data3 = await res3.json();
  if (!res3.ok || !data3.token) throw new Error('Login with new password failed');
  console.log(`✅ Login with new password successful for: ${data3.user.name} (${data3.user.email})\n`);

  console.log('🧪 4. Resetting Demo Password back to standard "demo123"...');
  const res4 = await fetch(`${BASE_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@canvo.app', newPassword: 'demo123' })
  });
  const data4 = await res4.json();
  if (!res4.ok) throw new Error('Failed to restore demo123 password');
  console.log('✅ Demo password restored to demo123: PASS\n');

  console.log('🧪 5. Testing Multi-Tenant Account Isolation & Switch Verification...');
  const testEmail = `owner_${Date.now()}@example.com`;
  const res5 = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Alex Rivera', email: testEmail, password: 'password123' })
  });
  const data5 = await res5.json();
  console.log(`Created new owner: ${data5.user.name} (${data5.user.email})`);
  if (!res5.ok || data5.user.email !== testEmail) throw new Error('User registration test failed');

  // Verify /api/auth/me returns the exact new user
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { 'Authorization': `Bearer ${data5.token}` }
  });
  const meData = await meRes.json();
  console.log(`/api/auth/me active user: ${meData.user.name} (${meData.user.email})`);
  if (meData.user.email !== testEmail) throw new Error('Account switch token identity mismatch');

  console.log('\n✨ ALL AUTHENTICATION, PASSWORD RESET & ACCOUNT SWITCH TESTS PASSED! ✨');
}

testAuthFlow().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
