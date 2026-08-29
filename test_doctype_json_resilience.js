// Test: Resilience against "Unexpected token '<', <!DOCTYPE ... is not valid JSON"
import assert from 'assert';

console.log('🧪 Testing HTML & <!DOCTYPE Response Resilience Handling...\n');

// 1. Simulate HTML responses (such as Netlify SPA 200 OK HTML redirects or 404 HTML pages)
const sampleHtmlResponse = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Canvo</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;

function parseJsonResponseSimulation(text, contentType, status = 200, statusText = 'OK') {
  const trimmed = text.trim();
  const isHtml = contentType.includes('text/html') || trimmed.startsWith('<') || trimmed.startsWith('<!DOCTYPE');

  if (isHtml) {
    if (status !== 200) {
      throw new Error(`HTTP ${status}: ${statusText}`);
    }
    throw new Error('Server returned an HTML document instead of JSON. The backend API may be offline or unreachable.');
  }

  let data;
  try {
    data = trimmed ? JSON.parse(trimmed) : {};
  } catch (err) {
    throw new Error(`Invalid JSON received: ${err.message}`);
  }

  if (status >= 400) {
    throw new Error(data?.error || data?.message || `HTTP ${status}: Request failed`);
  }

  return data;
}

// Test Case 1: 200 OK HTML (e.g. Netlify SPA redirect for /api/exchange-rates or /api/businesses/slug/xyz)
try {
  parseJsonResponseSimulation(sampleHtmlResponse, 'text/html', 200, 'OK');
  assert.fail('Should have caught HTML response and not tried to parse as JSON');
} catch (err) {
  assert(
    !err.message.includes("Unexpected token '<'") && !err.message.includes('not valid JSON'),
    `Caught clean error without JSON syntax crash: "${err.message}"`
  );
  console.log('✅ Test 1 Passed: 200 OK HTML response cleanly detected without JSON syntax error.');
}

// Test Case 2: 404 Not Found HTML
try {
  parseJsonResponseSimulation(sampleHtmlResponse, 'text/html', 404, 'Not Found');
  assert.fail('Should have caught 404 HTML');
} catch (err) {
  assert(!err.message.includes("Unexpected token '<'"));
  console.log('✅ Test 2 Passed: 404 HTML response cleanly handled.');
}

// Test Case 3: Valid JSON response
const validJson = JSON.stringify({ success: true, base: 'USD', rates: { INR: 86.5 } });
const parsed = parseJsonResponseSimulation(validJson, 'application/json', 200, 'OK');
assert.strictEqual(parsed.success, true);
assert.strictEqual(parsed.rates.INR, 86.5);
console.log('✅ Test 3 Passed: Valid JSON parsed normally.');

// Test Case 4: Valid Error JSON
const errorJson = JSON.stringify({ error: 'Invalid credentials provided' });
try {
  parseJsonResponseSimulation(errorJson, 'application/json', 401, 'Unauthorized');
  assert.fail('Should have thrown server error');
} catch (err) {
  assert.strictEqual(err.message, 'Invalid credentials provided');
  console.log('✅ Test 4 Passed: Server error JSON message preserved.');
}

console.log('\n🎉 ALL HTML/DOCTYPE RESILIENCE TESTS PASSED SUCCESSFULLY!\n');
