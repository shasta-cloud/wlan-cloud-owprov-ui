import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  CButton,
  CDataTable,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CRow,
  CCol,
  CInput,
  CPopover,
  CLink,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilX, cilSave } from '@coreui/icons';
import { useTranslation } from 'react-i18next';
import { useAuth, useToast, FormattedDate } from 'ucentral-libs';
import axiosInstance from 'utils/axiosInstance';

const AssociateContactModal = ({ show, toggle, defaultContact, updateConfiguration }) => {
  const { t } = useTranslation();
  const { currentToken, endpoints } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedContact, setSelectedContact] = useState({ value: '', uuid: '' });

  const getPartialContacts = async (offset) => {
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${currentToken}`,
    };

    return axiosInstance
      .get(`${endpoints.owprov}/api/v1/contact?limit=500&offset=${offset}`, { headers })
      .then((response) => response.data.contacts)
      .catch(() => {
        addToast({
          title: t('common.error'),
          body: t('common.general_error'),
          color: 'danger',
          autohide: true,
        });
        return [];
      });
  };

  const updateContact = (value, uuid) => setSelectedContact({ value, uuid });

  const save = () => updateConfiguration(selectedContact);

  const getContacts = async () => {
    setLoading(true);

    const allConfigs = [];
    let continueGetting = true;
    let i = 1;
    while (continueGetting) {
      // eslint-disable-next-line no-await-in-loop
      const newConfigs = await getPartialContacts(i);
      if (newConfigs === null || newConfigs.length === 0) continueGetting = false;
      allConfigs.push(...newConfigs);
      i += 500;
    }
    const sortedFirmware = allConfigs.sort((a, b) => {
      const firstDate = a.created;
      const secondDate = b.created;
      if (firstDate < secondDate) return 1;
      return firstDate > secondDate ? -1 : 0;
    });
    setConfigs(sortedFirmware);

    setLoading(false);
  };

  useEffect(() => {
    if (show) {
      setSelectedContact(defaultContact);
      setFilter('');
      getContacts();
    }
  }, [show]);

  const fields = [
    { key: 'created', label: t('common.created'), _style: { width: '20%' }, filter: false },
    { key: 'name', label: t('user.name'), _style: { width: '25%' }, filter: false },
    { key: 'description', label: t('user.description'), _style: { width: '50%' } },
    { key: 'actions', label: '', _style: { width: '15%' }, filter: false },
  ];

  return (
    <CModal show={show} onClose={toggle} size="xl">
      <CModalHeader className="p-1">
        <CModalTitle className="pl-1 pt-1">{t('configuration.title')}</CModalTitle>
        <div className="text-right">
          <CPopover content={t('common.save')}>
            <CButton color="primary" variant="outline" className="ml-2" onClick={save}>
              <CIcon content={cilSave} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.close')}>
            <CButton color="primary" variant="outline" className="ml-2" onClick={toggle}>
              <CIcon content={cilX} />
            </CButton>
          </CPopover>
        </div>
      </CModalHeader>
      <CModalBody>
        <CRow>
          <CCol>
            <b>
              {t('configuration.currently_selected_config', {
                config: selectedContact.uuid === '' ? t('common.none') : selectedContact.value,
              })}
            </b>
            <CButton
              id=""
              className="ml-3"
              color="danger"
              variant="outline"
              onClick={() => updateContact('', '')}
            >
              {t('common.clear')}
            </CButton>
          </CCol>
        </CRow>
        <CRow className="my-4">
          <CCol sm="12" md="7" lg="5">
            <CInput
              type="text"
              placeholder="Search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </CCol>
          <CCol />
        </CRow>
        <div className="overflow-auto" style={{ height: '600px' }}>
          <CDataTable
            items={configs}
            fields={fields}
            loading={loading}
            hover
            tableFilterValue={filter}
            border
            scopedSlots={{
              name: (item) => (
                <td>
                  <CLink
                    className="c-subheader-nav-link"
                    aria-current="page"
                    to={() => `/contacts`}
                  >
                    {item.firstname} {item.lastname}
                  </CLink>
                </td>
              ),
              created: (item) => (
                <td>
                  <FormattedDate date={item.created} />
                </td>
              ),
              actions: (item) => (
                <td>
                  <CPopover content={t('configuration.select_configuration')}>
                    <CButton
                      color="primary"
                      variant="outline"
                      onClick={() => updateContact(`${item.firstname} ${item.lastname}`, item.id)}
                    >
                      <CIcon content={cilPlus} />
                    </CButton>
                  </CPopover>
                </td>
              ),
            }}
          />
        </div>
      </CModalBody>
    </CModal>
  );
};

AssociateContactModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  defaultContact: PropTypes.instanceOf(Object).isRequired,
  updateConfiguration: PropTypes.func.isRequired,
};
export default AssociateContactModal;
