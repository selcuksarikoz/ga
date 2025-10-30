"use client";

import { useState } from "react";
import { useModal } from "@/components/modal-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { createJustDeveloperAction } from "@/app/actions/developer.actions";
import { Label } from "@/app/components/ui/label";

export function AddDeveloperModal() {
  const { isOpen, closeModal } = useModal();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await createJustDeveloperAction(name);
    setIsSubmitting(false);
    closeModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Developer</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Developer Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting || !name}>
            {isSubmitting ? "Adding..." : "Add Developer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
