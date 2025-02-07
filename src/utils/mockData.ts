export const mockUsers = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
];

export const mockProjects = [
    {
        id: "proj-1",
        name: "Website Redesign",
        createdAt: new Date().toISOString(),
        description: "Revamp the company website.",
        color: "#3b82f6",
    },
    {
        id: "proj-2",
        name: "AI Research",
        createdAt: new Date().toISOString(),
        description: "Explore AI-driven automation.",
        color: "#3b82f6",
        tasks: [],
    },
];

export const mockTasks = [
    {
        id: 't1',
        title: 'Task 1',
        description: 'Sample task',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        status: 'Todo',
        priority: 'Medium',
        assignedGroup: 'g1',
        assignedUser: '1',
    },
];

export const mockGroups = [
    {
        id: 'g1',
        name: 'Group 1',
        description: 'Sample group',
        members: ['1', '2'],
    },
];