"use client";

import { useEffect, useReducer } from "react";
import { Button } from "@chakra-ui/react";
import Modal from "../Modal";
import emitter from "../../../utils/emitter";
import ReactDom from "react-dom";

interface IState {
  isOpen: boolean;
  message: string;
}

const Action = {
  OPEN: "openConfirm",
  CLOSE: "closeConfirm",
  CONFIRM: "onClickConfirm",
} as const;

type TAction = (typeof Action)[keyof typeof Action];

interface IAction {
  type: TAction;
  message: string;
}

const confirmReducer = (state: IState, action: IAction) => {
  if (action.type === Action.OPEN) {
    return {
      isOpen: true,
      message: action.message,
    };
  }
  if (action.type === Action.CLOSE) {
    return {
      isOpen: false,
      message: "",
    };
  }
  return state;
};

interface ConfirmModalParams {
  message: string;
  onClickConfirm: () => void;
}

export const confirmModal = {
  open: ({ message, onClickConfirm }: ConfirmModalParams) => {
    emitter.emit(Action.OPEN, { message, onClickConfirm });
  },
};

export default function ConfirmModal() {
  const [state, dispatch] = useReducer(confirmReducer, {
    isOpen: false,
    message: "",
  });

  const openConfirmModal = ({
    message,
    onClickConfirm,
  }: ConfirmModalParams) => {
    emitter.removeAllListeners(Action.CONFIRM);
    emitter.once(Action.CONFIRM, onClickConfirm);
    dispatch({ type: Action.OPEN, message });
  };
  const handleClickConfirm = () => {
    emitter.emit(Action.CONFIRM);
    emitter.removeAllListeners(Action.CONFIRM);
    dispatch({ type: Action.CLOSE, message: "" });
  };
  const handleClickCancel = () => {
    emitter.removeAllListeners(Action.CONFIRM);
    dispatch({ type: Action.CLOSE, message: "" });
  };

  useEffect(() => {
    emitter.on(Action.OPEN, openConfirmModal);
    emitter.on(Action.CLOSE, handleClickCancel);
    return () => {
      dispatch({ type: Action.CLOSE, message: "" });
      emitter.removeAllListeners(Action.OPEN);
      emitter.removeAllListeners(Action.CLOSE);
      emitter.removeAllListeners(Action.CONFIRM);
    };
  }, []);

  if (typeof window !== "undefined" && state.isOpen) {
    const el = document.getElementById("modal-root") as HTMLElement;
    return ReactDom.createPortal(
      <Modal.Container>
        <Modal.Header>Confirm</Modal.Header>
        <Modal.Content>{state.message}</Modal.Content>
        <Modal.Footer>
          <Button variant="ghost" onClick={handleClickConfirm}>
            확인
          </Button>
          <Button colorScheme="blue" mr={3} onClick={handleClickCancel}>
            취소
          </Button>
        </Modal.Footer>
      </Modal.Container>,
      el,
    );
  }

  return null;
}
