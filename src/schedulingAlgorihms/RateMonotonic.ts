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

    constructor(){
        this.tasks = this.initialiseHardCodedTasks()
    }

  initialiseHardCodedTasks(): Task[] {
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
  
}