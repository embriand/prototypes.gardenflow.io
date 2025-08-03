import React, { useEffect, useState } from 'react';
import calendarData from '../../data/calendar/calendar.json';

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

  const categoryIcons: Record<string, string> = {
    vegetables: "🥦",
    fruits: "🍎",
    cereals: "🌾",
  };

  return (
    <div className="p-6 relative left-0 w-full top-24 h-full">
      <h1 className="text-3xl font-bold mb-6">📅 Calendrier des cultures</h1>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border-b pb-4 mb-4">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-lg font-semibold">Culture</h2>
        </div>
        {calendar.map((month, index) => (
          <div key={index} className="col-span-1 md:col-span-2 w-full">
            <h2 className="text-lg font-semibold">{month.name}</h2>
          </div>
        ))}
      </div>
      {['vegetables', 'fruits', 'cereals'].map((category) => (
        <div key={category} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold capitalize flex items-center gap-2">
                {categoryIcons[category]} {category.charAt(0).toUpperCase() + category.slice(1)}
              </h3>
            </div>
            {calendar.map((month, index) => (
              <div key={index} className="col-span-1 md:col-span-2">
                {month.categories[category as keyof CalendarMonth['categories']]?.length ? (
                    <div className="bg-white rounded-md p-4 mb-4 shadow-md border border-gray-200">
                    {month.categories[category as keyof CalendarMonth['categories']]?.map((item: CalendarItem, idx: number) => (
                      <div
                      key={idx}
                      className="flex items-center justify-between mb-2"
                      >
                      <div className="flex items-center gap-2">
                        <span className="text-base font-medium">{item.name}</span>
                        {item.bee_friendly && (
                        <span className="text-yellow-500 text-xl">🐝</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    ))}
                    </div>
                ) : (
                  <div className="text-gray-400 italic text-sm">-</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalendarList;
