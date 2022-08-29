// @ts-nocheck
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <Layout>
      <div className="flex min-h-screen max-w-7xl mx-auto w-full flex-col py-2">
        <Head>
          <title>Thunder Meets</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* Navbar */}

        <div className="w-full relative h-screen flex items-center">
          <div className="max-w-2xl">
            <div className="text-6xl font-black leading-tight">
              Meetings should be easy and productive
            </div>
            <div className="mt-5 text-2xl text-gray-500">
              Don't you think so? Our platform makes your meetings more
              productive
            </div>
            <button
              className="bg-[#35A3E1] px-5 py-2 rounded-lg text-xl mt-5"
              onClick={() => router.push("/dashboard")}
            >
              Get started
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
