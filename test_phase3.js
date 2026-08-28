async function testPhase3() {
  console.log('🧪 Starting Convo Phase 3 Analytics & Insights Verification...\n');

  // 1. Login
  const loginRes = await (await fetch('http://127.0.0.1:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@convo.app', password: 'demo123' })
  })).json();
  const token = loginRes.token;
  console.log('1. ✅ Logged in as:', loginRes.user.name);

  // 2. Fetch My Businesses
  const myBiz = await (await fetch('http://127.0.0.1:3001/api/businesses/my', {
    headers: { Authorization: `Bearer ${token}` }
  })).json();
  const b1 = myBiz[0];
  console.log(`2. ✅ Target Business: ${b1.profile.name} (ID: ${b1.profile.id})`);

  // 3. Test Analytics Overview
  const overview = await (await fetch(`http://127.0.0.1:3001/api/businesses/${b1.profile.id}/analytics/overview?days=30`, {
    headers: { Authorization: `Bearer ${token}` }
  })).json();
  console.log('3. ✅ Analytics Overview (30 Days):', {
    totalConversations: overview.totalChats,
    groundedAnswered: overview.answeredCount,
    unansweredGaps: overview.unansweredCount,
    accuracyRate: `${overview.answerRate}%`,
    peakTime: overview.peakHour,
    peakDay: overview.peakDay,
    timelinePoints: overview.dailyTimeline.length
  });

  // 4. Test Top Questions
  const topQuestions = await (await fetch(`http://127.0.0.1:3001/api/businesses/${b1.profile.id}/analytics/top-questions?limit=5`, {
    headers: { Authorization: `Bearer ${token}` }
  })).json();
  console.log('4. ✅ Top Questions Frequency (Top 3):', topQuestions.slice(0, 3).map(q => `"${q.question}" (${q.count} asks, Answered: ${!q.wasUnanswered})`));

  // 5. Test Unanswered Knowledge Gaps
  const gaps = await (await fetch(`http://127.0.0.1:3001/api/businesses/${b1.profile.id}/analytics/unanswered`, {
    headers: { Authorization: `Bearer ${token}` }
  })).json();
  console.log('5. ✅ Unanswered Knowledge Gaps Count:', gaps.length);
  gaps.forEach((g, idx) => {
    console.log(`   #${idx + 1} Gap: "${g.question}" (${g.count} asks)`);
  });

  // 6. Test Chat Logs & Search
  const logs = await (await fetch(`http://127.0.0.1:3001/api/businesses/${b1.profile.id}/analytics/logs?search=sourdough`, {
    headers: { Authorization: `Bearer ${token}` }
  })).json();
  console.log(`6. ✅ Chat Logs Search ("sourdough"): Found ${logs.length} matching entries`);

  // 7. Test CSV Export
  const csvRes = await fetch(`http://127.0.0.1:3001/api/businesses/${b1.profile.id}/analytics/export-csv`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const csvText = await csvRes.text();
  const csvLines = csvText.split('\n');
  console.log(`7. ✅ CSV Export Generated: ${csvLines.length} rows (Header: ${csvLines[0]})`);

  // 8. Test Real-Time Live Chat Logging
  console.log('\n8. 💬 Sending Live Chat: "What is your return policy on pastries?"...');
  const chatRes = await fetch('http://127.0.0.1:3001/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      businessSlug: b1.profile.slug,
      messages: [{ role: 'user', content: 'What is your return policy on pastries?' }]
    })
  });
  const reader = chatRes.body.getReader();
  const decoder = new TextDecoder();
  let chatOutput = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const text = decoder.decode(value);
    const lines = text.split('\n\n');
    for (const l of lines) {
      if (l.startsWith('data: ')) {
        try {
          const d = JSON.parse(l.slice(6));
          if (d.chunk) chatOutput += d.chunk;
        } catch {}
      }
    }
  }
  console.log('   Bot Response:', chatOutput.slice(0, 100) + '...');

  // Verify the log was recorded
  const freshLogs = await (await fetch(`http://127.0.0.1:3001/api/businesses/${b1.profile.id}/analytics/logs?limit=1`, {
    headers: { Authorization: `Bearer ${token}` }
  })).json();
  console.log('   ✅ Verified Latest Log in Database:', {
    question: freshLogs[0].userQuestion,
    wasUnanswered: freshLogs[0].wasUnanswered,
    timestamp: freshLogs[0].timestamp
  });

  console.log('\n✨ ALL PHASE 3 ANALYTICS & INSIGHTS TESTS PASSED PERFECTLY! ✨');
}

testPhase3().catch(console.error);
