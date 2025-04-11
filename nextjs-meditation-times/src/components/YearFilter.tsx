// components/YearFilter.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface YearFilterProps {
  years: string[];
}

function YearFilter({ years }: YearFilterProps) {
  const [selectedYear, setSelectedYear] = useState<string | 'all'>('all');
  const router = useRouter();

  useEffect(() => {
    const storedYear = localStorage.getItem('selectedYear');
    setSelectedYear(storedYear || 'all');
  }, []);

  const handleYearChange = (year: string | 'all') => {
    localStorage.setItem('selectedYear', year);
    setSelectedYear(year);
    router.refresh(); // Or you can manage state and re-render without a full refresh
  };

  return (
    <div className="year-filter">
      <span className="filter-label">Filter by Year:</span>
      <button
        onClick={() => handleYearChange('all')}
        className={`filter-option ${selectedYear === 'all' ? 'active' : ''}`}
      >
        All Years
      </button>
      {years.map(year => (
        <button
          key={year}
          onClick={() => handleYearChange(year)}
          className={`filter-option ${selectedYear === year ? 'active' : ''}`}
        >
          {year}
        </button>
      ))}
    </div>
  );
}

export default YearFilter;