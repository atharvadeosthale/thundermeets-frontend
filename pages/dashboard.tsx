import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { v4 } from "uuid";

export default function Dashboard() {
  const [meetingName, setMeetingName] = useState<string>("");
  const [meetingDescription, setMeetingDescription] = useState<string>("");
  const [meetingTime, setMeetingTime] = useState<string>("");
  const [agendas, setAgendas] = useState<any>([]);
  const [agendaCount, setAgendaCount] = useState<any>([]);
  const router = useRouter();

  const scheduleMeeting = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user")!).access_token;

      const channel_name = v4();

      const request = await fetch(
        "https://thunder-meets.herokuapp.com/meeting/",
        {
          method: "POST",
          body: JSON.stringify({
            channel_name,
            meeting_name: meetingName,
            meeting_description: meetingDescription,
            agendas,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
        }
      );

      const data = await request.json();

      if (!request.ok) {
        console.log(data);
        return alert("Unable to schedule meeting! Please try again!");
      }

      alert(
        `Meeting successfully scheduled! Here's a link to your meeting - http://localhost:3000/call/${channel_name}`
      );
    } catch (err) {
      console.error(err);
      alert("Something went wrong scheduling the meeting!");
    }
  };

  return (
    <div className="flex min-h-screen max-w-7xl mx-auto w-full flex-col py-2">
      <Head>
        <title>Dashboard - Thunder Meets</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navbar */}
      <div className="flex justify-between py-3 items-center">
        <div className="text-2xl font-bold">ThunderMeets</div>
        <div
          className="text-xl font-light"
          onClick={() => router.push("/login")}
        >
          Login
        </div>
      </div>

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
    </div>
  );
}
