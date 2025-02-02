import React, { useCallback, useState } from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { v4 as uuid } from 'uuid';
import Actions from './Actions';
import UseExistingContactModal from './UseExistingModal';
import ContactTable from 'components/Tables/ContactTable';
import CreateContactModal from 'components/Tables/ContactTable/CreateContactModal';
import EditContactModal from 'components/Tables/ContactTable/EditContactModal';
import { useAddVenueContact } from 'hooks/Network/Venues';
import { Contact } from 'models/Contact';
import { Venue } from 'models/Venue';

interface Props {
  venue?: Venue;
}

const VenueContactTableWrapper = ({ venue }: Props) => {
  const queryClient = useQueryClient();
  const [contact, setContact] = useState<Contact | undefined>(undefined);
  const [refreshId, setRefreshId] = useState(0);
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();
  const { mutateAsync: addContact } = useAddVenueContact({ id: venue?.id ?? '', originalContacts: venue?.contacts });

  const openEditModal = (newContact: Contact) => {
    setContact(newContact);
    openEdit();
  };

  const refreshEntity = () => queryClient.invalidateQueries(['get-venue', venue?.id ?? '']);

  const refetchContacts = () => {
    setRefreshId(refreshId + 1);
    refreshEntity();
  };

  const onContactCreate = async (newContactId: string) => {
    await addContact(newContactId);
    refetchContacts();
  };

  const actions = useCallback(
    (cell) => (
      <Actions
        key={uuid()}
        cell={cell.row}
        refreshEntity={refreshEntity}
        openEditModal={openEditModal}
        originalContacts={venue?.contacts ?? []}
        venueId={venue?.id ?? ''}
      />
    ),
    [refreshId, venue, addContact],
  );

  return (
    <>
      <Box textAlign="right" mb={2}>
        {venue && (
          <>
            <UseExistingContactModal onAssignContact={onContactCreate} venue={venue} />
            <CreateContactModal refresh={refreshEntity} isVenue entityId={venue?.id ?? ''} onCreate={onContactCreate} />
          </>
        )}
      </Box>
      <ContactTable
        select={venue?.contacts ?? []}
        actions={actions}
        refreshId={refreshId}
        ignoredColumns={['entity', 'venue']}
      />
      <EditContactModal isOpen={isEditOpen} onClose={closeEdit} contact={contact} refresh={refetchContacts} />
    </>
  );
};

export default VenueContactTableWrapper;
