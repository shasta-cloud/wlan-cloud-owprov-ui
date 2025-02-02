import React from 'react';
import { Button, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import IconBox from 'components/IconBox';
import { Route } from 'models/Routes';

const variantChange = '0.2s linear';

interface Props {
  activeRoute: (path: string, otherRoute: string | undefined) => string;
  route: Route;
  role: string;
}

const NavLinkButton = (
  {
    activeRoute,
    route,
    role
  }: Props
) => {
  const { t } = useTranslation();
  const activeTextColor = useColorModeValue('gray.700', 'white');
  const inactiveTextColor = useColorModeValue('gray.600', 'gray.200');
  const inactiveIconColor = useColorModeValue('gray.100', 'gray.600');

  return (
    <NavLink to={route.path} key={uuid()}>
      {activeRoute(route.path, undefined) === 'active' ? (
        <Button
          hidden={route.hidden || !route.authorized.includes(role)}
          boxSize="initial"
          justifyContent="flex-start"
          alignItems="center"
          boxShadow="none"
          bg="transparent"
          transition={variantChange}
          mb="12px"
          mx="auto"
          ps="10px"
          py="12px"
          borderRadius="15px"
          w="100%"
          _active={{
            bg: 'inherit',
            transform: 'none',
            borderColor: 'transparent',
          }}
          _focus={{
            boxShadow: '0px 7px 11px rgba(0, 0, 0, 0.04)',
          }}
        >
          <Flex>
            <IconBox bg="blue.300" color="white" h="42px" w="42px" me="12px" transition={variantChange}>
              {route.icon(true)}
            </IconBox>
            <Text color={activeTextColor} my="auto" fontSize="lg">
              {t(route.name)}
            </Text>
          </Flex>
        </Button>
      ) : (
        <Button
          hidden={route.hidden || !route.authorized.includes(role)}
          boxSize="initial"
          justifyContent="flex-start"
          alignItems="center"
          bg="transparent"
          mb="12px"
          mx="auto"
          py="12px"
          ps="10px"
          borderRadius="15px"
          w="100%"
          _active={{
            bg: 'inherit',
            transform: 'none',
            borderColor: 'transparent',
          }}
          _focus={{
            boxShadow: 'none',
          }}
        >
          <Flex>
            <IconBox bg={inactiveIconColor} color="blue.300" h="34px" w="34px" me="12px" transition={variantChange}>
              {route.icon(false)}
            </IconBox>
            <Text color={inactiveTextColor} my="auto" fontSize="sm">
              {t(route.name)}
            </Text>
          </Flex>
        </Button>
      )}
    </NavLink>
  );
};

export default React.memo(NavLinkButton);
