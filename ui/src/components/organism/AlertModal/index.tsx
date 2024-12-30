"use client";

import { useEffect, useReducer } from "react";
import { Button } from "@ui/src/components/atom/Button";
import Modal from "../Modal";
import emitter from "@ui/src/utils/emitter";
import ReactDom from "react-dom";

interface IState {
  isOpen: boolean;
  message: string;
}

const Action = {
  OPEN: "openAlert",
  CLOSE: "closeAlert",
} as const;

type TAction = (typeof Action)[keyof typeof Action];

interface IAction {
  type: TAction;
  message: string;
}

const alertReducer = (state: IState, action: IAction) => {
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
}

export const alertModal = {
  open: ({ message }: ConfirmModalParams) => {
    emitter.emit(Action.OPEN, { message });
  },
};

export default function AlertModal() {
  const [state, dispatch] = useReducer(alertReducer, {
    isOpen: false,
    message: "",
  });

  const openConfirmModal = ({ message }: ConfirmModalParams) => {
    dispatch({ type: Action.OPEN, message });
  };
  const handleClickButton = () => {
    dispatch({ type: Action.CLOSE, message: "" });
  };

  useEffect(() => {
    emitter.on(Action.OPEN, openConfirmModal);
    emitter.on(Action.CLOSE, handleClickButton);
    return () => {
      dispatch({ type: Action.CLOSE, message: "" });
      emitter.removeAllListeners(Action.OPEN);
      emitter.removeAllListeners(Action.CLOSE);
    };
  }, []);

  if (typeof window !== "undefined" && state.isOpen) {
    const el = document.getElementById("modal-root") as HTMLElement;
    return ReactDom.createPortal(
      <Modal.Container>
        <Modal.Header>Alert</Modal.Header>
        <Modal.Content>{state.message}</Modal.Content>
        <Modal.Footer>
          <Button className="mr-4" onClick={handleClickButton}>
            확인
          </Button>
        </Modal.Footer>
      </Modal.Container>,
      el,
    );
  }

  return null;
}
