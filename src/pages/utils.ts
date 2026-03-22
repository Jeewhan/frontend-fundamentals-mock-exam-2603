import type { Room, Reservation, Equipment } from '_tosslib/server/types';
import { TIMELINE_START } from 'pages/constants';

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return (h - TIMELINE_START) * 60 + m;
}

export function validateBookingFilters(startTime: string, endTime: string, attendees: number): string | null {
  if (startTime === '' || endTime === '') return null;
  if (endTime <= startTime) return '종료 시간은 시작 시간보다 늦어야 합니다.';
  if (attendees < 1) return '참석 인원은 1명 이상이어야 합니다.';
  return null;
}

export interface BookingFilters {
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  equipment: Equipment[];
  preferredFloor: number | null;
}

export function getAvailableRooms(rooms: Room[], reservations: Reservation[], filters: BookingFilters): Room[] {
  const { date, startTime, endTime, attendees, equipment, preferredFloor } = filters;

  return rooms
    .filter(room => {
      if (room.capacity < attendees) return false;
      if (!equipment.every(eq => room.equipment.includes(eq))) return false;
      if (preferredFloor !== null && room.floor !== preferredFloor) return false;
      const hasConflict = reservations.some(
        r => r.roomId === room.id && r.date === date && r.start < endTime && r.end > startTime
      );
      return !hasConflict;
    })
    .sort((a, b) => {
      if (a.floor !== b.floor) return a.floor - b.floor;
      return a.name.localeCompare(b.name);
    });
}
