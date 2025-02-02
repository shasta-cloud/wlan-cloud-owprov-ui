import React, { useCallback } from 'react';
import { Alert, Box, Center, Heading } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import Actions from './Actions';
import VenueTable from 'components/Tables/VenueTable';
import CreateVenueModal from 'components/Tables/VenueTable/CreateVenueModal';
import { EntityShape } from 'constants/propShapes';

const propTypes = {
  entity: PropTypes.shape(EntityShape).isRequired,
};

const EntityVenueTableWrapper = ({ entity }) => {
  const { t } = useTranslation();
  const actions = useCallback((cell) => <Actions key={uuid()} cell={cell.row} />, []);

  if (entity?.id === '0000-0000-0000') {
    return (
      <Center minHeight="334px">
        <Alert colorScheme="red" size="xl">
          <Heading size="md">{t('entities.venues_under_root')}</Heading>
        </Alert>
      </Center>
    );
  }

  return (
    <>
      <Box textAlign="right" mb={2}>
        <CreateVenueModal entityId={entity.id} />
      </Box>
      <VenueTable select={entity.venues} actions={actions} />
    </>
  );
};
EntityVenueTableWrapper.propTypes = propTypes;
export default EntityVenueTableWrapper;
