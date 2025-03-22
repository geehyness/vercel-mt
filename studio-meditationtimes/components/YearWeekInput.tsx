import React from 'react'
import { StringInputProps } from 'sanity'

export const YearWeekInput = (props: StringInputProps) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const days = Math.floor((currentDate.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const currentWeek = Math.ceil((days + startOfYear.getDay() + 1) / 7);

  const [year, setYear] = React.useState(() => {
    if (props.value) {
      return props.value.split('-W')[0];
    }
    return currentYear.toString();
  });

  const [week, setWeek] = React.useState(() => {
    if (props.value) {
      return props.value.split('-W')[1];
    }
    return currentWeek.toString().padStart(2, '0');
  });

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = e.target.value;
    setYear(newYear);
    props.onChange([{ type: 'set', path: [], patchType: 'set', value: `${newYear}-W${week}` }]);
  };

  const handleWeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWeek = e.target.value.padStart(2, '0');
    setWeek(newWeek);
    props.onChange([{ type: 'set', path: [], patchType: 'set', value: `${year}-W${newWeek}` }]);
  };

  return (
    <div className="flex gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Year</label>
        <input
          type="number"
          min="2000"
          max="2100"
          value={year}
          onChange={handleYearChange}
          className="w-24 p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Week</label>
        <input
          type="number"
          min="1"
          max="53"
          value={week}
          onChange={handleWeekChange}
          className="w-20 p-2 border rounded"
        />
      </div>
    </div>
  );
}; 