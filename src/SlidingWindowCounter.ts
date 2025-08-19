class SlidingWindowRateLimiter{
    private window_size : number ; 
    private max_requests : number ; 
    private current_window : number ; 
    private request_count : number;
    private prev_count : number ; 

    constructor(windowSize : number , maxRequests : number){
        this.window_size = windowSize;
        this.max_requests = maxRequests; 
        this.current_window = Math.floor((Date.now())/1000/this.window_size) ; //need to figure out how to fw 5 here
        this.request_count = 0;
        this.prev_count = 0;
    }

    //now we need to write the allow function 
    public allow(){
        /*
        the logix we need to write here is pretty simple : 
        1 -> check if the window has moved forward 
        2 -> check how much the window has moved forward 
        3 -> update prev_count and request_count is set to 0 
        4 -> update the current_count using the updated prev_count 
        5 -> check now if threshold (max_requests) has been reached , update req_count based on threshold
        Et voila
        */

        const now = Math.floor(Date.now() / 1000) ;
        const window = now / this.window_size;
        
        if(window > this.current_window){
            const windowsPassed = window - this.current_window;
            if(windowsPassed > 1){
                this.prev_count = 0; 
            }
            else{
                this.prev_count = this.request_count
            }
            this.request_count = 0; 
            this.current_window = window;
        }
        const windowElapsed = (now % this.window_size) / this.window_size
        const weightedRequests = this.request_count + ((1-windowElapsed)*this.prev_count);

        console.log(
            `Current Count: ${this.request_count}, ` +
            `Previous Count: ${this.prev_count}, ` +
            `Weighted Count: ${weightedRequests.toFixed(2)}`
        );

        if(weightedRequests<this.max_requests){
            this.request_count++;
            return true;
        }

        return false;


    }
    

}

// Helper function to pause execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function demonstrateLimiter() {
    console.log("--- Starting Demonstration: 5 requests per 10 seconds ---");
    const limiter = new SlidingWindowRateLimiter(10, 5); // 10-second window, 5 max requests

    // Phase 1: Send an initial burst to hit the limit
    console.log("\nPHASE 1: Initial Burst...");
    for (let i = 1; i <= 6; i++) { 
        await delay(200); // Send requests quickly
        const allowed = limiter.allow();
        console.log(`Request #${i}: ${allowed ? '✅ Allowed' : '❌ Blocked'}`);
    }

    // Phase 2: Wait until the end of the first window and try again
    console.log("\nPHASE 2: Waiting 7 seconds, now at the end of the first window...");
    await delay(7000); // Total elapsed time is now ~8 seconds
    const allowedAfterWait = limiter.allow();
    console.log(`Request #7 (at ~8s): ${allowedAfterWait ? '✅ Allowed' : '❌ Blocked'}`);

    // Phase 3: Wait until we are in the next window
    console.log("\nPHASE 3: Waiting 4 seconds, now in the second window...");
    await delay(4000); // Total elapsed time is now ~12 seconds
    for (let i = 8; i <= 12; i++) {
        await delay(200);
        const allowed = limiter.allow();
        console.log(`Request #${i} (at ~12s): ${allowed ? '✅ Allowed' : '❌ Blocked'}`);
    }

    // Phase 4: Wait long enough to skip a full window
    console.log("\nPHASE 4: Waiting 15 seconds, skipping a window...");
    await delay(15000); // Total elapsed time is now ~27 seconds
    const allowedAfterSkip = limiter.allow();
    console.log(`Request #13 (at ~27s): ${allowedAfterSkip ? '✅ Allowed' : '❌ Blocked'}`);
}

demonstrateLimiter();