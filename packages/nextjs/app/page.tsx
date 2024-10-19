"use client";

//import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col flex-grow p-5">
        <iframe
          className="rounded-2xl w-full h-[720px]"
          src="https://www.youtube.com/embed/kZfsPIb580c?si=KsfXaKl-YFPAuB69"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
        <div className="grid w-1/2 text-center p-3 gap-3 mx-auto">
          <div className="my-2 font-medium flex">
            Connected Address:{" "}
            <span className="pl-3">
              <Address address={connectedAddress} />
            </span>
          </div>
          <div className="grid grid-cols-4">
            <div>Remote Adoption:</div>
            <button className="bg-red-500 rounded-xl hover:bg-red-300 w-fit px-3 py-1">3 Month</button>
            <button className="bg-red-500 rounded-xl hover:bg-red-300 w-fit px-3 py-1">6 Month</button>
            <button className="bg-red-500 rounded-xl hover:bg-red-300 w-fit px-3 py-1">12 Month</button>
          </div>
          <div className="grid grid-cols-4">
            <div>Volunteer NFT:</div>
            <button className="col-span-3 bg-red-500 rounded-xl hover:bg-red-300 w-fit px-3 py-1">Mint</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
