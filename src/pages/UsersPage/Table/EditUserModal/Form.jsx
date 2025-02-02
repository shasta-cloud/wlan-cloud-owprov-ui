import React, { useEffect, useState } from 'react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Flex, Link, useToast, Tabs, TabList, TabPanels, TabPanel, Tab, SimpleGrid } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import NotesTable from 'components/CustomFields/NotesTable';
import SelectField from 'components/FormFields/SelectField';
import StringField from 'components/FormFields/StringField';
import ToggleField from 'components/FormFields/ToggleField';
import { UpdateUserSchema } from 'constants/formSchemas';
import { useAuth } from 'contexts/AuthProvider';
import useApiRequirements from 'hooks/useApiRequirements';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  updateUser: PropTypes.instanceOf(Object).isRequired,
  refreshUsers: PropTypes.func.isRequired,
  userToUpdate: PropTypes.shape({
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    currentPassword: PropTypes.string.isRequired,
    userRole: PropTypes.string.isRequired,
  }).isRequired,
  formRef: PropTypes.instanceOf(Object).isRequired,
};

const UpdateUserForm = ({ editing, isOpen, onClose, updateUser, refreshUsers, userToUpdate, formRef }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { user } = useAuth();
  const [formKey, setFormKey] = useState(uuid());
  const { passwordPolicyLink, passwordPattern } = useApiRequirements();

  const formIsDisabled = () => {
    if (!editing) return true;
    if (user?.userRole === 'root') return false;
    if (user?.userRole === 'partner') return false;
    if (user?.userRole === 'admin') {
      if (userToUpdate.userRole === 'partner' || userToUpdate.userRole === 'admin') return true;
      return false;
    }
    return true;
  };

  useEffect(() => {
    setFormKey(uuid());
  }, [isOpen]);

  return (
    <Formik
      innerRef={formRef}
      enableReinitialize
      key={formKey}
      initialValues={userToUpdate}
      validationSchema={UpdateUserSchema(t, { passRegex: passwordPattern })}
      onSubmit={(
        { name, description, currentPassword, userRole, notes, changePassword },
        { setSubmitting, resetForm },
      ) =>
        updateUser.mutateAsync(
          {
            name,
            currentPassword: currentPassword.length > 0 ? currentPassword : undefined,
            userRole,
            changePassword,
            description,
            notes: notes.filter((note) => note.isNew),
          },
          {
            onSuccess: () => {
              setSubmitting(false);
              resetForm();
              toast({
                id: 'user-creation-success',
                title: t('common.success'),
                description: t('crud.success_update_obj', {
                  obj: t('user.title'),
                }),
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
              });
              refreshUsers();
              onClose();
            },
            onError: (e) => {
              toast({
                id: uuid(),
                title: t('common.error'),
                description: t('crud.error_update_obj', {
                  obj: t('user.title'),
                  e: e?.response?.data?.ErrorDescription,
                }),
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
              });
              setSubmitting(false);
            },
          },
        )
      }
    >
      <>
        <Tabs variant="enclosed">
          <TabList>
            <Tab>{t('common.main')}</Tab>
            <Tab>{t('common.notes')}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Form>
                <SimpleGrid minChildWidth="300px" spacing="20px">
                  <StringField name="email" label={t('common.email')} isDisabled isRequired />
                  <SelectField
                    name="userRole"
                    label={t('user.role')}
                    options={[
                      { value: 'accounting', label: 'Accounting' },
                      { value: 'admin', label: 'Admin' },
                      { value: 'csr', label: 'CSR' },
                      { value: 'installer', label: 'Installer' },
                      { value: 'noc', label: 'NOC' },
                      { value: 'root', label: 'Root' },
                      { value: 'system', label: 'System' },
                    ]}
                    isRequired
                    isDisabled
                  />
                  <StringField name="name" label={t('common.name')} isDisabled={formIsDisabled()} isRequired />
                  <ToggleField name="changePassword" label={t('users.change_password')} isDisabled={formIsDisabled()} />
                  <StringField
                    name="currentPassword"
                    label={t('user.password')}
                    isDisabled={formIsDisabled()}
                    hideButton
                  />
                  <StringField name="description" label={t('common.description')} isDisabled={formIsDisabled()} />
                </SimpleGrid>
              </Form>
            </TabPanel>
            <TabPanel>
              {' '}
              <NotesTable name="notes" isDisabled={!editing} />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Flex justifyContent="center" alignItems="right" maxW="100%" mt={4} mb={6}>
          <Box w="100%">
            <Link href={passwordPolicyLink} isExternal>
              {t('login.password_policy')}
              <ExternalLinkIcon mx="2px" />
            </Link>
          </Box>
        </Flex>
      </>
    </Formik>
  );
};

UpdateUserForm.propTypes = propTypes;

export default UpdateUserForm;
