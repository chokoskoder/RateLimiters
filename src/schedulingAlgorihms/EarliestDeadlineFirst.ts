/*
so a high level overview of what we are going to do today :
I : The class we need:  -> we need a TYPE or an INTERFACE not a class
we need a task class which will have the following:
arrival , execution , deadline , period , absArrival , execution_copy , absDeadline , instance

II : we need to define the functions needed
get tasks -> allows the user to enter all the tasks needed HARD_CODED for now
hyperperiod calculation -> we need to calculate the LCM of the execution times of our tasks to see how much time do we need to complete ONE ROUND of our task set DONE
cpu_util -> to check what the task set doesnt need more than the avalaible cpu power DONE
GCD and LCM -> self explanatory DONE 
min -> to find the EARLIEST DEADLINE and then work on it DONE
update_abs_arrival DONE
update_abs_deadline DONE
copy_excution_time -> this is to make sure that we are able to maintain how much remaining time is needed to execute a task OR if we need to start the task again , thus adding to its instance DONE


III: there is somehting like a timer being used in the code i am taking inspiration from and it is confusing me as hell 
so apparently we will need to have a maloc 
*/

import * as readline from 'readline';
// Assuming 'compute-lcm' is available. In a browser/node environment, you'd need to install it.
// For this example, we'll mock it if it doesn't exist.
const lcm = (arr: number[]) => {
    if (!arr || arr.length === 0) return 0;
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const lcm_two = (a: number, b: number) => (a * b) / gcd(a, b);
    return arr.reduce((a, b) => lcm_two(a, b));
};




//Lets start with the class 
type Task = {
arrival : number;
execution : number;
deadline : number;
period : number;
absArrival : number;
executionCopy : number;
absDeadline : number;
instance : number;
alive : boolean;
}

/*
I will be going with a class architecture , and will document all the things i went throgh for this architecture here:
so at first we need a private object array to store all the tasks 
then we need a public function which will allow to communicate to the setTasks functions and also display the cpu scheduling simulation 
*/


class CPUSchedulingSimulation{
    private tasks : Task[];
    private timer : number = 0;

        constructor() {
        this.tasks = [];
        this.initializeHardcodedTasks();
    }
    initializeHardcodedTasks(): void {
        const hardcodedTasks: Task[] = [
    {
        arrival: 0,
        execution: 1,
        deadline: 4,
        period: 4,
        absArrival: 0,
        executionCopy: 1,
        absDeadline: 0,
        instance: 0,
        alive: false
    },
    {
        arrival: 0,
        execution: 2,
        deadline: 6,
        period: 6,
        absArrival: 0,
        executionCopy: 2,
        absDeadline: 0,
        instance: 0,
        alive: false
    },
    {
        arrival: 0,
        execution: 1,
        deadline: 8,
        period: 8,
        absArrival: 0,
        executionCopy: 1,
        absDeadline: 0,
        instance: 0,
        alive: false
    }
        ];
        this.tasks = hardcodedTasks;
        console.log("...[System Initializing]...");
        console.log("3 hardcoded tasks initialized!");
    }

    cpu_util(n : number) : number {

        let i = 0 ; 
        let cpu_utilisation = 0;
        while(i<n){
            cpu_utilisation += this.tasks[i].execution/this.tasks[i].period
            i++;
        }
        return cpu_utilisation;
    } //works fine

    hyperPeriodCalc(n : number) : number {
       const periods = this.tasks.map(task => task.period );
       return lcm(periods) || 0;
    } //works fine

    findEarliestDeadline(n : number){
        let earliestDeadline = Infinity;
        let selectedTaskId = -1; // Changed from -1 to indicate no task found
        let i = 0; 
        while(i<n){
            if(earliestDeadline > this.tasks[i].absDeadline && this.tasks[i].alive){
                earliestDeadline = this.tasks[i].absDeadline;
                selectedTaskId = i;
            }
            i++;
        }
        return selectedTaskId;

    } //works as intended

    updateAbsoluteArrivalTime(n : number , all : number , taskId : number){
        let i = 0 ; 
        if(all){
            while(i<n){
                this.tasks[i].absArrival = this.tasks[i].arrival + (this.tasks[i].period * this.tasks[i].instance)
                i++;
            }

        }
        else {
            this.tasks[taskId].absArrival = this.tasks[taskId].arrival + (this.tasks[taskId].period * this.tasks[taskId].instance)
        }
    } // fixed

    updateAbsoluteDeadlineTime(n : number , all : number , taskId : number){
        let i = 0 ; 
        if(all){
            while(i<n){
                this.tasks[i].absDeadline = this.tasks[i].deadline + this.tasks[i].absArrival            
                i++;
            }

        }
        else {
                this.tasks[taskId].absDeadline = this.tasks[taskId].deadline + this.tasks[taskId].absArrival
        }
    } //fixed 

    copyExecutionTime(n : number , all : number , taskId : number){
        let i = 0;
        if(all){
            while(i<n){
                this.tasks[i].executionCopy = this.tasks[i].execution;
                i++;
            }
        }
        else {
            this.tasks[taskId].executionCopy = this.tasks[taskId].execution;
        }
    } //works just fine 

    schedulingPointInterrupt(n : number) : boolean{
        let i = 0 , a = 0 , n1 = 0 ; 
        let newArrival = false;
        while(i<n){
            if(this.tasks[i].absArrival == this.timer){
                this.tasks[i].alive = true;
                console.log(`\t -> [Interrupt] Task ${i} has arrived at time ${this.timer} and is now alive.`);
                newArrival = true;
                a++;
            }
            i++;
        }
        i = 0;
        while(i<n){
            if(this.tasks[i].alive === false){
                n1++;
            }
            i++;
        }

        if(n1 == n || a != 0 ){
            return true;
        }
        return false;
    }//works fine

    public SimulationProgram(){
        console.log("...[Reading Task Set]...");
        console.log("Task 0:", this.tasks[0]);
        console.log("Task 1:", this.tasks[1]);
        console.log("Task 2:", this.tasks[2]);
        console.log("-------------------------------------------------");

        let activeTaskId : number | undefined = -1;
        let cpu_utilisation = this.cpu_util(3);
        
        console.log(`...[Calculating CPU Utilization]...`);
        console.log(`CPU Utilization: ${cpu_utilisation.toFixed(2)}`);  //for now all the values of n will be hardcoded to be 10
        if(cpu_utilisation>1){
            console.error("!!! [ERROR] CPU Utilization exceeds 1. Task set is not schedulable. !!!");
            return;
        }
        else {
            console.log("...[CPU Check Passed]... Task set may be schedulable.");
        }
        let hyperPeriod = this.hyperPeriodCalc(3);
        console.log(`...[Calculating Hyper-period]...`);
        console.log(`Simulation will run for one Hyper-period: ${hyperPeriod} time units.`);
        console.log("-------------------------------------------------");
        console.log("...[Simulation Starting]...");


        this.copyExecutionTime(3 , 1 , 0);
        this.updateAbsoluteArrivalTime(3 , 1 , 0);
        this.updateAbsoluteDeadlineTime(3 , 1 , 0);

        while(this.timer <= hyperPeriod){
            console.log(`\n[Time: ${this.timer}]`);
            if(this.schedulingPointInterrupt(3)){
                console.log("\t -> [Scheduler] Scheduling point reached. Finding highest priority task (Earliest Deadline).");
                activeTaskId = this.findEarliestDeadline(3);
                 if(activeTaskId !== -1){
                    console.log(`\t -> [Scheduler] Selected Task ${activeTaskId} as active task.`);
                }
            }
            
            // NOTE: This check might not work as intended. findEarliestDeadline returns -1, not Infinity.
            if(activeTaskId == -1 ){
                console.log("...[CPU Idle]...");
            }

            if(activeTaskId != -1){
                if(activeTaskId != undefined){
                    console.log(`\t -> [CPU] Executing Task ${activeTaskId}. Remaining time: ${this.tasks[activeTaskId].executionCopy}`);
                    if(this.tasks[activeTaskId].executionCopy > 0 ){
                        this.tasks[activeTaskId].executionCopy-- ;
                    }

                    if( this.tasks[activeTaskId].executionCopy == 0){
                        console.log(`\t -> [Task Manager] Task ${activeTaskId} has completed its execution.`);
                        // NOTE: This check might not work for task 0, as 0 is a falsy value.
                        if(activeTaskId !== undefined){
                            this.tasks[activeTaskId].instance++;
                            this.tasks[activeTaskId].alive = false;
                            console.log(`\t -> [Task Manager] Updating Task ${activeTaskId} to instance ${this.tasks[activeTaskId].instance}.`);
                            this.copyExecutionTime(3 , 0 , activeTaskId);
                            this.updateAbsoluteArrivalTime(3 , 0 , activeTaskId);
                            this.updateAbsoluteDeadlineTime(3 , 0 , activeTaskId);
                            console.log(`\t -> [Task Manager] New Absolute Arrival for Task ${activeTaskId}: ${this.tasks[activeTaskId].absArrival}`);
                            console.log(`\t -> [Task Manager] New Absolute Deadline for Task ${activeTaskId}: ${this.tasks[activeTaskId].absDeadline}`);
                        }

                        activeTaskId = this.findEarliestDeadline(3);
                        if(activeTaskId !== -1){
                             console.log(`\t -> [Scheduler] Preemptively switching to new active task: Task ${activeTaskId}`);
                        } else {
                             console.log(`\t -> [Scheduler] No other tasks are ready to run.`);
                        }
                    }
                }
            }
            this.timer++;
        }
        console.log("\n-------------------------------------------------");
        console.log(`...[Simulation Complete at time ${this.timer - 1}]...`);
    }
}


function RunCpuSim(){
    let simOne = new CPUSchedulingSimulation();
    simOne.SimulationProgram();
}

RunCpuSim();
