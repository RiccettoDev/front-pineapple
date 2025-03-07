import api from "services/api";
import { AxiosResponse } from "axios";

import { iUser } from "interfaces/hooks";
import FindManyProps from "interfaces/find-many.interfaces";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const findMany = async ({ ...props }: FindManyProps) => {
  try {
    const { data } = (await api.get("/customers", {
      params: { ...props },
    })) as AxiosResponse<iUser.APIFindManyProps>;

    return data;
  } catch (error) {
    return null;
  }
};

export function useProducers(page: number, pageSize: number) {
  return useQuery({
    queryKey: ["users", page, pageSize],
    queryFn: () => findMany({ skip: page * pageSize, take: pageSize }),
    staleTime: 1000 * 60 * 10,
    placeholderData: keepPreviousData,
  });
}

export default { findMany };
