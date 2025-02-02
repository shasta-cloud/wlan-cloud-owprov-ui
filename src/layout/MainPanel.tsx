import React from 'react';
import { Box, LayoutProps, useStyleConfig } from '@chakra-ui/react';

interface Props extends LayoutProps {
  children: React.ReactNode;
}

const MainPanel = (
  {
    children,
    ...props
  }: Props
) => {
  const styles = useStyleConfig('MainPanel');

  return (
    <Box __css={styles} {...props}>
      {children}
    </Box>
  );
};

export default MainPanel;
