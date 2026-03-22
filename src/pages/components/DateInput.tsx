import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';
import { formatDate } from 'pages/utils';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function DateInput({ value, onChange }: Props) {
  return (
    <input
      type="date"
      value={value}
      min={formatDate(new Date())}
      onChange={e => onChange(e.target.value)}
      aria-label="날짜"
      css={css`
        box-sizing: border-box; font-size: 16px; font-weight: 500; line-height: 1.5; height: 48px;
        background-color: ${colors.grey50}; border-radius: 12px; color: ${colors.grey800};
        width: 100%; border: 1px solid ${colors.grey200}; padding: 0 16px; outline: none;
        transition: border-color 0.15s; &:focus { border-color: ${colors.blue500}; }
      `}
    />
  );
}
