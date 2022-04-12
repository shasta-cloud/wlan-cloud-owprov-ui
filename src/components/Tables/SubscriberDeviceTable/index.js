import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'components/DataTable';
import { useTranslation } from 'react-i18next';
import { useToast } from '@chakra-ui/react';
import { v4 as uuid } from 'uuid';
import FormattedDate from 'components/FormattedDate';
import { useGetSubscriberDevices } from 'hooks/Network/SubscriberDevices';

const propTypes = {
  actions: PropTypes.func.isRequired,
  operatorId: PropTypes.string.isRequired,
  ignoredColumns: PropTypes.arrayOf(PropTypes.string),
  refreshId: PropTypes.number,
  disabledIds: PropTypes.arrayOf(PropTypes.string),
};

const defaultProps = {
  ignoredColumns: [],
  refreshId: 0,
  disabledIds: [],
};

const SubscriberDeviceTable = ({ actions, operatorId, ignoredColumns, refreshId, disabledIds }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { data: subscriberDevices, isFetching, refetch } = useGetSubscriberDevices({ t, toast, operatorId });

  const actionCell = useCallback((cell) => actions(cell), [actions]);
  const memoizedDate = useCallback((cell, key) => <FormattedDate date={cell.row.values[key]} key={uuid()} />, []);

  // Columns array. This array contains your table headings and accessors which maps keys from data array
  const columns = React.useMemo(() => {
    const baseColumns = [
      {
        id: 'name',
        Header: t('common.name'),
        Footer: '',
        accessor: 'name',
        customMaxWidth: '200px',
        customWidth: 'calc(15vh)',
        customMinWidth: '150px',
      },
      {
        id: 'created',
        Header: t('common.created'),
        Footer: '',
        accessor: 'created',
        Cell: ({ cell }) => memoizedDate(cell, 'created'),
        customMinWidth: '150px',
        customWidth: '150px',
      },
      {
        id: 'modified',
        Header: t('common.modified'),
        Footer: '',
        accessor: 'modified',
        Cell: ({ cell }) => memoizedDate(cell, 'modified'),
        customMinWidth: '150px',
        customWidth: '150px',
      },
      {
        id: 'description',
        Header: t('common.description'),
        Footer: '',
        accessor: 'description',
        disableSortBy: true,
      },
      {
        id: 'id',
        Header: t('common.actions'),
        Footer: '',
        accessor: 'Id',
        customWidth: '80px',
        Cell: ({ cell }) => actionCell(cell),
        disableSortBy: true,
        alwaysShow: true,
      },
    ];

    return baseColumns;
  }, [disabledIds, actionCell]);

  useEffect(() => {
    if (refreshId > 0) refetch();
  }, [refreshId]);

  return (
    <DataTable
      columns={columns.filter((col) => !ignoredColumns.find((ignored) => ignored === col.id))}
      data={subscriberDevices ?? []}
      isLoading={isFetching}
      obj={t('devices.title')}
      minHeight="200px"
    />
  );
};

SubscriberDeviceTable.propTypes = propTypes;
SubscriberDeviceTable.defaultProps = defaultProps;

export default SubscriberDeviceTable;
