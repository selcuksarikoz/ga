"use client";

import { useModal } from "@/components/modal-provider";
import { Button } from "@/app/components/ui/button";

export function ActionButtons() {
  const { openModal } = useModal();

  return (
    <div className="flex gap-4">
      <Button onClick={() => openModal("add-game")}>Add Game</Button>
      <Button onClick={() => openModal("add-developer")}>Add Developer</Button>
    </div>
  );
}
