/*
This one is way simpler than the previous one

we will be hardcoding tasks which will be the added to the CPU sim one by one like they should be , for that we will first hardcode the tasks
*/

type Task = {
    period : number;
    compTime : number;
    remainingCompTime : number;
    entryTime : number;
    taskId : number;
}

class RateMonotonic{
    tasks : Task[];
    readyQueue : Task[];
    timeElapsed : number = 0;
    lastExecuted : Task | null  = null;

    private constructor(){
        this.tasks = [];
        this.readyQueue = [];
    }

    static async create() : Promise<RateMonotonic>{
        const instance = new RateMonotonic()
        instance.tasks = await instance.initialiseHardCodedTasks();
        instance.simulationProgram();
        return instance;
    }

    private async initialiseHardCodedTasks(): Promise<Task[]> {
    console.log("Starting with hardcoding of tasks....");
    await new Promise(resolve => setTimeout(resolve , 1000))
    console.log("hardcoding done!")
    return [
      { period: 4, compTime: 1, remainingCompTime: 1, entryTime: 0, taskId: 0 },
      { period: 6, compTime: 2, remainingCompTime: 2, entryTime: 0, taskId: 1 },
      { period: 8, compTime: 1, remainingCompTime: 1, entryTime: 0, taskId: 2 },
      { period: 10, compTime: 3, remainingCompTime: 3, entryTime: 0, taskId: 3 },
      { period: 12, compTime: 2, remainingCompTime: 2, entryTime: 0, taskId: 4 },
      { period: 15, compTime: 4, remainingCompTime: 4, entryTime: 0, taskId: 5 },
      { period: 18, compTime: 3, remainingCompTime: 3, entryTime: 0, taskId: 6 },
      { period: 20, compTime: 5, remainingCompTime: 5, entryTime: 0, taskId: 7 },
      { period: 24, compTime: 6, remainingCompTime: 6, entryTime: 0, taskId: 8 },
      { period: 30, compTime: 7, remainingCompTime: 7, entryTime: 0, taskId: 9 }
    ];
  }

  addTask(task : Task){
    task.entryTime = this.timeElapsed; // Set entry time when adding to queue
    let insertIndex = 0;
    while (insertIndex < this.readyQueue.length && 
           task.period >= this.readyQueue[insertIndex].period) {
        insertIndex++;
    }
    this.readyQueue.splice(insertIndex, 0, task);

    if (insertIndex === 0 && this.readyQueue.length > 1) {
        console.log(`Task ${task.taskId} preempted task ${this.readyQueue[1].taskId}`);
    } else {
        console.log(`Task ${task.taskId} inserted at position ${insertIndex}`);
    }
}

  sigma() : number{
    //here we need to check the same thing we checked last time for cpu_util
    let sigma = 0; 
    for(let task of  this.tasks){
        sigma += task.compTime/task.period; // Fixed: should be compTime/period
    }
    return sigma;
  }

  musigma(n : number) : number{
    let musigma = 0;
    musigma = (n) * (2**(1/n)); // Fixed: should be 1/n, not 1/(n-1)
    return musigma;
  }

  //1 -> Normal execution
  //2 -> Task completed
  //0 -> Nothing to execute
  //-1 -> Deadline missed
  executionProgram() : number{
    if(this.readyQueue.length == 0){
        this.timeElapsed++;
        return 0;
    }

    this.timeElapsed++;
    let executionTask = this.readyQueue[0];
    if(executionTask.remainingCompTime <= 0){
        throw new Error("Task has invalid remaining time");
    }
    executionTask.remainingCompTime--;
    if((executionTask.remainingCompTime + 1 == executionTask.compTime) || (executionTask != this.lastExecuted && this.lastExecuted != null ) ){
        console.log(`system has started the xecution of task : ${executionTask.taskId} at time ${this.timeElapsed - 1}`)
    }

    this.lastExecuted = executionTask;

    if(executionTask.remainingCompTime == 0){
        if(executionTask.entryTime + executionTask.period >= this.timeElapsed){
            console.log(`At time ${this.timeElapsed} the task ${executionTask.taskId} has been executed to the finish line`);
            this.readyQueue.shift();
            return 2;
        }
        else {
            console.log(`the task ${executionTask.taskId} missed the finish line LOL`)
            this.readyQueue.shift(); 
            return -1;
        }
    }

    return 1;
  }

    simulationProgram(){
    console.log("simulation has started");
    let completionFlag = this.sigma() <=  this.musigma(this.tasks.length);
    if(completionFlag){
        console.log("we will be able to succesfully simulate all the tasks");
    }
    else{
        console.log("there MIGHT be an issue while simulation all the tasks")
    }

    console.log(`CPU Utilization: ${(this.sigma() * 100).toFixed(2)}%`);
    console.log(`Liu & Layland Bound: ${(this.musigma(this.tasks.length) * 100).toFixed(2)}%`);
  }

  runSimulation(maxTime: number = 60): void {
    console.log("Starting main simulation loop...");
    
    while(this.timeElapsed < maxTime) {
        for(let task of this.tasks) {
            if(this.timeElapsed % task.period === 0 && this.timeElapsed > 0) {
                let newInstance: Task = {
                    period: task.period,
                    compTime: task.compTime,
                    remainingCompTime: task.compTime,
                    entryTime: this.timeElapsed,
                    taskId: task.taskId
                };
                this.addTask(newInstance);
            }
        }
        let result = this.executionProgram();
        if(result === -1) {
            console.log("Simulation stopped due to deadline miss");
            break;
        }

        if(this.readyQueue.length === 0 && this.timeElapsed > 30) {
            console.log("No more tasks to execute");
            break;
        }
    }
    
    console.log(`Simulation ended at time ${this.timeElapsed}`);
  }
}

async function RunCpuSim(){
    const simOne = await RateMonotonic.create();
    console.log("Siulation has been initiated");
    
    for(let task of simOne.tasks) {
        let initialInstance: Task = {
            period: task.period,
            compTime: task.compTime,
            remainingCompTime: task.compTime,
            entryTime: 0,
            taskId: task.taskId
        };
        simOne.addTask(initialInstance);
    }
    
    simOne.runSimulation(60);
}

RunCpuSim();