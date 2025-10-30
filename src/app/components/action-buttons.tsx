"use client";

import { useState } from "react";
import { useModal } from "@/components/modal-provider";
import { Button } from "@/app/components/ui/button";
import { signOut } from "next-auth/react";

export function ActionButtons() {
  const { openModal } = useModal();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex gap-4">
      <Button onClick={() => openModal("add-game")}>Add Game</Button>
      <Button onClick={() => openModal("add-developer")}>Add Developer</Button>
      <Button onClick={handleSignOut} disabled={isSigningOut}>
        {isSigningOut ? "Signing out..." : "Sign Out"}
      </Button>
    </div>
  );
}
