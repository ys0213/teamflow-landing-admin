import React from "react";

const Projects = () => {
  const dummyProjects = [
    { id: 1, name: "Website Redesign", status: "In Progress" },
    { id: 2, name: "Marketing Campaign", status: "Completed" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-md mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">My Projects</h2>
        <div className="space-y-4">
          {dummyProjects.map((project) => (
            <div
              key={project.id}
              className="p-4 bg-white rounded shadow flex justify-between items-center"
            >
              <span className="font-medium">{project.name}</span>
              <span className="text-sm text-gray-500">{project.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
