// Test Verification for 2-Step OTP Password Reset System
const BASE_URL = 'http://127.0.0.1:3001';

async function testOtpSystem() {
  console.log('🧪 1. Requesting 6-digit OTP code for demo@convo.app...');
  const res1 = await fetch(`${BASE_URL}/api/auth/forgot-password/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@convo.app' })
  });
  const data1 = await res1.json();
  console.log('Server response:', data1);
  if (!res1.ok || !data1.simulatedOtp) throw new Error('Failed to generate OTP');
  console.log(`✅ Generated 6-digit OTP: [ ${data1.simulatedOtp} ]\n`);

  console.log('🧪 2. Testing Invalid OTP code rejection (e.g. 999999)...');
  const res2 = await fetch(`${BASE_URL}/api/auth/forgot-password/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@convo.app', otp: '999999', newPassword: 'newsecurepass123' })
  });
  const data2 = await res2.json();
  console.log('Rejection response:', data2);
  if (res2.ok) throw new Error('Invalid OTP was accepted when it should be rejected');
  console.log('✅ Invalid OTP correctly rejected: PASS\n');

  console.log(`🧪 3. Verifying with Valid OTP [ ${data1.simulatedOtp} ] & resetting password to "otpdemo123"...`);
  const res3 = await fetch(`${BASE_URL}/api/auth/forgot-password/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@convo.app', otp: data1.simulatedOtp, newPassword: 'otpdemo123' })
  });
  const data3 = await res3.json();
  console.log('Success response:', data3);
  if (!res3.ok || !data3.token) throw new Error('Valid OTP verification failed');
  console.log('✅ OTP verified & password reset successfully: PASS\n');

  console.log('🧪 4. Testing Login with Newly Reset Password "otpdemo123"...');
  const res4 = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@convo.app', password: 'otpdemo123' })
  });
  const data4 = await res4.json();
  if (!res4.ok || !data4.token) throw new Error('Login with new password failed');
  console.log(`✅ Logged in successfully as: ${data4.user.name} (${data4.user.email})\n`);

  console.log('🧪 5. Restoring standard demo credentials ("demo123")...');
  const res5 = await fetch(`${BASE_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@convo.app', newPassword: 'demo123' })
  });
  const data5 = await res5.json();
  if (!res5.ok) throw new Error('Failed to restore demo123 password');
  console.log('✅ Demo password restored to demo123: PASS\n');

  console.log('✨ ALL 2-STEP OTP EMAIL VERIFICATION & RECOVERY TESTS PASSED! ✨');
}

testOtpSystem().catch(err => {
  console.error('OTP Test Failed:', err);
  process.exit(1);
});
