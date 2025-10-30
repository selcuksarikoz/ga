"use client";

import { useModal } from "@/components/modal-provider";
import { AddGameModal } from "./modals/add-game-modal";
import { AddDeveloperModal } from "./modals/add-developer-modal";

export function ModalRenderer() {
  const { type } = useModal();

  const _modal = {
    "add-game": <AddGameModal />,
    "add-developer": <AddDeveloperModal />,
  };

  const _type = type as keyof typeof _modal;

  if (!_modal[_type]) {
    return null;
  }

  return _modal[_type];
}
