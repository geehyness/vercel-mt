"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface YearSelectProps {
  selectedYear: string;
  allYears: string[];
}

export function YearSelect({ selectedYear, allYears }: YearSelectProps) {
  const router = useRouter();
  const [currentSelectedYear, setCurrentSelectedYear] = useState(selectedYear);

  useEffect(() => {
    setCurrentSelectedYear(selectedYear);
  }, [selectedYear]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const year = event.target.value;
    setCurrentSelectedYear(year);
    const newUrl = year === 'all' ? '/' : `/?year=${year}`;
    router.push(newUrl);
  };

  return (
    <div className="year-select-container">
      <label htmlFor="year-select" className="year-select-label">Select Year:</label>
      <select
        id="year-select"
        className="year-select-dropdown"
        aria-label="Select year to filter posts"
        value={currentSelectedYear}
        onChange={handleChange}
      >
        <option value="all">All Years</option>
        {allYears.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}