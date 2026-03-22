import { css } from '@emotion/react';
import { Spacing, Text, Select } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { EQUIPMENT_LABELS, ALL_EQUIPMENT, TIME_SLOTS } from 'pages/constants';
import type { BookingFilters } from 'pages/utils';
import { DateInput } from 'pages/components/DateInput';

interface Props {
  filters: BookingFilters;
  floors: number[];
  onChange: (patch: Partial<BookingFilters>) => void;
}

export function FilterPanel({ filters, floors, onChange }: Props) {
  const { date, startTime, endTime, attendees, equipment, preferredFloor } = filters;

  return (
    <div css={css`padding: 0 24px;`}>
      <Text typography="t5" fontWeight="bold" color={colors.grey900}>
        예약 조건
      </Text>
      <Spacing size={16} />

      {/* 날짜 */}
      <div css={css`display: flex; flex-direction: column; gap: 6px;`}>
        <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>날짜</Text>
        <DateInput value={date} onChange={value => onChange({ date: value })} />
      </div>
      <Spacing size={14} />

      {/* 시간 */}
      <div css={css`display: flex; gap: 12px;`}>
        <div css={css`display: flex; flex-direction: column; gap: 6px; flex: 1;`}>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>시작 시간</Text>
          <Select
            value={startTime}
            onChange={e => onChange({ startTime: e.target.value })}
            aria-label="시작 시간"
          >
            <option value="">선택</option>
            {TIME_SLOTS.slice(0, -1).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </div>
        <div css={css`display: flex; flex-direction: column; gap: 6px; flex: 1;`}>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>종료 시간</Text>
          <Select
            value={endTime}
            onChange={e => onChange({ endTime: e.target.value })}
            aria-label="종료 시간"
          >
            <option value="">선택</option>
            {TIME_SLOTS.slice(1).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </div>
      </div>
      <Spacing size={14} />

      {/* 참석 인원 + 선호 층 */}
      <div css={css`display: flex; gap: 12px;`}>
        <div css={css`display: flex; flex-direction: column; gap: 6px; flex: 1;`}>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>참석 인원</Text>
          <input
            type="number"
            min={1}
            value={attendees}
            onChange={e => onChange({ attendees: Math.max(1, Number(e.target.value)) })}
            aria-label="참석 인원"
            css={css`
              box-sizing: border-box; font-size: 16px; font-weight: 500; line-height: 1.5; height: 48px;
              background-color: ${colors.grey50}; border-radius: 12px; color: ${colors.grey800};
              width: 100%; border: 1px solid ${colors.grey200}; padding: 0 16px; outline: none;
              transition: border-color 0.15s; &:focus { border-color: ${colors.blue500}; }
            `}
          />
        </div>
        <div css={css`display: flex; flex-direction: column; gap: 6px; flex: 1;`}>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>선호 층</Text>
          <Select
            value={preferredFloor ?? ''}
            onChange={e => {
              const val = e.target.value;
              onChange({ preferredFloor: val === '' ? null : Number(val) });
            }}
            aria-label="선호 층"
          >
            <option value="">전체</option>
            {floors.map(f => (
              <option key={f} value={f}>{f}층</option>
            ))}
          </Select>
        </div>
      </div>
      <Spacing size={14} />

      {/* 장비 */}
      <div>
        <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>필요 장비</Text>
        <Spacing size={8} />
        <div css={css`display: flex; gap: 8px; flex-wrap: wrap;`}>
          {ALL_EQUIPMENT.map(eq => {
            const selected = equipment.includes(eq);
            return (
              <button
                key={eq}
                type="button"
                onClick={() => {
                  const next = selected ? equipment.filter(e => e !== eq) : [...equipment, eq];
                  onChange({ equipment: next });
                }}
                aria-label={EQUIPMENT_LABELS[eq]}
                aria-pressed={selected}
                css={css`
                  padding: 8px 16px; border-radius: 20px;
                  border: 1px solid ${selected ? colors.blue500 : colors.grey200};
                  background: ${selected ? colors.blue50 : colors.grey50};
                  color: ${selected ? colors.blue600 : colors.grey700};
                  font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.15s;
                  &:hover { border-color: ${selected ? colors.blue500 : colors.grey400}; }
                `}
              >
                {EQUIPMENT_LABELS[eq]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
