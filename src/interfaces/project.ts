

// User Interface
export interface User {
    id: string;
    name: string;
    email: string;
    role?: string;  // Optional field
}

// Task Status and Priority Types
export type TaskStatus =
    | 'Backlog'
    | 'To-Do'
    | 'In-Progress'
    | 'Done'
    | 'Cancelled';

export type TaskPriority =
    | 'Low'
    | 'Medium'
    | 'High';

// Task Interface
export interface Task {
    id: string;
    title: string;
    description: string;
    startDate: string;  // ISO format date string
    endDate: string;    // ISO format date string
    status: TaskStatus;
    priority: TaskPriority;
    assignedUserId?: string;  // Reference to User ID
    createdBy: string;       // User ID
    createdAt: string;       // ISO format date string
    updatedAt?: string;      // Optional ISO format date string
}

// Project Interface
export interface Project {
    id: string;
    name: string;
    description: string;
    createdBy: string;       // User ID
    createdAt: string;       // ISO format date string
    updatedAt?: string;      // Optional ISO format date string
    color?: string;
    tasks?: Task[];
    members?: string[];       // Array of User IDs
}

// Filter/Sort Interface
export interface TaskFilterSort {
    status?: TaskStatus;
    priority?: TaskPriority;
    assignedUserId?: string;
    startDateRange?: [string, string];
    endDateRange?: [string, string];
    sortBy?: 'title' | 'status' | 'priority' | 'startDate' | 'endDate';
    sortOrder?: 'asc' | 'desc';
}

// Drag and Drop Interface
export interface DragItem {
    id: string;
    type: 'task';
    status: TaskStatus;
    index: number;
}

// Redux State Interface
export interface ProjectState {
    projects: Project[];
    loading: boolean;
    error: string | null;
}

// API Response Interface
export interface ApiResponse<T> {
    data?: T;
    error?: string;
    status: number;
}