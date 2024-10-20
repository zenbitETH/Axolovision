"use client";

import { useState } from 'react';
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { addToIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
import nftsMetadata from "~~/utils/simpleNFT/nftsMetadata";
import Image from 'next/image';

const Home: NextPage = () => {
  const { address: connectedAddress, isConnected, isConnecting } = useAccount();

  const { writeContractAsync } = useScaffoldWriteContract("YourCollectible");

  const { data: tokenIdCounter } = useScaffoldReadContract({
    contractName: "YourCollectible",
    functionName: "tokenIdCounter",
    watch: true,
  });

  // State variables
  const [showAdoptModal, setShowAdoptModal] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);
  const [showTakeClipModal, setShowTakeClipModal] = useState(false);
  const [hasMinted, setHasMinted] = useState(false);

  // State variables for the Take Clip modal
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [eventType, setEventType] = useState('');
  const [otherEventType, setOtherEventType] = useState('');
  const [description, setDescription] = useState('');

  const handleMintItem = async () => {
    if (tokenIdCounter === undefined) return;

    const tokenIdCounterNumber = Number(tokenIdCounter);
    const currentTokenMetaData = nftsMetadata[tokenIdCounterNumber % nftsMetadata.length];
    const notificationId = notification.loading("Uploading to IPFS");
    try {
      const uploadedItem = await addToIPFS(currentTokenMetaData);

      notification.remove(notificationId);
      notification.success("Metadata uploaded to IPFS");

      await writeContractAsync({
        functionName: "mintItem",
        args: [connectedAddress, uploadedItem.path],
      });

      setHasMinted(true);
      setShowMintModal(false);
    } catch (error) {
      notification.remove(notificationId);
      console.error(error);
    }
  };

  const handleSubmitClip = () => {
    // Handle the submission logic here
    // You can send the data to a backend or process it as needed
    console.log({
      startTime,
      endTime,
      eventType: eventType === 'Other' ? otherEventType : eventType,
      description,
    });

    // Clear the form fields
    setStartTime('');
    setEndTime('');
    setEventType('');
    setOtherEventType('');
    setDescription('');

    // Close the modal
    setShowTakeClipModal(false);
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow p-5 font-light">
        <div className="w-full my-auto">
          <iframe
            className="rounded-2xl xl:w-2/3 h-[720px] mx-auto"
            src="https://www.youtube.com/embed/kZfsPIb580c?si=KsfXaKl-YFPAuB69"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
          <div className="grid w-1/3 text-center p-3 gap-3 mx-auto border border-4 border-lote rounded-md mt-3">
            <div className="grid grid-cols-2 items-center">
              <div className='font-ral font-bold text-lote'>Remote Adoption:</div>
              <button
                className="rounded-md font-silk w-full"
                onClick={() => setShowAdoptModal(true)}
              >
                Adopt
              </button>
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className='font-ral font-bold text-lote'>Volunteer NFT:</div>
              <button
                className="rounded-md w-full px-3 font-silk"
                onClick={() => {
                  if (hasMinted) {
                    setShowTakeClipModal(true);
                  } else {
                    setShowMintModal(true);
                  }
                }}
              >
                {hasMinted ? "Take Clip" : "Mint"}
              </button>
            </div>
          </div>
        </div>

        {/* Adopt Modal */}
        {showAdoptModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-lote  ">
            <div className="bg-white rounded-md p-6 max-w-5xl mx-auto relative text-center">
              <h2 className="text-2xl font-bold mb-4">Remote Adoption</h2>
              {/* Content of the Adopt modal */}
              <p className="mb-4 text-justify font-semibold ">
                Support the axolotls in this fish tank by adopting them remotely. The funds will be split 70% for Axolotarium and 30% to support the research volunteers.
              </p>
              <div className='grid grid-cols-3 gap-3 items-center text-center w-full'>
                <button className='rounded-md mx-auto font-semibold font-silk'>3 months <span className='text-sm'>(300 USDC)</span></button>
                <button className='rounded-md mx-auto font-semibold font-silk'>6 months <span className='text-sm'>(600 USDC)</span></button>
                <button className='rounded-md mx-auto font-semibold font-silk'>12 months <span className='text-sm'>(1200 USDC)</span></button>
              </div>
              <button
                className="closeBT"
                onClick={() => setShowAdoptModal(false)}
              >
                X
              </button>
            </div>
          </div>
        )}

        {/* Mint Modal */}
        {showMintModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-md p-6 max-w-md mx-auto relative text-center text-lote">
              <h2 className="text-2xl font-bold mb-4">Volunteer NFT</h2>
              {/* Content of the Mint modal */}
              <div className="flex relative w-96 h-96 text-center mx-auto">
                <Image alt="SE2 logo" className="cursor-pointer" fill src="/volunteerNFT.svg" />
              </div>
              <p className="mb-4 font-semibold text-justify">
                Become a volunteer and help us identify the axolotl's unobserved behaviors!
              </p>
              {!isConnected || isConnecting ? (
                <RainbowKitCustomConnectButton />
              ) : (
                <button className="rounded-md" onClick={handleMintItem}>
                  Mint for free
                </button>
              )}
              <button
                className="closeBT"
                onClick={() => setShowMintModal(false)}
              >
                X
              </button>
            </div>
          </div>
        )}

        {/* Take Clip Modal */}
        {showTakeClipModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-md p-6 max-w-lg mx-auto relative">
              <h2 className="text-2xl font-semibold mb-4 text-center">Take Clip</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleSubmitClip(); }}>
                <div className="mb-4">
                  <label className="block text-left mb-1">Start Timestamp:</label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    placeholder="Enter start time (e.g., 00:01:30)"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-left mb-1">End Timestamp:</label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    placeholder="Enter end time (e.g., 00:02:00)"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-left mb-1">Event Type:</label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select an event type</option>
                    <option value="Stress">Stress</option>
                    <option value="Limb Missing">Limb Missing</option>
                    <option value="Reproduction">Reproduction</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {eventType === 'Other' && (
                  <div className="mb-4">
                    <label className="block text-left mb-1">Specify Event Type:</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      placeholder="Enter event type"
                      value={otherEventType}
                      onChange={(e) => setOtherEventType(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-left mb-1">Event Description (max 280 characters):</label>
                  <textarea
                    className="w-full border rounded-md p-2"
                    placeholder="Enter a brief description"
                    maxLength={280}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                  <div className="text-right text-sm text-gray-500">
                    {description.length}/280
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="bg-gray-300 text-black px-4 py-2 rounded-md"
                    onClick={() => setShowTakeClipModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Submit
                  </button>
                </div>
              </form>
              <button
                className="bg-black text-white h-8 w-8 rounded-full absolute -top-2 -right-2 flex items-center justify-center"
                onClick={() => setShowTakeClipModal(false)}
              >
                X
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;