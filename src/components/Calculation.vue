<template>
    <div class="mt-10 sm:rounded-lg px-10">
        <div class="max-w-2xl mx-auto" v-if="tasks.length > 0">
            <button
                class="py-2 w-full border border-black hover:bg-black hover:text-white transition-all duration-300"
                @click="getData"
            >
                Get Data
            </button>
        </div>

        <div
            v-if="Object.keys(taskData).length > 0"
            class="mx-auto max-w-full"
            id="calculationView"
        >
            <h1 class="text-3xl font-bold text-center my-10 title">
                Calculated Data
            </h1>
            <div class="relative">
                <div class="flex flex-row max-w-2xl mx-auto my-10">
                    <p class="font-mono text-[20px]">Critical Path:</p>
                    <span class="font-mono text-[20px]"
                        >{{ criticalPath.join(" + ") }} = {{ projectDuration }}
                        <span v-if="unit.length > 0"
                            ><span v-if="projectDuration <= 1">{{ unit }}</span
                            ><span v-else>{{ unit }}s</span></span
                        >
                    </span>
                </div>
                <div class="absolute right-0 top-0">
                    <input
                        type="text"
                        v-model="unit"
                        @keydown.enter="removeFocus"
                        placeholder="Unit"
                        class="shadow-sm bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    />
                </div>
            </div>
            <table
                class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 shadow-md"
            >
                <thead
                    class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                >
                    <tr>
                        <th scope="col" class="px-6 py-3">Activity</th>
                        <th scope="col" class="px-6 py-3">Depends On</th>
                        <th scope="col" class="px-6 py-3">Duration</th>
                        <th scope="col" class="px-6 py-3">Earliest Start</th>
                        <th scope="col" class="px-6 py-3">Earliest Finish</th>
                        <th scope="col" class="px-6 py-3">Latest Start</th>
                        <th scope="col" class="px-6 py-3">Latest Finish</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        v-for="task in taskData"
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
                        <td class="px-6 py-4">
                            {{ task.duration }}
                            <span v-if="unit.length > 0"
                                ><span v-if="task.duration <= 1">{{
                                    unit
                                }}</span
                                ><span v-else>{{ unit }}s</span></span
                            >
                        </td>
                        <td class="px-6 py-4">{{ task.ES }}</td>
                        <td class="px-6 py-4">{{ task.EF }}</td>
                        <td class="px-6 py-4">{{ task.LS }}</td>
                        <td class="px-6 py-4">{{ task.LF }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useTaskStore } from "@/stores/tasks";
import { useCalculationStore } from "@/stores/calculations";
import { storeToRefs } from "pinia";

const taskStore = useTaskStore();
const { tasks, taskExistError, ExistTasks } = storeToRefs(taskStore);

const calculationStore = useCalculationStore();
const {
    showCalculation,
    taskData,
    projectDuration,
    criticalPath,
    displayCalculation,
} = storeToRefs(calculationStore);

const getData = async () => {
    taskData.value = [];
    projectDuration.value = "";
    criticalPath.value = [];
    taskStore.finalCheckDepends();
    if (taskExistError.value == false) {
        calculationStore.showCalculation();
    }

    // Wait for the DOM to update before scrolling
    await nextTick();
    scrollToCalculationView();
};

// New function to scroll to calculationView
const scrollToCalculationView = () => {
    const calculationElement = document.getElementById("calculationView");
    if (calculationElement) {
        calculationElement.scrollIntoView({ behavior: "smooth" });
    }
};

const removeFocus = () => {
    if (document.activeElement) {
        document.activeElement.blur();
    }
};

const unit = ref("");
</script>

<style scoped></style>
