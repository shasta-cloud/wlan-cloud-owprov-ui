import React from 'react';
import { Box, useStyleConfig } from '@chakra-ui/react';
import { ThemeProps } from 'models/Theme';

interface Props extends ThemeProps {
  variant?: string;
  children: React.ReactNode;
}

const defaultProps = {
  variant: undefined,
};

const CardHeader = (
  {
    variant,
    children,
    ...rest
  }: Props
) => {
  // @ts-ignore
  const styles = useStyleConfig('CardHeader', { variant });
  // Pass the computed styles into the `__css` prop
  return (
    <Box __css={styles} {...rest}>
      {children}
    </Box>
  );
};

CardHeader.defaultProps = defaultProps;

export default CardHeader;
