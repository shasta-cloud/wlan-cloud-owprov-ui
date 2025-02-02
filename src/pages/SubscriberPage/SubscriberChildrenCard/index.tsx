import React from 'react';
import { Box, Center, Spinner } from '@chakra-ui/react';
import DevicesTab from './DevicesTab';
import Card from 'components/Card';
import CardBody from 'components/Card/CardBody';
import LoadingOverlay from 'components/LoadingOverlay';
import { useGetSubscriber } from 'hooks/Network/Subscribers';

interface Props {
  id: string;
}

const SubscriberChildrenCard = ({ id }: Props) => {
  const { data: subscriber, isFetching } = useGetSubscriber({ id });

  return (
    <Card>
      <CardBody>
        {!subscriber ? (
          <Center w="100%">
            <Spinner size="xl" />
          </Center>
        ) : (
          <LoadingOverlay isLoading={isFetching}>
            <Box display="unset" w="100%">
              <DevicesTab subscriberId={id} operatorId={subscriber?.owner} />
            </Box>
          </LoadingOverlay>
        )}
      </CardBody>
    </Card>
  );
};

export default SubscriberChildrenCard;
