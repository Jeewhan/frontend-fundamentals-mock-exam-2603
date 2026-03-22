import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { formatDate, type BookingFilters } from 'pages/utils';

function parseFiltersFromParams(searchParams: URLSearchParams): BookingFilters {
  return {
    date: searchParams.get('date') || formatDate(new Date()),
    startTime: searchParams.get('startTime') || '',
    endTime: searchParams.get('endTime') || '',
    attendees: Number(searchParams.get('attendees')) || 1,
    equipment: searchParams.get('equipment') ? searchParams.get('equipment')!.split(',').filter(Boolean) : [],
    preferredFloor: searchParams.get('floor') ? Number(searchParams.get('floor')) : null,
  };
}

function filtersToParams(filters: BookingFilters): Record<string, string> {
  const params: Record<string, string> = {};
  if (filters.date) params.date = filters.date;
  if (filters.startTime) params.startTime = filters.startTime;
  if (filters.endTime) params.endTime = filters.endTime;
  if (filters.attendees > 1) params.attendees = String(filters.attendees);
  if (filters.equipment.length > 0) params.equipment = filters.equipment.join(',');
  if (filters.preferredFloor !== null) params.floor = String(filters.preferredFloor);
  return params;
}

export function useBookingFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<BookingFilters>(() => parseFiltersFromParams(searchParams));

  useEffect(() => {
    setSearchParams(filtersToParams(filters), { replace: true });
  }, [filters, setSearchParams]);

  const updateFilters = (patch: Partial<BookingFilters>) => {
    setFilters(prev => ({ ...prev, ...patch }));
  };

  return [filters, updateFilters] as const;
}
