import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { User } from 'models/User';
import { axiosProv } from 'utils/axiosInstances';

const getConfigDescriptions = async (baseUrl: string) =>
  axios.get(`${baseUrl.split('/api')[0]}/wwwassets/ucentral.schema.pretty.json`).then(({ data }) => data.$defs);

export const useGetConfigurationDescriptions = ({ enabled }: { enabled: boolean }) =>
  useQuery(['get-configuration-descriptions'], () => getConfigDescriptions(axiosProv.defaults.baseURL ?? ''), {
    staleTime: Infinity,
    enabled,
  });
export interface AuthProviderProps {
  token?: string;
  children: React.ReactNode;
}

export interface AuthProviderReturn {
  avatar: string;
  refetchUser: () => void;
  refetchAvatar: () => void;
  user?: User;
  token?: string;
  setToken: (token: string) => void;
  logout: () => void;
  getPref: (preference: string) => string | null;
  setPref: ({ preference, value }: { preference: string; value: string }) => void;
  deletePref: (preference: string) => void;
  ref: React.MutableRefObject<undefined>;
  endpoints: { [key: string]: string } | null;
  configurationDescriptions: Record<string, unknown>;
  isUserLoaded: boolean;
}
