export interface Task {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: 'Backlog' | 'Todo' | 'In-Progress' | 'Done' | 'Cancelled';
    priority: 'Low' | 'Medium' | 'High';
    assignedGroup: string;
    assignedUser: string;
}