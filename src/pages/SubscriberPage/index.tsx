import React from 'react';
import { Flex } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import SubscriberCard from './SubscriberCard';
import SubscriberChildrenCard from './SubscriberChildrenCard';
import { useAuth } from 'contexts/AuthProvider';

const SubscriberPage = () => {
  const { isUserLoaded } = useAuth();
  const { id } = useParams();

  return (
    <Flex flexDirection="column" pt="75px">
      {isUserLoaded && id !== '' && (
        <>
          <SubscriberCard id={id ?? ''} />
          <SubscriberChildrenCard id={id ?? ''} />
        </>
      )}
    </Flex>
  );
};

export default SubscriberPage;
