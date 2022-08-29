// @ts-nocheck
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import { axiosInstance } from "../api";
import Layout from "../components/Layout";
import { Disclosure } from "@headlessui/react";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function Dashboard() {
  const [meetingName, setMeetingName] = useState<string>("");
  const [meetingDescription, setMeetingDescription] = useState<string>("");
  const [meetingTime, setMeetingTime] = useState<string>("");
  const [agendas, setAgendas] = useState<any>([]);
  const [agendaCount, setAgendaCount] = useState<any>([]);
  const [myMeetings, setMyMeetings] = useState<any>(null);
  const router = useRouter();
  const getMyMeetings = async () => {
    try {
      const res = await axiosInstance.get("/meeting/my_meetings/");
      setMyMeetings(res.data);
    } catch (error) {
      toast.error("There Was An Error While Trying To Get Your Meetings");
    }
  };
  useEffect(() => {
    getMyMeetings();
  }, []);

  const scheduleMeeting = async () => {
    try {
      const channel_name = v4();

      const body = JSON.stringify({
        channel_name,
        meeting_name: meetingName,
        meeting_description: meetingDescription,
        agendas,
        meeting_timestamp: meetingTime,
      });
      const res = await axiosInstance.post("/meeting/", body);
      toast.success(
        `Meeting successfully scheduled! Here's a link to your meeting - http://localhost:3000/call/${channel_name}`
      );
    } catch (err) {
      console.error(err);
      toast("Something went wrong scheduling the meeting!");
    }
  };

  return (
    <Layout>
      <div className="flex min-h-screen max-w-7xl mx-auto w-full flex-col py-2">
        <Head>
          <title>Dashboard - Thunder Meets</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* Navbar */}

        <div className="mt-52 mb-52 w-full max-w-3xl border mx-auto p-5 rounded-lg border-gray-700 flex flex-col items-center justify-center">
          <input
            type="text"
            className="w-full px-5 py-2 text-lg rounded-lg bg-gray-800 outline-none"
            placeholder="Meeting name"
            value={meetingName}
            onChange={(e) => setMeetingName(e.target.value)}
          />
          <input
            type="text"
            className="w-full px-5 py-2 text-lg rounded-lg bg-gray-800 outline-none mt-5"
            placeholder="Meeting description"
            value={meetingDescription}
            onChange={(e) => setMeetingDescription(e.target.value)}
          />
          <input
            type="datetime-local"
            className="w-full px-5 py-2 text-lg rounded-lg bg-gray-800 outline-none mt-5"
            onChange={(e) => setMeetingTime(e.target.value)}
          />
          <button
            onClick={scheduleMeeting}
            className="w-full px-5 py-2 text-lg rounded-lg bg-blue-500 hover:bg-blue-600 transition-all outline-none mt-5"
          >
            Create Meeting
          </button>
          <button
            // @ts-ignore
            onClick={() =>
              setAgendas([
                ...agendas,
                { name: "", description: "", time_stamp: "" },
              ])
            }
            className="w-full px-5 py-2 text-lg rounded-lg bg-blue-500 hover:bg-blue-600 transition-all outline-none mt-5"
          >
            Add Agenda
          </button>
          {/* @ts-ignore */}
          {agendas.map((value, index) => (
            <div className="mt-5 w-full" key={index}>
              <input
                key={index}
                // value={agendas[index].name}
                onChange={async (e) => {
                  console.log(index, agendas);
                  let cloneAgendas = agendas;
                  cloneAgendas[index].name = e.target.value;
                  await setAgendas(cloneAgendas);
                }}
                type="text"
                className="w-full px-5 py-2 text-lg rounded-lg bg-gray-800 outline-none mt-5"
                placeholder="Agenda name"
              />
              <input
                key={index}
                // value={agendas[index].name}
                onChange={async (e) => {
                  console.log(index, agendas);
                  let cloneAgendas = agendas;
                  cloneAgendas[index].description = e.target.value;
                  await setAgendas(cloneAgendas);
                }}
                type="text"
                className="w-full px-5 py-2 text-lg rounded-lg bg-gray-800 outline-none mt-5"
                placeholder="Agenda description"
              />
              <input
                onChange={async (e) => {
                  console.log(index, agendas);
                  let cloneAgendas = agendas;
                  cloneAgendas[index].time_stamp = e.target.value;
                  await setAgendas(cloneAgendas);
                }}
                type="datetime-local"
                className="w-full px-5 py-2 text-lg rounded-lg bg-gray-800 outline-none mt-5"
              />
            </div>
          ))}
        </div>
        <h3 className="text-3xl font-extrabold mb-2">Scheduled Meetings</h3>
        {myMeetings?.map((meeting) => (
          <>
            <div className="flex border-2 p-4 border-white border-dashed justify-between items-center">
              <div>
                <span className="font-bold underline">Name: </span>
                {meeting.meeting_name}
              </div>
              <div>
                <span className="font-bold underline">Description: </span>
                {meeting.meeting_description}
              </div>
              <div>
                <span className="font-bold underline">Agendas: </span>
                <ol>
                  {meeting.agendas.map((agenda: any) => (
                    <li>{agenda.name}</li>
                  ))}
                </ol>
              </div>

              <div>
                {/* <button className="w-full px-5 py-2 text-lg rounded-lg bg-blue-500 hover:bg-blue-600 transition-all outline-none mt-5">
                  CopyLink
                </button> */}
                <CopyToClipboard
                  text={`http://thundermeets-frontend.vercel.app/call/${meeting.channel_name}`}
                  onCopy={() =>
                    toast.success("The Link For The Meeting Is Copied")
                  }
                >
                  <span className="w-full px-5 py-2 text-lg rounded-lg bg-blue-500 hover:bg-blue-600 transition-all outline-none mt-5 cursor-pointer">
                    Copy to clipboard
                  </span>
                </CopyToClipboard>
              </div>
            </div>
          </>
        ))}
      </div>
    </Layout>
  );
}
