import React, { useEffect, useState } from 'react';
import donationsData from '../../data/donations/donations.json';

interface DonationItem {
  name: string;
  number: number;
  donation: string[];
}

const DonationsList: React.FC = () => {
  const [donations, setDonations] = useState<DonationItem[]>([]);

  useEffect(() => {
    // Charger les données du fichier JSON
    setDonations(donationsData.trees);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🌳 Donations d'arbres</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donations.map((item, index) => (
          <div key={index} className="bg-white rounded-md p-4 shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
            <p className="text-gray-700 mb-2">Nombre: {item.number}</p>
            <p className="text-gray-700 mb-2">Donné par: {item.donation.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonationsList;