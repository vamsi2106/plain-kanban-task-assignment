import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Project } from "../../interfaces/project";
import { useState } from "react";
import { nanoid } from "nanoid";
import { addProject, deleteProject } from "../../store/projectSlice";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Projects = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const projects = useSelector((state: RootState) => state.projects.projects);

    const [newProject, setNewProject] = useState({ name: "", description: "", color: "#3b82f6" });

    const handleAddProject = () => {
        if (!newProject.name.trim()) {
            toast.error("Project name is required.", { position: "top-right" });
            return;
        }
        const project: Project = {
            id: nanoid(),
            name: newProject.name,
            description: newProject.description,
            createdAt: new Date().toISOString(),
            color: newProject.color,
        };
        dispatch(addProject(project));
        toast.success("Project added successfully!", { position: "top-right" });
        setNewProject({ name: "", description: "", color: "#3b82f6" });
    };

    const handleDeleteProject = (id: string) => {
        dispatch(deleteProject(id));
        toast.info("Project deleted.", { position: "top-right" });
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Projects</h1>

            {/* Add Project Form */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-lg shadow-md">
                <input
                    type="text"
                    placeholder="Project Name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="border p-2 rounded w-full sm:w-1/3 focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    placeholder="Description (Optional)"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="border p-2 rounded w-full sm:w-1/3 focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleAddProject}
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition w-full sm:w-auto"
                >
                    Add Project
                </button>
            </div>

            {/* Project List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="  w-72 bg-white rounded-b-lg border-t-8 border-green-400 px-4 py-5 flex flex-col justify-around shadow-md"
                        style={{ borderTop: `5px solid ${project.color}` }}
                    >
                        <div className="flex justify-between items-center border-b pb-2">
                            <h2 className="text-xl font-semibold text-gray-800">{project.name}</h2>
                            <span className="text-sm text-gray-500">
                                {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-gray-600 mt-2">{project.description || "No description"}</p>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => handleDeleteProject(project.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => navigate(`/projects/${project.id}`)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            >
                                View Project
                            </button>
                        </div>
                    </div>




                ))}
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Projects;