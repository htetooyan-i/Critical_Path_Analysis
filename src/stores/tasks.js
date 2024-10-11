import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useTaskStore = defineStore("task", () => {
  const tasks = ref([]);

  const activity = ref("");
  const depends = ref("");
  const duration = ref("");
  const existTask = ref(false);
  const isEditing = ref(false);
  const editActivity = ref("");
  const taskError = ref(false);
  const taskExistError = ref(false);
  const ExistTasks = ref([]);

  const addTasks = () => {
    const dependsArray = depends.value.split(",");
    const filteredDepends = dependsArray.filter(
      (depend) => depend.trim() !== "",
    );
    tasks.value.push({
      activity: activity.value,
      depends: filteredDepends,
      duration: duration.value,
    });
  };

  const checkActivity = () => {
    const filteredActivity = tasks.value.filter(
      (task) => task.activity == activity.value,
    );
    if (filteredActivity.length != 0) {
      existTask.value = true;
    } else {
      existTask.value = false;
    }
  };

  const checkTaskExist = () => {
    ExistTasks.value = [];
    let dependsArr = depends.value.split(",").map((item) => item.trim());

    if (Array.isArray(dependsArr) && dependsArr.length > 0) {
      dependsArr.forEach((depend) => {
        const filteredTasks = tasks.value.filter(
          (task) => task.activity === depend,
        );

        if (filteredTasks.length == 0 && dependsArr.length != 1) {
          ExistTasks.value.push(depend);
          taskExistError.value = true;
        } else {
          taskExistError.value = false;
        }
      });
    }
  };

  const editTask = (EditActivity) => {
    editActivity.value = EditActivity;
    const getEditTask = tasks.value.find(
      (task) => task.activity.toLowerCase() === EditActivity.toLowerCase(),
    );

    if (getEditTask) {
      activity.value = getEditTask.activity;
      depends.value = getEditTask.depends.join(", "); // Convert array to string
      duration.value = getEditTask.duration;
      isEditing.value = true;
    }
  };

  const updateTask = () => {
    const getEditTask = tasks.value.find(
      (task) =>
        task.activity.toLowerCase() === activity.value.trim().toLowerCase() && // Both converted to lowercase
        task.activity.toLowerCase() !== editActivity.value.trim().toLowerCase(), // Ignore the current editing activity
    );

    isEditing.value = false;
    if (getEditTask) {
      existTask.value = true;
      taskError.value = true;
    } else {
      existTask.value = false;
      taskError.value = false;

      const taskIndex = tasks.value.findIndex(
        (task) =>
          task.activity.toLowerCase() === editActivity.value.toLowerCase(),
      );
      const dependsArray = depends.value.split(",");
      const filteredDepends = dependsArray.filter(
        (depend) => depend.trim() !== "",
      );
      tasks.value[taskIndex].activity = activity.value;
      tasks.value[taskIndex].depends = filteredDepends;
      tasks.value[taskIndex].duration = duration.value;
    }
  };

  const deleteTask = (deletedActivity) => {
    const taskIndex = tasks.value.findIndex(
      (task) => task.activity.toLowerCase() === deletedActivity.toLowerCase(),
    );
    tasks.value.splice(taskIndex, 1);
  };

  return {
    tasks,
    activity,
    depends,
    duration,
    addTasks,
    checkActivity,
    existTask,
    editTask,
    isEditing,
    updateTask,
    taskError,
    deleteTask,
    checkTaskExist,
    taskExistError,
    ExistTasks,
  };
});
