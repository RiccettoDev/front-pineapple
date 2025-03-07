"use client";
import { Flex, Spinner } from "@chakra-ui/react";
import { AuthContext } from "contexts/auth.context";
import { usePathname } from "next/navigation";
import { useContext, useState } from "react";

import { AccessLevels } from "assets/config";

const paramsValidate = (p: any) => {
  let uuid = p.match(
    "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
  );
  if (uuid === null && isNaN(p)) {
    return false;
  }
  return true;
};

export function ValidateAuth({ children }: any) {
  const path = usePathname();

  const [loading, setLoading] = useState(false);
  const [render, setRender] = useState(true);
  const { me } = useContext(AuthContext);

  async function validateAccess() {
    let allowed: any = false;
    let user: any = await me();

    const params: any = path.split("/");

    const url = !paramsValidate(params[params.length - 1])
      ? path
      : path.slice(0, path.length - 1 - params[params.length - 1].length) +
        "/:param";

    const levels = AccessLevels.find((a) => a.path === url);

    if (levels) {
      allowed = levels.role.find((role) => user?.role === role);
    }

    setTimeout(() => {
      setRender(allowed);
    }, 0);
  }

  // useEffect(() => {
  //   validateAccess();

  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 200);
  // }, []);

  return !loading ? (
    render ? (
      children
    ) : null
  ) : (
    <Flex
      height="100vh"
      bg="white"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Spinner alignSelf="center" />
    </Flex>
  );
}
