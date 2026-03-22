import { css } from '@emotion/react';
import { Spacing, Button, Text, ListRow } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import type { Room, Reservation } from '_tosslib/server/types';
import { EQUIPMENT_LABELS } from 'pages/constants';

interface Props {
  reservations: Reservation[];
  rooms: Room[];
  onCancel: (id: string) => void;
}

export function MyReservationList({ reservations, rooms, onCancel }: Props) {
  const getRoomName = (roomId: string) => rooms.find(r => r.id === roomId)?.name ?? roomId;

  return (
    <div css={css`padding: 0 24px;`}>
      <div css={css`display: flex; align-items: baseline; gap: 6px;`}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          내 예약
        </Text>
        {reservations.length > 0 && (
          <Text typography="t7" fontWeight="medium" color={colors.grey500}>
            {reservations.length}건
          </Text>
        )}
      </div>
      <Spacing size={16} />

      {reservations.length === 0 ? (
        <div css={css`padding: 40px 0; text-align: center; background: ${colors.grey50}; border-radius: 14px;`}>
          <Text typography="t6" color={colors.grey500}>
            예약 내역이 없습니다.
          </Text>
        </div>
      ) : (
        <div css={css`display: flex; flex-direction: column; gap: 10px;`}>
          {reservations.map((res) => (
            <div
              key={res.id}
              css={css`padding: 14px 16px; border-radius: 14px; background: ${colors.grey50}; border: 1px solid ${colors.grey200};`}
            >
              <ListRow
                contents={
                  <ListRow.Text2Rows
                    top={getRoomName(res.roomId)}
                    topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
                    bottom={`${res.date} ${res.start}~${res.end} · ${res.attendees}명 · ${res.equipment.map(e => EQUIPMENT_LABELS[e]).join(', ') || '장비 없음'}`}
                    bottomProps={{ typography: 't7', color: colors.grey600 }}
                  />
                }
                right={
                  <Button
                    type="danger"
                    style="weak"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('정말 취소하시겠습니까?')) {
                        onCancel(res.id);
                      }
                    }}
                  >
                    취소
                  </Button>
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
