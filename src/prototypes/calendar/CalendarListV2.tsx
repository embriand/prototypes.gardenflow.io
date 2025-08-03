import React, { useEffect, useState } from 'react';
import calendarData from '../../../data/calendar/calendar.json'; // Assurez-vous que le chemin est correct

interface CalendarItem {
  name: string;
  bee_friendly: boolean;
  description: string;
}

interface CalendarMonth {
  name: string;
  categories: Record<'vegetables' | 'fruits' | 'cereals', CalendarItem[] | undefined>;
}

const CalendarList: React.FC = () => {
  const [calendar, setCalendar] = useState<CalendarMonth[]>([]);

  useEffect(() => {
    // Charger les données du fichier JSON
    const mappedData = calendarData.months.map((month: any) => ({
      ...month,
      categories: {
        vegetables: month.categories.vegetables,
        fruits: month.categories.fruits,
        cereals: month.categories.cereales_legumineuses,
      },
    }));
    setCalendar(mappedData);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Calendrier des cultures</h1>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-lg font-semibold">Culture</h2>
        </div>
        {calendar.map((month, index) => (
          <div key={index} className="col-span-1 md:col-span-1">
            <h2 className="text-lg font-semibold">{month.name}</h2>
          </div>
        ))}
      </div>
      {['vegetables', 'fruits', 'cereals'].map((category) => (
        <div key={category} className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold capitalize">{category}</h3>
          </div>
          {calendar.map((month, index) => (
            <div key={index} className="col-span-1 md:col-span-1">
              {month.categories[category as 'vegetables' | 'fruits' | 'cereals']?.map((item: CalendarItem, idx: number) => (
              <div key={idx} className="mb-2">
                <span className="font-semibold">{item.name}</span>
                {item.bee_friendly && <span className="text-green-500 ml-2">(Ami des abeilles)</span>}
                <div className="bg-gray-200 h-2 mt-1 relative">
                <div className="bg-blue-500 h-2 absolute left-0 top-0" style={{ width: '100%' }}></div>
                </div>
              </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CalendarList;