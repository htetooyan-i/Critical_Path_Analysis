<template>
    <form class="mx-auto max-w-2xl pt-10" @submit.prevent="submitTask">
        <div class="grid grid-cols-3 gap-4">
            <div class="mb-5">
                <label
                    for="activity"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Activity</label
                >
                <input
                    type="text"
                    id="activity"
                    class="shadow-sm bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    placeholder="A"
                    required
                    v-model="activity"
                />
            </div>
            <div class="mb-5">
                <label
                    for="depends"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Depends On</label
                >
                <input
                    type="text"
                    id="depends"
                    class="shadow-sm bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    v-model="depends"
                    placeholder="A,B"
                />
            </div>
            <div class="mb-5">
                <label
                    for="duration"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Duration</label
                >
                <input
                    type="number"
                    id="duration"
                    class="shadow-sm bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    min="1"
                    required
                    v-model="duration"
                />
            </div>
        </div>
        <div class="displayError mb-5">
            <span class="text-red-500" v-if="taskError"
                >{{ Activity }} is already Exist!! Please enter new task or edit
                the existing task.</span
            >
            <span class="text-red-500" v-if="taskExistError"
                ><span v-for="existTask in ExistTasks"
                    >{{ existTask }} &nbsp;</span
                >
                are not exist in your task table.</span
            >
        </div>
        <div>
            <button
                class="py-2 w-full border border-black hover:bg-black hover:text-white transition-all duration-300"
                v-if="!isEditing"
            >
                Add
            </button>
            <button
                class="py-2 w-full border border-black hover:bg-black hover:text-white transition-all duration-300"
                v-else
            >
                Update
            </button>
        </div>
    </form>
</template>
<script setup>
import { ref } from "vue";
import { useTaskStore } from "@/stores/tasks";
import { storeToRefs } from "pinia";

const taskStore = useTaskStore();
const {
    tasks,
    activity,
    depends,
    duration,
    existTask,
    isEditing,
    taskError,
    taskExistError,
    ExistTasks,
} = storeToRefs(taskStore);

const Activity = ref("");
const submitTask = () => {
    if (isEditing.value) {
        update();
    } else {
        addTask();
    }
};

const update = () => {
    taskStore.checkTaskExist();
    if (taskExistError.value == false) {
        taskStore.updateTask();
        Activity.value = activity.value;
        if (existTask.value == false) {
            depends.value = "";
            activity.value = "";
            duration.value = "";
            taskError.value = false;
        }
    }
};

const addTask = () => {
    taskStore.checkActivity();
    taskStore.checkTaskExist();
    if (taskExistError.value == false) {
        if (existTask.value == false) {
            taskStore.addTasks();
            depends.value = "";
            activity.value = "";
            duration.value = "";
            taskError.value = false;
        } else {
            Activity.value = activity.value;
            taskError.value = true;
        }
    }
};
</script>
<style scoped></style>
