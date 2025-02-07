import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Project, Task } from "../interfaces/project";
import { mockProjects } from "../utils/mockData";

interface ProjectState {
    projects: Project[];
}

const savedProjects = localStorage.getItem("projects");
const initialState: ProjectState = {
    projects: savedProjects ? JSON.parse(savedProjects) : mockProjects,
};

const projectSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        addProject: (state, action: PayloadAction<Project>) => {
            state.projects.push(action.payload);
            localStorage.setItem("projects", JSON.stringify(state.projects));
        },
        deleteProject: (state, action: PayloadAction<string>) => {
            state.projects = state.projects.filter((p) => p.id !== action.payload);
            localStorage.setItem("projects", JSON.stringify(state.projects));
        },
        updateProject: (state, action: PayloadAction<Project>) => {
            const index = state.projects.findIndex((p) => p.id === action.payload.id);
            if (index !== -1) {
                state.projects[index] = action.payload;
                localStorage.setItem("projects", JSON.stringify(state.projects));
            }
        },
        addTask: (state, action: PayloadAction<{ projectId: string; task: Task }>) => {
            const project = state.projects.find((p) => p.id === action.payload.projectId);
            if (project) {
                project.tasks.push(action.payload.task);
                localStorage.setItem("projects", JSON.stringify(state.projects));
            }
        },
        updateTask: (state, action: PayloadAction<{ projectId: string; task: Task }>) => {
            const project = state.projects.find((p) => p.id === action.payload.projectId);
            if (project) {
                const taskIndex = project.tasks.findIndex((t) => t.id === action.payload.task.id);
                if (taskIndex !== -1) {
                    project.tasks[taskIndex] = action.payload.task;
                    localStorage.setItem("projects", JSON.stringify(state.projects));
                }
            }
        },
        deleteTask: (state, action: PayloadAction<{ projectId: string; taskId: string }>) => {
            const project = state.projects.find((p) => p.id === action.payload.projectId);
            if (project) {
                project.tasks = project.tasks.filter((t) => t.id !== action.payload.taskId);
                localStorage.setItem("projects", JSON.stringify(state.projects));
            }
        }
    },
});

export const { addProject, deleteProject, updateProject, addTask, updateTask, deleteTask } = projectSlice.actions;
export default projectSlice.reducer;
