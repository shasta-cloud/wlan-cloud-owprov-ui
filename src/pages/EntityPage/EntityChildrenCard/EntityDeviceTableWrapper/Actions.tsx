import React from 'react';
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
} from '@chakra-ui/react';
import { ArrowSquareOut, MagnifyingGlass, Trash } from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import DeviceActionDropdown from 'components/TableCells/DeviceActionDropdown';
import { useGetGatewayUi } from 'hooks/Network/Endpoints';
import { useDeleteTag } from 'hooks/Network/Inventory';
import { Device } from 'models/Device';

interface Props {
  cell: { original: Device };
  refreshEntity: () => void;
  openEditModal: (dev: Device) => void;
  onOpenScan: (serialNumber: string) => void;
  onOpenFactoryReset: (serialNumber: string) => void;
  onOpenUpgradeModal: (serialNumber: string) => void;
}

const Actions = (
  {
    cell: { original: tag },
    refreshEntity,
    openEditModal,
    onOpenScan,
    onOpenFactoryReset,
    onOpenUpgradeModal
  }: Props
) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: gwUi } = useGetGatewayUi();
  const { mutateAsync: deleteConfig, isLoading: isDeleting } = useDeleteTag({
    name: tag.name,
    refreshTable: refreshEntity,
    onClose,
  });

  const handleDeleteClick = () => deleteConfig(tag.serialNumber);
  const handleOpenEdit = () => openEditModal(tag);
  const handleOpenInGateway = () => window.open(`${gwUi}/#/devices/${tag.serialNumber}`, '_blank');

  return (
    <Flex>
      <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <Tooltip hasArrow label={t('crud.delete')} placement="top" isDisabled={isOpen}>
          <Box>
            <PopoverTrigger>
              <IconButton aria-label="Open Delete" colorScheme="red" icon={<Trash size={20} />} size="sm" />
            </PopoverTrigger>
          </Box>
        </Tooltip>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            {t('crud.delete')} {tag.name}
          </PopoverHeader>
          <PopoverBody>{t('crud.delete_confirm', { obj: t('inventory.tag_one') })}</PopoverBody>
          <PopoverFooter>
            <Center>
              <Button colorScheme="gray" mr="1" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button colorScheme="red" ml="1" onClick={handleDeleteClick} isLoading={isDeleting}>
                Yes
              </Button>
            </Center>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
      <DeviceActionDropdown
        device={tag}
        refresh={refreshEntity}
        onOpenScan={onOpenScan}
        onOpenFactoryReset={onOpenFactoryReset}
        onOpenUpgradeModal={onOpenUpgradeModal}
      />
      <Tooltip hasArrow label={t('common.view_details')} placement="top">
        <IconButton
          aria-label="Open Edit"
          ml={2}
          colorScheme="blue"
          icon={<MagnifyingGlass size={20} />}
          size="sm"
          onClick={handleOpenEdit}
        />
      </Tooltip>
      <Tooltip hasArrow label={t('common.view_in_gateway')} placement="top">
        <IconButton
          aria-label="Go to gateway"
          ml={2}
          colorScheme="blue"
          icon={<ArrowSquareOut size={20} />}
          size="sm"
          onClick={handleOpenInGateway}
        />
      </Tooltip>
    </Flex>
  );
};

export default Actions;
