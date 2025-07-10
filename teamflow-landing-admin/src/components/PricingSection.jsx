import React from 'react';

const plans = [
  {
    name: 'Basic',
    price: 'Free',
    features: ['3 Projects', 'Basic Support', 'Community Access'],
  },
  {
    name: 'Premium',
    price: '$29.99 / month',
    features: ['Unlimited Projects', 'Priority Support', 'Premium Features'],
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12">Pricing</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {plans.map(({ name, price, features }) => (
            <div key={name} className="border rounded-lg p-6 shadow hover:shadow-lg transition flex-1">
              <h3 className="text-2xl font-semibold mb-4">{name}</h3>
              <p className="text-4xl font-bold mb-6">{price}</p>
              <ul className="mb-6 space-y-2">
                {features.map((f, i) => (
                  <li key={i} className="list-disc list-inside">{f}</li>
                ))}
              </ul>
              <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
