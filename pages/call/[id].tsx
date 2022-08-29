// @ts-nocheck
// import AgoraUIKit, { PropsInterface } from "agora-react-uikit";
import React, { useEffect, useLayoutEffect, useState } from "react";
import dynamic from "next/dynamic";
import useIsomorphicLayoutEffect from "use-isomorphic-layout-effect";
import { useRouter } from "next/router";
import { PropsInterface } from "agora-react-uikit";
import moment from "moment";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
// import AgoraUIKit from "agora-react-uikit";
const AgoraUIKit = dynamic(() => import("agora-react-uikit"), { ssr: false });
// const AgoraUIKit = dynamic(import("agora-react-uikit"), { ssr: false });
// const AgoraUIKit = import("agora-react-uikit").default;

export default function Call({ id }: any) {
  const [isBrowserReady, setIsBrowserReady] = useState<boolean>(false);
  const [channel, setChannel] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [userid, setuserid] = useState<any>(0);
  // @ts-ignore
  const [agoraUiId, setAgoraUid] = useState<number>(null);
  const router = useRouter();
  const [agendas, setAgendas] = useState<any>([]);

  console.log(agendas);

  const checkAgendaTime = () => {
    const interval = setInterval(async () => {
      console.log("sefergergregergergegrergg");

      const date = moment();
      console.log("can u go here");
      await [1, 2, 4, 56, 7].map((ie, j) => {
        console.log(ie, j);
        console.log(agendas);
      });
      // @ts-ignore
      await agendas?.map((agenda, index) => {
        console.log("I've been sent here");
        //@ts-ignore
        if (agenda?.status == true) return;
        // @ts-ignore
        if (date.isAfter(moment(agenda.time_stamp))) {
          console.log("I was here before cap");
          let clonedAgendas = agendas;
          // @ts-ignore
          clonedAgendas[index].status = true;
          console.log("im here");
          setAgendas(clonedAgendas);
          console.log("bruh this never executes");
          //@ts-ignore
          // alert(agenda.name);
          toast(agenda.name);
        }

        console.log("else ig");
      });
    }, 5000);

    console.log("BRUHHFHHEFHEDBEFBHFBEFIFBJFHVEJUFVIEFB");

    return () => clearInterval(interval);
  };

  const getAgoraToken = async () => {
    try {
      const token = localStorage.getItem("access")!;
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

      const agendaReq = await fetch(
        `https://thunder-meets.herokuapp.com/meeting/?search=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
        }
      );
      const agendaData = await agendaReq.json();
      console.log(agendaData?.results[0]?.agendas);
      // @ts-ignore
      await setAgendas((agendatemp) => agendaData?.results[0]?.agendas);

      return () => {};
    } catch (error) {
      console.error(error);
      alert("Error joining the meeting, please reload or try again later.");
    }
  };

  // useLayoutEffect(() => {
  //   getAgoraToken();
  // }, []);
  // @ts-ignore
  useEffect(() => {
    getAgoraToken();
  }, []);
  useEffect(checkAgendaTime, [agendas]);

  const props: PropsInterface = {
    rtcProps: {
      appId: "0ebd6ccb4b56484f99125b511f387fa8",
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
    <Layout>
      {isBrowserReady && (
        <AgoraUIKit
          rtcProps={props.rtcProps}
          callbacks={props.callbacks}
          styleProps={{
            videoMode: { max: "cover", min: "cover" },
            maxViewStyles: { height: "70vh", width: "70vh" },
          }}
        />
      )}
    </Layout>
  );
}

Call.getInitialProps = async (ctx: any) => {
  const { id } = ctx.query;

  return { id };
};
