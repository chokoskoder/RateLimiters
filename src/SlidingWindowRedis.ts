Class InMemorySlidingWindow {
	private log : number[] = [];
	private readonly limit : number;
	private readonly windowSize : number;

	constructor(limit : number , windowSizeInSeconds : number){
		this.limit = limit;
		this.windowSize = windowSizeInSeconds * 1000;

	}

	public allow() : { allowed : Boolean ; currentCount : number} {
		const now = Date.now;
		const windowStart = now - this.windowSize; // this initializes the window 

		//now we start with the logic on how all of this will work 
		this.log = this.log.filter(timestamp => timestamp > windowStart);
		//to understand this one needs to understand what we are pushing inside
		//our logbook ,which is basically the sliding window  --> we enter the timestamps at which we get
		//the request and this logic helps us to trim the sliding window down to the requests withing our window size limit
		
		if(this.log.length < this.limit){
			this.log.push(now);
			return {allowed : True , currentCount : this.log.length};
		}
		return {allowed : False , currentCount : this.log.length};//we get this only when we have touched our window size limit
	
	}
}
