import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { MagnifyingGlass, Trash } from 'phosphor-react';
import { useMutation } from 'react-query';
import { axiosProv } from 'utils/axiosInstances';
import { v4 as uuid } from 'uuid';

const deleteApi = async (id) => axiosProv.delete(`/contact/${id}`).then(() => true);

const propTypes = {
  cell: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  refreshTable: PropTypes.func.isRequired,
  openEditModal: PropTypes.func.isRequired,
};

const Actions = ({ cell: { original: contact }, refreshTable, openEditModal }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteConfig = useMutation(() => deleteApi(contact.id), {
    onSuccess: () => {
      onClose();
      refreshTable();
      toast({
        id: `contact-delete-success${uuid()}`,
        title: t('common.success'),
        description: t('crud.success_delete_obj', {
          obj: contact.name,
        }),
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
    onError: (e) => {
      toast({
        id: 'contact-delete-error',
        title: t('common.error'),
        description: t('crud.error_delete_obj', {
          obj: contact.name,
          e: e?.response?.data?.ErrorDescription,
        }),
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    },
  });

  const handleDeleteClick = () => deleteConfig.mutateAsync();
  const handleEditClick = () => openEditModal(contact);

  return (
    <Flex>
      <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <Tooltip hasArrow label={t('crud.delete')} placement="top" isDisabled={isOpen}>
          <Box>
            <PopoverTrigger>
              <IconButton colorScheme="red" icon={<Trash size={20} />} size="sm" />
            </PopoverTrigger>
          </Box>
        </Tooltip>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            {t('crud.delete')} {contact.name}
          </PopoverHeader>
          <PopoverBody>{t('crud.delete_confirm', { obj: t('contacts.one') })}</PopoverBody>
          <PopoverFooter>
            <Center>
              <Button colorScheme="gray" mr="1" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button
                colorScheme="red"
                ml="1"
                onClick={handleDeleteClick}
                isLoading={deleteConfig.isLoading}
              >
                {t('common.yes')}
              </Button>
            </Center>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
      <Tooltip hasArrow label={t('common.view_details')} placement="top">
        <IconButton
          ml={2}
          colorScheme="blue"
          icon={<MagnifyingGlass size={20} />}
          size="sm"
          onClick={handleEditClick}
        />
      </Tooltip>
    </Flex>
  );
};

Actions.propTypes = propTypes;

export default Actions;
