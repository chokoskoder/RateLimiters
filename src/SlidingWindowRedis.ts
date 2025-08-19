class InMemorySlidingWindow {
	private log : number[] = [];
	private readonly limit : number;
	private readonly windowSize : number;

	constructor(limit : number , windowSizeInSeconds : number){
		this.limit = limit;
		this.windowSize = windowSizeInSeconds * 1000;

	}

	public allow() : { allowed : Boolean ; currentCount : number} {
		const now = Date.now();
		const windowStart = now - this.windowSize; // this initializes the window 

		//now we start with the logic on how all of this will work 
		this.log = this.log.filter(timestamp => timestamp > windowStart);
		//to understand this one needs to understand what we are pushing inside
		//our logbook ,which is basically the sliding window  --> we enter the timestamps at which we get
		//the request and this logic helps us to trim the sliding window down to the requests withing our window size limit
		
		if(this.log.length < this.limit){
			this.log.push(now);
			return {allowed : true , currentCount : this.log.length};
		}
		return {allowed : false , currentCount : this.log.length};//we get this only when we have touched our window size limit
	
	}
}

function log(message: string): void {
  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
  console.log(`[${timestamp}] ${message}`);
}

async function runInMemoryDemonstration() {
  log("--- In-Memory Sliding Window Log Demonstration ---");
  
  // --- Configuration ---
  const LIMIT = 10;
  const WINDOW_SEC = 5;
  const limiter = new InMemorySlidingWindow(LIMIT, WINDOW_SEC);

  log(`CONFIG: Limit=${LIMIT} requests per rolling ${WINDOW_SEC}-second window.`);
  const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

  // --- Phase 1: Rapid burst to hit the limit ---
  log(`\n--- PHASE 1: Rapid burst of 20 requests (1 every 100ms). ---`);
  log(`this should ideally block every request after the first 10 becuase this is a burst of 20 requests in just 2 seconds`);
  for (let i = 1; i <= 20; i++) {
    const { allowed, currentCount } = limiter.allow();
    log(`Req #${i.toString().padStart(2)} -> ${allowed ? '✅ ALLOWED' : '❌ BLOCKED'} | Count in window: ${currentCount}`);
    await wait(100);
  }

  // --- Phase 2: Pause to let some requests age out ---
  const PAUSE_DURATION = 2500; // Pause for 2.5  seconds
  log(`\n--- PHASE 2: Pausing for ${PAUSE_DURATION / 1000} seconds. ---`);
  await wait(PAUSE_DURATION);
  log("--- Pause complete. The window has slid forward. Early requests are expiring. ---");

  // --- Phase 3: A second, smaller burst ---
  log(`\n--- PHASE 3: Another burst. Watch how it fills the remaining slots. ---`);
  for (let i = 8; i <= 20; i++) {
    const { allowed, currentCount } = limiter.allow();
    log(`Req #${i.toString().padStart(2)} -> ${allowed ? '✅ ALLOWED' : '❌ BLOCKED'} | Count in window: ${currentCount}`);
    await wait(100);
  }
  
  log("\n--- Demonstration Complete ---");
}

runInMemoryDemonstration();
