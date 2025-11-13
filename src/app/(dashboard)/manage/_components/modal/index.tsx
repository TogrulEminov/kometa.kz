"use client";
import React from "react";
import { AnimatePresence } from "framer-motion";
import { MotionDiv } from "@/src/lib/motion/motion";

interface Props {
  modalKey: string; // A unique key for each modal (passed from parent)
  title: string;
  children: React.ReactNode;
  isModalOpen: boolean; // The state passed from the parent to control modal visibility
  handleCloseModal: (modalKey: string) => void; // Function to close the modal (passed from parent)
}

const overlayVariants = {
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      duration: 0.3,
      delayChildren: 0.4,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      when: "afterChildren",
      duration: 0.3,
      delay: 0.4,
    },
  },
};

export default function GlobalModal({
  children,
  modalKey,
  title,
  isModalOpen,
  handleCloseModal,
}: Props) {
  return (
    <AnimatePresence>
      {isModalOpen && (
        <MotionDiv
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          className={
            "fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center"
          }
          onClick={() => handleCloseModal(modalKey)} // Close on overlay click
        >
          <MotionDiv
            className={
              "max-w-[565px] rounded-lg border bg-[#f8f7f7] border-[#939293] relative w-fit mx-5 p-6  py-10"
            }
            initial={{ y: "100vh", scale: 0.8 }}
            animate={{ y: 0, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            exit={{ y: "100vh", scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className={"flex items-center justify-between mb-5"}>
              <h6
                className={
                  "text-blue-950 font-bold leading-1.5 text-lg lg:text-3xl"
                }
              >
                {title}
              </h6>
            </div>
            <div>{children}</div>
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}
