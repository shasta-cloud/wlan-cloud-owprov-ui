import React, { useCallback } from 'react';
import { Box } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import CreateServiceModal from '../../../../components/Modals/ServiceClass/CreateServiceModal';
import Actions from './Actions';
import ServiceClassTable from './Table';
import EditServiceClassModal from 'components/Modals/ServiceClass/EditServiceClassModal';
import useObjectModal from 'hooks/useObjectModal';
import useRefreshId from 'hooks/useRefreshId';

const propTypes = {
  operatorId: PropTypes.string.isRequired,
};

const ServiceClassTab = ({ operatorId }) => {
  const { refreshId, refresh } = useRefreshId();
  const { obj: serviceClass, openModal, isOpen, onClose } = useObjectModal();
  const actions = useCallback(
    (cell) => <Actions key={uuid()} cell={cell.row} refreshTable={refresh} openEdit={openModal} />,
    [openModal],
  );

  return (
    <>
      <Box textAlign="right" mb={2}>
        <CreateServiceModal operatorId={operatorId} refresh={refresh} />
      </Box>
      <ServiceClassTable operatorId={operatorId} actions={actions} refreshId={refreshId} />
      <EditServiceClassModal serviceClass={serviceClass} isOpen={isOpen} onClose={onClose} refresh={refresh} />
    </>
  );
};
ServiceClassTab.propTypes = propTypes;
export default ServiceClassTab;
