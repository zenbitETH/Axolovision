import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Debug Contracts",
  description: "Debug your deployed 🏗 Scaffold-ETH 2 contracts in an easy way",
});

const Reviewers: NextPage = () => {
    return (
      <>
        <div className="grid grid-cols-3 gap-3 p-3">
            <div className="bg-gradient-to-b from-black via-black to-gray-800  rounded-md text-lote text-white text-center grid gap-3">
                <div className="">
                <iframe
                  className="rounded-2xl w-full h-[400px]"
                  src="https://www.youtube.com/embed/kZfsPIb580c?si=KsfXaKl-YFPAuB69"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
                </div>
                <div>
                    <div className="text-2xl py-3">Stress event</div>
                    <div className="font-light ">"The axolotls got scared by the camera and moved to the end of the fish tank"</div>
                </div>
                <div className="grid grid-cols-2 text-center text-3xl gap-3">
                    <button className="mx-auto w-full rounded-tr-md rounded-bl-md py-2">✅ <span className="text-base font-silk">Valid clip </span></button>
                    <button className="mx-auto w-full rounded-tl-md rounded-br-md py-2">⛔ <span className="text-base font-silk">Invalid clip </span></button>
                </div>
            </div>
            
        </div>
      </>
    );
  };
  
  export default Reviewers;