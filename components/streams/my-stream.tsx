import { useContext } from 'react';

import { MYSELF } from '@common/constants';
import { UsersConnectionContext } from 'contexts/users-connection';

import VideoContainer from '@components/video-container';
import { PeerVideo } from '..';
import { useSession } from 'next-auth/react';

export default function MyStream({
  stream,
  muted,
  visible,
}: {
  stream: MediaStream;
  muted: boolean;
  visible: boolean;
}) {
  const { data: session } = useSession();
  const avatar = session?.user?.image!;
  const { myId } = useContext(UsersConnectionContext);

  return (
    <VideoContainer
      id={myId}
      muted={muted}
      visible={visible}
      stream={stream}
      userPicture={avatar}
    >
      <PeerVideo stream={stream} name={MYSELF} isMe={true} />
    </VideoContainer>
  );
}
