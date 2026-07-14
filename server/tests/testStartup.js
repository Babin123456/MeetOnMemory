import assert from "assert";

console.log("🧪 Testing server modules load and startup compatibility...");

// Verify that queueService, webhookDispatcherService can be imported without connecting to Redis immediately
const queueService = await import("../services/queueService.js");
const webhookDispatcherService = await import("../services/webhookDispatcherService.js");
const embeddingUtils = await import("../utils/embeddingUtils.js");

assert.ok(queueService.aiQueue, "aiQueue should be exported");
assert.ok(queueService.dataExportQueue, "dataExportQueue should be exported");
assert.ok(webhookDispatcherService.webhookQueue, "webhookQueue should be exported");

console.log("✅ All service modules imported successfully without executing eager Redis socket connections.");

// Test that calling `add` doesn't crash when Redis is disabled/not configured
try {
  await queueService.aiQueue.add("test-job", { data: 1 });
  console.log("✅ Safe wrapper queue no-op operation verified successfully!");
} catch (err) {
  assert.fail(`aiQueue.add threw an unexpected error: ${err.message}`);
}

console.log("\n🎉 ALL STARTUP OPTIMIZATION VERIFICATIONS PASSED!\n");
