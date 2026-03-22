import { css } from '@emotion/react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

interface Props {
  type: 'success' | 'error';
  children: string;
}

export function MessageBanner({ type, children }: Props) {
  return (
    <div
      css={css`
        padding: 10px 14px; border-radius: 10px;
        background: ${type === 'success' ? colors.blue50 : colors.red50};
        display: flex; align-items: center; gap: 8px;
      `}
    >
      <Text
        typography="t7"
        fontWeight="medium"
        color={type === 'success' ? colors.blue600 : colors.red500}
      >
        {children}
      </Text>
    </div>
  );
}
