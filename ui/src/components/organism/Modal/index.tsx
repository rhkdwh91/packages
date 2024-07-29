"use client";

import React, { ReactNode, useEffect, useCallback, useReducer } from "react";
import { Box, Text } from "@chakra-ui/react";
import ReactDom from "react-dom";
import emitter from "../../../utils/emitter";

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
      <Box
        position="fixed"
        top="0"
        left="0"
        width="100%"
        height="100%"
        zIndex={9998}
        backgroundColor="rgba(0,0,0,0.4)"
      />
      <Box
        position="fixed"
        backgroundColor="#fff"
        left="50%"
        top="50%"
        transform="translate(-50%, -50%)"
        padding={5}
        borderRadius={10}
        zIndex={9999}
      >
        <div>{children}</div>
      </Box>
    </>
  );
}

interface HeaderProps {
  children: ReactNode;
}

function Header({ children }: HeaderProps) {
  return (
    <Box paddingBottom={4}>
      <Text fontSize={20} fontWeight="bold">
        {children}
      </Text>
    </Box>
  );
}

interface ContentProps {
  children: ReactNode;
}

function Content({ children }: ContentProps) {
  return (
    <Box padding={3} whiteSpace="pre-wrap">
      {children}
    </Box>
  );
}

interface FooterProps {
  children: ReactNode;
}

function Footer({ children }: FooterProps) {
  return (
    <Box display="flex" gap="4" justifyContent="center" marginTop={4}>
      {children}
    </Box>
  );
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
