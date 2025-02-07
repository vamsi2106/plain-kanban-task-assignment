import React, { useState, useEffect } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  CardContent,
  KanbanContent,
  createDefaultKanbanContent,
} from "./model";

import { Column } from "../column";
import { useParams } from "react-router-dom";



const initialColumns = [
  { id: 1, name: "Backlog", color: "bg-indigo-50 hover:bg-indigo-100", textColor: "text-indigo-600", dotColor: "bg-indigo-600" },
  { id: 2, name: "To-Do", color: "bg-blue-50 hover:bg-blue-100", textColor: "text-blue-600", dotColor: "bg-blue-600" },
  { id: 3, name: "In-Progress", color: "bg-yellow-50 hover:bg-yellow-100", textColor: "text-yellow-600", dotColor: "bg-yellow-600" },
  { id: 4, name: "Done", color: "bg-green-50 hover:bg-green-100", textColor: "text-green-600", dotColor: "bg-green-600" },
  { id: 5, name: "Cancelled", color: "bg-red-50 hover:bg-red-100", textColor: "text-red-600", dotColor: "bg-red-600" },
];

const mockTasks = [
  {
    id: 1,
    title: "Task 1",
    description: "Description for Task 1",
    status: "Backlog",
    priority: "Medium",
    assignedUser: "User1",
    projectId: "proj-1"
  },
  {
    id: 2,
    title: "Task 2",
    description: "Description for Task 2",
    status: "To-Do",
    priority: "High",
    assignedUser: "User2",
    projectId: "proj-2"
  },
];

// Toast notification component
const Toast = ({ message, type, onClose }) => (
  <div className={`fixed top-4 right-4 p-4 rounded-xl shadow-lg ${type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white transition-all duration-300 transform translate-y-0 z-50`}>
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-white" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-white hover:text-gray-200 focus:outline-none">
        ×
      </button>
    </div>
  </div>
);

export const KanbanContainer: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isKanbanView, setIsKanbanView] = useState(true);

  // Load columns from localStorage or use initial
  const [columns, setColumns] = useState(() => {
    const savedColumns = localStorage.getItem('kanbanColumns');
    return savedColumns ? JSON.parse(savedColumns) : initialColumns.map(col => ({ ...col, content: mockTasks }));
  });

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "Backlog",
    priority: "Medium",
    assignedUser: "",
    projectId: projectId || ""
  });



  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    localStorage.setItem('kanbanColumns', JSON.stringify(columns));
  }, [columns]);


  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) return;

        const card = source.data.card as CardContent;
        const columnId = destination.data.columnId as number;

        setColumns((prevColumns) => moveCard(card, { columnId, cardId: null }, prevColumns));

        const columnName = initialColumns.find(col => col.id === columnId)?.name || "Unknown";
        showToast(`Task moved to ${columnName}`);
      },
    });
  }, []);


  const moveCard = (card: CardContent, destination: { columnId: number, cardId: number | null }, prevColumns: typeof columns) => {
    return prevColumns.map(column => {
      if (column.id === destination.columnId) {
        return {
          ...column,
          content: [
            ...column.content,
            { ...card, status: initialColumns.find(col => col.id === destination.columnId)?.name || "Unknown" }, // Update status
          ],
        };
      }
      if (column.content.some(c => c.id === card.id)) {
        return {
          ...column,
          content: column.content.filter(c => c.id !== card.id),
        };
      }
      return column;
    });
  };



  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      showToast("Task title is required", "error");
      return;
    }

    const updatedColumns = columns.map((column) =>
      column.name === newTask.status
        ? {
          ...column,
          content: [
            ...column.content,
            {
              id: `task-${Date.now()}`,
              title: newTask.title,
              description: newTask.description,
              createdAt: new Date().toISOString().split("T")[0],
              status: newTask.status,
              priority: newTask.priority,
              assignedUser: newTask.assignedUser,
              projectId,
            },
          ],
        }
        : column
    );

    setColumns(updatedColumns);
    setNewTask({
      title: "",
      description: "",
      status: "Backlog",
      priority: "Medium",
      assignedUser: "",
      projectId: projectId || ""
    });

    showToast("Task added successfully");
  };

  const allTasks = columns.flatMap(column =>
    column.content.filter(task => task?.projectId === projectId)
  );

  const handleDeleteTask = (taskId: any) => {
    setColumns(prevColumns =>
      prevColumns.map(column => ({
        ...column,
        content: column.content.filter(task => task.id !== taskId)
      }))
    );
    showToast("Task deleted successfully");
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'success' })}
        />
      )}

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Project Board</h1>
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setIsKanbanView(true)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isKanbanView
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              Board
            </button>
            <button
              onClick={() => setIsKanbanView(false)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${!isKanbanView
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Task Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Task</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
            <input
              type="text"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
            <select
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            >
              {columns.map((col) => (
                <option key={col.id} value={col.name}>
                  {col.name}
                </option>
              ))}
            </select>
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <button
              onClick={handleAddTask}
              className="w-full px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Add Task
            </button>
          </div>
        </div>

        {isKanbanView ? (
          // Kanban View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {columns.map((column) => (
              <div
                key={column.id}
                className={`rounded-xl shadow-sm ${column.color} transition-colors`}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${column.dotColor}`} />
                      <h3 className={`font-semibold ${column.textColor}`}>
                        {column.name}
                      </h3>
                    </div>
                    <span className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-600 shadow-sm">
                      {column.content.filter((task) => task?.projectId === projectId).length}
                    </span>
                  </div>
                  <Column
                    name={column.name}
                    content={column.content.filter((task) => task?.projectId === projectId)}
                    columnId={column.id}
                    onDelete={handleDeleteTask}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Title</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 hidden md:table-cell">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 hidden lg:table-cell">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {allTasks.map((task) => (
                    <tr key={task.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-4">{task.title}</td>
                      <td className="py-3 px-4 hidden md:table-cell">{task.description}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${columns.find(col => col.name === task.status)?.textColor
                          } ${columns.find(col => col.name === task.status)?.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${columns.find(col => col.name === task.status)?.dotColor
                            }`} />
                          {task.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell text-sm text-gray-500">{task.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanContainer;