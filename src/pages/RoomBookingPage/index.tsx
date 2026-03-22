import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Top, Spacing, Border, Button } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { MessageBanner } from 'pages/components/MessageBanner';
import { getRooms, getReservations, createReservation } from 'pages/remotes';
import { validateBookingFilters, getAvailableRooms, extractErrorMessage } from 'pages/utils';
import { FilterPanel } from './FilterPanel';
import { AvailableRoomList } from './AvailableRoomList';
import { useBookingFilters } from './useBookingFilters';

export function RoomBookingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [filters, updateFilters] = useBookingFilters();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: rooms = [] } = useQuery(['rooms'], getRooms);
  const { data: reservations = [] } = useQuery(['reservations', filters.date], () => getReservations(filters.date), { enabled: !!filters.date });

  const createMutation = useMutation(
    (data: Parameters<typeof createReservation>[0]) => createReservation(data),
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries(['reservations', variables.date]);
        queryClient.invalidateQueries(['myReservations']);
      },
    }
  );

  const handleFilterChange = (patch: Parameters<typeof updateFilters>[0]) => {
    updateFilters(patch);
    setSelectedRoomId(null);
    setErrorMessage(null);
  };

  const validation = validateBookingFilters(filters);

  const floors = [...new Set(rooms.map(r => r.floor))].sort((a, b) => a - b);
  const availableRooms = validation.status === 'valid'
    ? getAvailableRooms(rooms, reservations, filters)
    : [];

  const handleBook = async () => {
    if (!selectedRoomId) {
      setErrorMessage('회의실을 선택해주세요.');
      return;
    }
    if (!filters.startTime || !filters.endTime) {
      setErrorMessage('시작 시간과 종료 시간을 선택해주세요.');
      return;
    }

    try {
      await createMutation.mutateAsync({
        roomId: selectedRoomId,
        date: filters.date,
        start: filters.startTime,
        end: filters.endTime,
        attendees: filters.attendees,
        equipment: filters.equipment,
      });
      navigate('/', { state: { message: '예약이 완료되었습니다!' } });
    } catch (err: unknown) {
      setErrorMessage(extractErrorMessage(err));
      setSelectedRoomId(null);
    }
  };

  return (
    <div css={css`background: ${colors.white}; padding-bottom: 40px;`}>
      <div css={css`padding: 12px 24px 0;`}>
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="뒤로가기"
          css={css`
            background: none; border: none; padding: 0; cursor: pointer; font-size: 14px;
            color: ${colors.grey600}; &:hover { color: ${colors.grey900}; }
          `}
        >
          ← 예약 현황으로
        </button>
      </div>
      <Top.Top03 css={css`padding-left: 24px; padding-right: 24px;`}>
        예약하기
      </Top.Top03>

      {errorMessage && (
        <div css={css`padding: 0 24px;`}>
          <Spacing size={12} />
          <MessageBanner type="error">{errorMessage}</MessageBanner>
        </div>
      )}

      <Spacing size={24} />

      <FilterPanel
        filters={filters}
        floors={floors}
        onChange={handleFilterChange}
      />

      {validation.status === 'invalid' && (
        <div css={css`padding: 0 24px;`}>
          <Spacing size={8} />
          <span css={css`color: ${colors.red500}; font-size: 14px;`} role="alert">{validation.message}</span>
        </div>
      )}

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {validation.status === 'valid' && (
        <div css={css`padding: 0 24px;`}>
          <AvailableRoomList
            rooms={availableRooms}
            selectedRoomId={selectedRoomId}
            onSelect={setSelectedRoomId}
          />

          <Spacing size={16} />
          <Button display="full" onClick={handleBook} disabled={createMutation.isLoading}>
            {createMutation.isLoading ? '예약 중...' : '확정'}
          </Button>
        </div>
      )}

      <Spacing size={24} />
    </div>
  );
}
