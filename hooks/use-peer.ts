import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import Peer from "peerjs";

import { useMediaStream } from "@hooks/index";
import { SocketContext } from "@pages/_app";
import { Nullable, PeerId, RoomId } from "@common/types";
import { error } from "@common/utils";

/**
 * Creates a peer and joins them into the room
 * @returns peer object, its id and meta-state whether is peer fully created
 */
const usePeer = (stream: MediaStream) => {
  const socket = useContext(SocketContext);
  const room = useRouter().query.qoraId as RoomId;
  const { data: session } = useSession();

  const { muted, visible } = useMediaStream(stream);

  const [isLoading, setIsLoading] = useState(true);
  const [peer, setPeer] = useState<Nullable<Peer>>(null);
  const [myId, setMyId] = useState<PeerId>("");

  useEffect(() => {
    (async function createPeerAndJoinRoom() {
      try {
        const peer = new (await import("peerjs")).default({
          config: {
            iceServers: [
              { urls: [String(process.env.STUN_SERVER_URL)] },
              {
                url: String(process.env.TURN_SERVER_URL),
                credential: String(process.env.TURN_SERVER_CREDENTIAL),
                username: String(process.env.TURN_SERVER_USERNAME),
              },
            ],
          },
        });
        setPeer(peer);
        setIsLoading(false);

        peer.on("open", (id) => {
          console.log("your device id: ", id);
          setMyId(id);
          socket.emit("room:join", {
            room,
            user: {
              id,
              muted,
              visible,
              name: session?.user?.name,
              picture: session?.user?.image,
            },
          });
        });

        peer.on("error", error("Failed to setup peer connection"));
      } catch (e) {
        error("Unable to create peer")(e);
      }
    })();
  }, []);

  return {
    peer,
    myId,
    isPeerReady: !isLoading,
  };
};

export default usePeer;
