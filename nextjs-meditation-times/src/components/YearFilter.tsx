'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface YearFilterProps {
  years: string[];
  initialYear: string;
}

export default function YearFilter({ years, initialYear }: YearFilterProps) {
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Fixed dependency array
  useEffect(() => {
    const yearParam = searchParams.get('year');
    if (yearParam && yearParam !== selectedYear) {
      setSelectedYear(yearParam);
      localStorage.setItem('selectedYear', yearParam);
    }
  }, [searchParams, selectedYear]); // Added missing dependency

  // Fixed handler with useCallback
  const handleYearChange = useCallback((year: string) => {
    const params = new URLSearchParams(searchParams.toString());
    year === 'all' ? params.delete('year') : params.set('year', year);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setSelectedYear(year);
    localStorage.setItem('selectedYear', year);
  }, [searchParams, pathname, router]);

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
      
      <style jsx>{`
        .year-filter {
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .filter-label {
          font-weight: bold;
          margin-right: 0.5rem;
        }
        .filter-option {
          background: #f0f0f0;
          border: 1px solid #ccc;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .filter-option:hover {
          background: #e0e0e0;
        }
        .filter-option.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }
        .filter-option.active:hover {
          background: #0056b3;
          border-color: #0056b3;
        }
      `}</style>
    </div>
  );
}