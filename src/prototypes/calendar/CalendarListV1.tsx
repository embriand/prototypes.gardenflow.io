import React, { useEffect, useState } from 'react';
import calendarData from '../../../data/calendar/calendar.json'; // Assurez-vous que le chemin est correct

interface CalendarItem {
  name: string;
  bee_friendly: boolean;
  description: string;
}

interface CalendarMonth {
  name: string;
  categories: {
    vegetables?: CalendarItem[];
    fruits?: CalendarItem[];
    cereals?: CalendarItem[];
  };
}

const CalendarList: React.FC = () => {
  const [calendar, setCalendar] = useState<CalendarMonth[]>([]);

  useEffect(() => {
    // Charger les données du fichier JSON
    setCalendar(calendarData.months);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Calendrier des cultures</h1>
      {calendar.map((month, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{month.name}</h2>
          {month.categories.vegetables && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Légumes</h3>
              <ul className="list-disc list-inside">
                {month.categories.vegetables.map((item, idx) => (
                  <li key={idx} className="mb-1">
                    <span className="font-semibold">{item.name}</span> - {item.description} {item.bee_friendly && <span className="text-green-500">(Ami des abeilles)</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {month.categories.fruits && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Fruits</h3>
              <ul className="list-disc list-inside">
                {month.categories.fruits.map((item, idx) => (
                  <li key={idx} className="mb-1">
                    <span className="font-semibold">{item.name}</span> - {item.description} {item.bee_friendly && <span className="text-green-500">(Ami des abeilles)</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {month.categories.cereals && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Céréales</h3>
              <ul className="list-disc list-inside">
                {month.categories.cereals.map((item, idx) => (
                  <li key={idx} className="mb-1">
                    <span className="font-semibold">{item.name}</span> - {item.description} {item.bee_friendly && <span className="text-green-500">(Ami des abeilles)</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CalendarList;