import React, { Fragment } from 'react';
import { motion } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import useAvatars from '@/hooks/useAvatars';
import Image from 'next/image';

const blockVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const Champion = ({
  winner,
  right,
  image,
}: {
  winner?: boolean;
  right?: boolean;
  image: string;
}) => {
  return (
    <motion.div
      animate={{
        y: winner ? 0 : 200,
        opacity: winner ? 1 : 0,
        x: winner ? (right ? 125 : -125) : right ? 50 : -50,
      }}
      transition={{
        delay: 1,
      }}
    >
      <motion.div
        className="relative w-32 h-32"
        initial={{ x: 0 }}
        animate={{ x: right ? 50 : -50 }}
      >
        <motion.div
          animate={{
            rotate: winner ? [0, -5, 5, 0] : 0,
            transition: {
              duration: 0.5,
              repeat: Infinity,
              delay: 1,
            },
          }}
          className="absolute w-32 h-32 rounded-full bg-gradient-to-b from-gray-700 via-gray-500 to-gray-700"
        >
          <Image
            src={image || ''}
            alt="champion"
            fill
            className="object-contain"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const BumpModal = ({
  battleDetails,
  open,
  onClose,
}: {
  battleDetails: {
    token1Id: number;
    token2Id: number;
    winnerId: number;
  };
  open: boolean;
  onClose: () => void;
}) => {
  const { avatars } = useAvatars();

  const champion1 = avatars.find(
    (avatar) => avatar.id === battleDetails.token1Id
  );
  const champion2 = avatars.find(
    (avatar) => avatar.id === battleDetails.token2Id
  );

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10 overflow-hidden"
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="text-center text-2xl pb-4 font-bold">
                  Battle Result!
                </div>
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={blockVariants}
                >
                  <div className="flex justify-between items-center">
                    <Champion
                      winner={battleDetails.winnerId === champion1?.id}
                      right
                      image={champion1?.image!}
                    />
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{
                        delay: 1,
                      }}
                    >
                      VS
                    </motion.div>
                    <Champion
                      winner={battleDetails.winnerId === champion2?.id}
                      image={champion2?.image!}
                    />
                  </div>
                </motion.div>
                <button className="btn mx-auto mt-6 w-full" onClick={onClose}>
                  Close
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default BumpModal;
