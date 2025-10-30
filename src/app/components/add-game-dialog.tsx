"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Slider } from "@/app/components/ui/slider";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Plus } from "lucide-react";

interface AddGameDialogProps {
  genres: string[];
  developers: string[];
  platforms: string[];
  onGameAdded: () => void;
}

export function AddGameDialog({
  genres,
  developers,
  platforms,
  onGameAdded,
}: AddGameDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    developer: "",
    genre: "",
    releaseYear: new Date().getFullYear(),
    price: 29.99,
    score: 75,
    platforms: [] as string[],
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          platforms: formData.platforms.join(","),
        }),
      });

      if (response.ok) {
        setOpen(false);
        setFormData({
          title: "",
          developer: "",
          genre: "",
          releaseYear: new Date().getFullYear(),
          price: 29.99,
          score: 75,
          platforms: [],
          description: "",
        });
        onGameAdded();
      }
    } catch (error) {
      console.error("Error adding game:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlatform = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Game
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Game</DialogTitle>
          <DialogDescription>
            Add a new game to the database. Fill in all the required
            information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Game Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="developer">Developer *</Label>
              <Select
                value={formData.developer}
                onValueChange={(v) =>
                  setFormData({ ...formData, developer: v })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select developer" />
                </SelectTrigger>
                <SelectContent>
                  {developers.map((dev) => (
                    <SelectItem key={dev} value={dev}>
                      {dev}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="genre">Genre *</Label>
              <Select
                value={formData.genre}
                onValueChange={(v) => setFormData({ ...formData, genre: v })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="releaseYear">
                Release Year: {formData.releaseYear}
              </Label>
              <Slider
                value={[formData.releaseYear]}
                onValueChange={([v]) =>
                  setFormData({ ...formData, releaseYear: v })
                }
                min={2010}
                max={2024}
                step={1}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Price: ${formData.price.toFixed(2)}</Label>
              <Slider
                value={[formData.price]}
                onValueChange={([v]) => setFormData({ ...formData, price: v })}
                min={0}
                max={70}
                step={5}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="score">Score: {formData.score}/100</Label>
              <Slider
                value={[formData.score]}
                onValueChange={([v]) => setFormData({ ...formData, score: v })}
                min={0}
                max={100}
                step={5}
              />
            </div>

            <div className="grid gap-2">
              <Label>Platforms *</Label>
              <div className="grid grid-cols-2 gap-2">
                {platforms.map((platform) => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform}
                      checked={formData.platforms.includes(platform)}
                      onCheckedChange={() => togglePlatform(platform)}
                    />
                    <label
                      htmlFor={platform}
                      className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {platform}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Game"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
