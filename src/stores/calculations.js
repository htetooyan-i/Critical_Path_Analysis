import { ref, computed, nextTick } from "vue";
import { defineStore } from "pinia";
import { useTaskStore } from "@/stores/tasks";
import { storeToRefs } from "pinia";

export const useCalculationStore = defineStore("calculation", () => {
  const taskStore = useTaskStore();
  const { tasks } = storeToRefs(taskStore);
  const projectDuration = ref(0);
  const criticalPath = ref([]);
  const taskData = ref({});
  const displayCalculation = ref(false);

  const showCalculation = () => {
    taskData.value = {};

    // Initialize ES and EF for each task
    tasks.value.forEach((task) => {
      taskData.value[task.activity] = {
        activity: task.activity,
        duration: task.duration,
        depends: task.depends,
        ES: 0,
        EF: task.duration,
        LS: 0,
        LF: 0,
      };
    });

    // Forward pass to calculate ES and EF
    const calculateEarliestTimes = () => {
      tasks.value.forEach((task) => {
        if (task.depends.length > 0) {
          task.depends.forEach((dep) => {
            const depTask = taskData.value[dep];
            if (depTask) {
              taskData.value[task.activity].ES = Math.max(
                taskData.value[task.activity].ES,
                depTask.EF,
              );

              taskData.value[task.activity].EF =
                taskData.value[task.activity].ES +
                taskData.value[task.activity].duration;
            }
          });
        }
      });
    };

    // Calculate the earliest start and finish times
    calculateEarliestTimes();

    // Get total project duration (max EF across all tasks)
    let totalProjectTime = 0;
    tasks.value.forEach((task) => {
      totalProjectTime = Math.max(
        totalProjectTime,
        taskData.value[task.activity].EF,
      );
    });

    // Initialize initial LF and LS values for backward pass
    tasks.value.forEach((task) => {
      const hasSuccessors = tasks.value.some((t) =>
        t.depends.includes(task.activity),
      );

      if (!hasSuccessors) {
        // If the task has no successors, set LF to its own EF
        taskData.value[task.activity].LF = taskData.value[task.activity].EF;
      } else {
        // Otherwise, initialize LF to total project time
        taskData.value[task.activity].LF = totalProjectTime;
      }

      // LS = LF - duration
      taskData.value[task.activity].LS =
        taskData.value[task.activity].LF -
        taskData.value[task.activity].duration;
    });

    // Backward pass to calculate LS and LF
    [...tasks.value].reverse().forEach((task) => {
      task.depends.forEach((dep) => {
        const depTask = taskData.value[dep];
        if (depTask) {
          // LF for the dependency is the minimum LS of the task that depends on it
          depTask.LF = Math.min(
            depTask.LF || Infinity,
            taskData.value[task.activity].LS,
          );
          // LS is LF - duration
          depTask.LS = depTask.LF - depTask.duration;
        }
      });
    });

    // Get critical path (where ES === LS and EF === LF)
    const allCriticalPathTasks = ref([]);

    tasks.value.forEach((task) => {
      const taskInfo = taskData.value[task.activity];

      // Check if the current task is on the critical path
      if (taskInfo.ES === taskInfo.LS && taskInfo.EF === taskInfo.LF) {
        allCriticalPathTasks.value.push(task.activity);
      }
    });

    // Extract the critical path tasks based on your requirements
    criticalPath.value = []; // Clear previous critical path
    const reverseCriticalPath = [...allCriticalPathTasks.value].reverse();

    let i = 0; // Initialize the index for the while loop
    let exit = false;
    let currentTask = "";
    while (!exit) {
      if (i == 0) {
        currentTask = reverseCriticalPath[i];
        criticalPath.value.push(currentTask);
      }

      // Get dependencies for the current task
      let depends = taskData.value[currentTask]?.depends || []; // Use optional chaining to avoid errors
      let maxDuration = 0;
      let criticalDependency = "";

      // If there is exactly one dependency, add it directly to the critical path
      if (depends.length === 1) {
        criticalPath.value.push(depends[0]);
        currentTask = depends[0];
        i++; // Increment index to move to the next task
        continue; // Skip to the next iteration
      }
      // If there are multiple dependencies, find the one that matches the critical path (based on ES and EF)
      else if (depends.length > 1) {
        let j = 0; // Initialize an index for dependencies
        while (j < depends.length) {
          const task = depends[j];

          // Check if the dependency's EF matches the current task's ES (critical path condition)
          if (taskData.value[task].EF === taskData.value[currentTask].ES) {
            criticalDependency = task; // Store the task on the critical path
            break; // Break out of the loop once the correct dependency is found
          }
          j++; // Increment the dependency index
        }
        if (criticalDependency) {
          criticalPath.value.push(criticalDependency);
          currentTask = criticalDependency;
        }
        i++; // Increment index to move to the next task
      } else {
        i++; // Increment index to move to the next task
        exit = true;
      }
    }

    displayCalculation.value = true;
    projectDuration.value = totalProjectTime;
    criticalPath.value = [...criticalPath.value].reverse();
  };

  return {
    showCalculation,
    taskData,
    projectDuration,
    criticalPath,
    displayCalculation,
  };
});
