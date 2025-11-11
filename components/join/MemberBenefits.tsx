'use client';

import { Check } from 'lucide-react';

export default function MemberBenefits() {
  const benefits = [
    { title: 'Exclusive Access', description: 'First look at premium luxury items' },
    { title: 'Verified Sellers', description: 'All sellers are thoroughly vetted' },
    { title: 'Premium Support', description: '24/7 dedicated customer service' },
    { title: 'Member Events', description: 'Exclusive invites to luxury events' },
  ];

  return (
    <div className="md:w-2/5 bg-gray-900 p-8 md:p-12 text-white">
      <h3 className="text-2xl font-bold mb-6">Member Benefits</h3>
      <div className="space-y-6">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">{benefit.title}</h4>
              <p className="text-sm text-gray-400">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
