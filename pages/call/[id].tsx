// import AgoraUIKit, { PropsInterface } from "agora-react-uikit";
import React, { useEffect, useLayoutEffect, useState } from "react";
import dynamic from "next/dynamic";
import useIsomorphicLayoutEffect from "use-isomorphic-layout-effect";
import { useRouter } from "next/router";
import { PropsInterface } from "agora-react-uikit";

const AgoraUIKit = dynamic(() => import("agora-react-uikit"), { ssr: false });

export default function Call({ id }: any) {
  const [isBrowserReady, setIsBrowserReady] = useState<boolean>(false);
  const [channel, setChannel] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [userid, setuserid] = useState<any>(0);
  const [agoraUiId, setAgoraUid] = useState<number>(null);
  const router = useRouter();

  const getAgoraToken = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user")!).access_token;
      const idtemp = parseInt(JSON.parse(localStorage.getItem("user")!).id);
      setuserid(idtemp);

      const request = await fetch(
        `https://thunder-meets.herokuapp.com/meeting/generate_agora_token/?channelName=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
        }
      );

      const data = await request.json();

      if (!request.ok) {
        console.log(data);
        return alert("Error joining the meeting!");
      }

      await setChannel(id);
      await setToken(data.token);
      await setAgoraUid(data.uid);
      await setIsBrowserReady(true);
    } catch (error) {
      console.error(error);
      alert("Error joining the meeting, please reload or try again later.");
    }
  };

  // useLayoutEffect(() => {
  //   getAgoraToken();
  // }, []);
  // @ts-ignore
  useEffect(() => getAgoraToken, []);
  const props: PropsInterface = {
    rtcProps: {
      appId: "4a5e78d97b0748fe8d3e44f42b85f93f",
      channel: id,
      uid: agoraUiId,
      token: token, // pass in channel token if the app is in secure mode
    },
    callbacks: {
      EndCall: () => {
        alert("Call ended!");
        router.push("/dashboard");
      },
    },
    styles: {
      container: { width: "100vw", height: "100vh", display: "flex", flex: 1 },
    },
  };

  return (
    <div>
      {isBrowserReady && (
        <AgoraUIKit
          rtcProps={props.rtcProps}
          callbacks={props.callbacks}
          styleProps={{
            videoMode: { max: "cover", min: "cover" },
            maxViewStyles: { height: "93vh" },
          }}
        />
      )}
    </div>
  );
}

Call.getInitialProps = async (ctx: any) => {
  const { id } = ctx.query;

  return { id };
};
