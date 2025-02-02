import React, { useMemo } from 'react';
import { bytesString } from 'utils/stringHelper';

const DataCell = ({ bytes }: { bytes?: number }) => {
  const data = useMemo(() => {
    if (bytes === undefined) return '-';

    return bytesString(bytes);
  }, [bytes]);

  return <div>{data}</div>;
};

export default React.memo(DataCell);
