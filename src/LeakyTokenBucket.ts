

export class LeakyBucketRateLimiter {
  private readonly capacity: number;
  private readonly leakRate: number; 
  private queue: number[] = [];
  private lastLeakTime: number = Date.now();

  constructor(capacity: number, leakRate: number) {
    this.capacity = capacity;
    this.leakRate = leakRate;
  }

  public get currentQueueSize(): number {
    return this.queue.length;
  }

  private leak(): void {
    const now = Date.now();
    const elapsedTime = now - this.lastLeakTime;
    const leaks = Math.floor(elapsedTime / this.leakRate);

    if (leaks > 0) {
      const leakedItems = this.queue.splice(0, leaks);
      if (leakedItems.length > 0) {
         this.lastLeakTime += leakedItems.length * this.leakRate;
      }
    }
  }

  public allow(): boolean {
    this.leak();
    if (this.queue.length < this.capacity) {
      this.queue.push(Date.now());
      return true;
    }
    return false;
  }
}



function log(message: string): void {
  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
  console.log(`[${timestamp}] ${message}`);
}


async function runDemonstration() {
  log("--- Starting Leaky Bucket Demonstration ---");
  
  const BUCKET_CAPACITY = 10;
  const LEAK_RATE_MS = 5000; // Leaks 1 request every 5 seconds
  const limiter = new LeakyBucketRateLimiter(BUCKET_CAPACITY, LEAK_RATE_MS);

  log(`Configuration: Capacity=${BUCKET_CAPACITY}, Leak Rate=1 req/${LEAK_RATE_MS}ms`);
  log("--- Simulating a rapid burst of 15 requests (1 every 100ms) ---");

  // A helper to wait for a specific amount of time
  const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

  // --- Phase 1: Rapid Burst ---
  for (let i = 1; i <= 15; i++) {
    const isAllowed = limiter.allow();
    const status = isAllowed ? "✅ ALLOWED" : "❌ BLOCKED";
    log(`Request #${i}... [${status}] | Queue: ${limiter.currentQueueSize}/${BUCKET_CAPACITY}`);
    await wait(1000); // Fire requests every second
  }

  log("\n--- Burst finished. No new requests for 5 seconds. ---");
  log("--- Observe the queue leaking out over time... ---\n");

  // --- Phase 2: Observe the Leak ---
  for (let i = 1; i <= 5; i++) {
    // Manually trigger a leak check to update the queue state
    limiter['leak'](); // Accessing private method for demo purposes
    log(`<< STATUS >> Queue: ${limiter.currentQueueSize}/${BUCKET_CAPACITY}`);
    await wait(5000);
  }

  log("\n--- Simulating a slow, steady stream of requests ---");
  
  // --- Phase 3: Steady Stream ---
  for (let i = 16; i <= 25; i++) {
    const isAllowed = limiter.allow();
    const status = isAllowed ? "✅ ALLOWED" : "❌ BLOCKED";
    log(`Request #${i}... [${status}] | Queue: ${limiter.currentQueueSize}/${BUCKET_CAPACITY}`);
    await wait(400); // Requests arrive slightly faster than the leak rate
  }
  
  log("\n--- Demonstration Complete ---");
}

// Start the magic
runDemonstration();

