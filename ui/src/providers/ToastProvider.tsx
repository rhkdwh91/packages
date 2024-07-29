"use client";

import { ToastContainer } from "kyz-toast";
import AlertModal from "../components/organism/AlertModal";
import ConfirmModal from "../components/organism/ConfirmModal";

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <AlertModal />
      <ConfirmModal />
      <ToastContainer delay={3000} zIndex={999} />
    </>
  );
}
