import React from 'react';

const features = [
  { title: 'Project Management', desc: 'Manage your projects and tasks easily.' },
  { title: 'Team Collaboration', desc: 'Efficient communication and collaboration tools.' },
  { title: 'Schedule Management', desc: 'Never miss important deadlines.' },
];

const FeatureSection = () => {
  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map(({ title, desc }) => (
            <div key={title} className="bg-white p-6 rounded shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-4">{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
