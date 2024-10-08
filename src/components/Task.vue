<template>
    <div
        class="mx-auto max-w-2xl mt-10 shadow-md sm:rounded-lg"
        v-if="tasks.length > 0"
    >
        <table
            class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
        >
            <thead
                class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
                <tr>
                    <th scope="col" class="px-6 py-3">Activity</th>
                    <th scope="col" class="px-6 py-3">Depends On</th>
                    <th scope="col" class="px-6 py-3">Duration</th>
                    <th scope="col" class="px-6 py-3">
                        <span class="sr-only">Edit</span>
                    </th>
                    <th scope="col" class="px-6 py-3">
                        <span class="sr-only">Delete</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    v-for="task in tasks"
                    :key="task.activity"
                >
                    <td class="px-6 py-4">{{ task.activity }}</td>
                    <td class="px-6 py-4">
                        <span v-if="task.depends.length < 1"> - </span>
                        <span v-else>
                            <span
                                v-for="(depend, index) in task.depends"
                                :key="index"
                            >
                                {{ depend }},
                            </span>
                        </span>
                    </td>
                    <td class="px-6 py-4">{{ task.duration }}</td>
                    <td class="px-6 py-4 text-right">
                        <a
                            href="#"
                            class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            @click="taskStore.editTask(task.activity)"
                            >Edit</a
                        >
                    </td>
                    <td class="px-6 py-4 text-right">
                        <a
                            href="#"
                            class="font-medium text-red-600 dark:text-red-500 hover:underline"
                            @click="taskStore.deleteTask(task.activity)"
                            >Delete</a
                        >
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup>
import { ref } from "vue";
import { useTaskStore } from "@/stores/tasks";
import { storeToRefs } from "pinia";
import { useCalculationStore } from "@/stores/calculations";

const calculationStore = useCalculationStore();
const { taskData, projectDuration, criticalPath } =
    storeToRefs(calculationStore);

const taskStore = useTaskStore();
const { tasks, activity, depends, duration } = storeToRefs(taskStore);
</script>
<style scoped></style>
