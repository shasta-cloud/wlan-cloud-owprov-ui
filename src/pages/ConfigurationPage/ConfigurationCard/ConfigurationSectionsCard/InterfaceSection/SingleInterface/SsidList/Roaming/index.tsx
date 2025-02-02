import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { INTERFACE_SSID_ROAMING_SCHEMA } from '../../../interfacesConstants';
import RoamingForm from './Roaming';
import useFastField from 'hooks/useFastField';

const Roaming = ({ editing, namePrefix }: { editing: boolean; namePrefix: string }) => {
  const { t } = useTranslation();
  const { value, onChange } = useFastField({ name: namePrefix });

  const { isEnabled } = useMemo(
    () => ({
      isEnabled: value !== undefined,
    }),
    [value],
  );

  const onToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.checked) {
        onChange(undefined);
      } else {
        onChange(INTERFACE_SSID_ROAMING_SCHEMA(t, true).cast());
      }
    },
    [onChange],
  );

  return <RoamingForm editing={editing} namePrefix={namePrefix} isEnabled={isEnabled} onToggle={onToggle} />;
};

export default React.memo(Roaming);
