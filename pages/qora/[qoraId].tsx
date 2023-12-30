import { NextPage, GetServerSidePropsContext, PreviewData } from "next";
import { createContext, useState } from "react";

import { getSession } from "next-auth/react";

import Room from "@app/index";
import { Header, Lobby } from "@components/index";
import { useMediaStream } from "@hooks/index";

import { LoaderError } from "@common/components";
import { FAILURE_MSG, LOADER_STREAM_MSG } from "@common/constants";
import { QoraContextType } from "@common/types";

export const QoraContext = createContext<Partial<QoraContextType>>({});

const Qora: NextPage = () => {
  const [isLobby, setIsLobby] = useState(true);
  const { stream, isLoading } = useMediaStream();

  if (isLoading) return <LoaderError msg={LOADER_STREAM_MSG} />;
  if (!stream) return <LoaderError msg={FAILURE_MSG} />;

  if (isLobby)
    return (
      <>
        <Header />
        <Lobby stream={stream} onJoinRoom={() => setIsLobby(false)} />;
      </>
    );

  return (
    <>
      <Header />
      <Room stream={stream} />
    </>
  );
};

export default Qora;

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext<any, PreviewData>
) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
