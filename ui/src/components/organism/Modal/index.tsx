"use client";

import React, { ReactNode, useEffect, useCallback, useReducer } from "react";
import ReactDom from "react-dom";
import emitter from "@ui/src/utils/emitter";

interface IState {
  isOpen: boolean;
}

const Action = {
  OPEN: "modal_open",
  CLOSE: "modal_close",
} as const;

type TAction = (typeof Action)[keyof typeof Action];

const modalReducer = (state: IState, action: TAction) => {
  if (action === Action.OPEN) {
    return {
      isOpen: true,
    };
  }
  if (action === Action.CLOSE) {
    return {
      isOpen: false,
    };
  }
  return state;
};

export const modal = {
  open: () => {
    emitter.emit(Action.OPEN);
  },
  close: () => {
    emitter.emit(Action.CLOSE);
  },
};

interface LayoutProps {
  children: ReactNode;
}

function Container({ children }: LayoutProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 w-[100%] h-[100%] z-50 bg-[rgba(0,0,0,0.4)]" />
      <div className="fixed bg-gray-800 left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%] p-5 rounded-sm z-50">
        <div>{children}</div>
      </div>
    </>
  );
}

interface HeaderProps {
  children: ReactNode;
}

function Header({ children }: HeaderProps) {
  return (
    <div className="pb-4">
      <span className="text-bold">{children}</span>
    </div>
  );
}

interface ContentProps {
  children: ReactNode;
}

function Content({ children }: ContentProps) {
  return <div className="p-4 pre-wrap">{children}</div>;
}

interface FooterProps {
  children: ReactNode;
}

function Footer({ children }: FooterProps) {
  return <div className="flex gap-4 justify-center mt-4">{children}</div>;
}

interface ModalProps {
  children: ReactNode;
}

function Portal({ children }: ModalProps) {
  const [state, dispatch] = useReducer(modalReducer, { isOpen: false });

  const openModal = useCallback(() => {
    dispatch(Action.OPEN);
  }, []);

  const closeModal = useCallback(() => {
    dispatch(Action.CLOSE);
  }, []);

  useEffect(() => {
    emitter.on(Action.OPEN, openModal);
    emitter.on(Action.CLOSE, closeModal);
    return () => {
      dispatch(Action.CLOSE);
      emitter.removeListener(Action.OPEN, openModal);
      emitter.removeListener(Action.CLOSE, closeModal);
    };
  }, []);

  if (typeof window !== "undefined" && state.isOpen) {
    const el = document.getElementById("modal-root") as HTMLElement;
    return ReactDom.createPortal(children, el);
  }

  return null;
}

export default Object.assign(Portal, {
  Container,
  Header,
  Content,
  Footer,
});
