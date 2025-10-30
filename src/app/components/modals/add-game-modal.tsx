"use client";

import { useState } from "react";
import { useModal } from "@/components/modal-provider";
import { api } from "@/trpc/react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Genre } from "@prisma/client";

const gameSchema = z.object({
  title: z.string().min(1, "Title is required"),
  genre: z.nativeEnum(Genre),
  releaseYear: z.number(),
  developerId: z.string().min(1, "Developer is required"),
  price: z.number().min(0, "Price cannot be negative"),
  score: z
    .number()
    .min(0, "Score must be at least 0")
    .max(100, "Score must be 100 or less"),
  platforms: z.string().min(1, "Platforms are required"),
  description: z.string().min(1, "Description is required"),
});

export function AddGameModal() {
  const { isOpen, type, closeModal } = useModal();
  const [formData, setFormData] = useState({
    title: "",
    genre: Genre.ACTION,
    releaseYear: new Date().getFullYear(),
    developerId: "",
    price: undefined,
    score: undefined,
    platforms: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isModalOpen = isOpen && type === "add-game";

  const { data: developers } = api.developers.list.useQuery();
  const utils = api.useUtils();
  const createGame = api.game.create.useMutation({
    onSuccess: () => {
      utils.game.list.invalidate();
      closeModal();
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const result = gameSchema.safeParse(formData);
    if (result.success) {
      setErrors({});
      createGame.mutate({
        ...result.data,
        releaseDate: new Date(result.data.releaseYear, 0, 1),
      });
    } else {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0]] = err.message;
        }
      });
      setErrors(newErrors);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Game</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Title"
              onChange={handleChange}
              value={formData.title}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          <div>
            <Label htmlFor="genre">Genre</Label>
            <Select
              name="genre"
              onValueChange={(value) => handleSelectChange("genre", value)}
              value={formData.genre}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Genre).map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.genre && (
              <p className="text-sm text-red-500">{errors.genre}</p>
            )}
          </div>
          <div>
            <Label htmlFor="releaseYear">Release Year</Label>
            <Select
              name="releaseYear"
              onValueChange={(value) =>
                handleSelectChange("releaseYear", Number(value))
              }
              value={formData.releaseYear.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {Array.from(
                  { length: 10 },
                  (_, i) => new Date().getFullYear() - i,
                ).map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.releaseYear && (
              <p className="text-sm text-red-500">{errors.releaseYear}</p>
            )}
          </div>
          <div>
            <Label htmlFor="developerId">Developer</Label>
            <Select
              name="developerId"
              onValueChange={(value) =>
                handleSelectChange("developerId", value)
              }
              value={formData.developerId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select developer" />
              </SelectTrigger>
              <SelectContent>
                {developers?.map((dev) => (
                  <SelectItem key={dev.id} value={dev.id}>
                    {dev.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.developerId && (
              <p className="text-sm text-red-500">{errors.developerId}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="Price"
                onChange={handleChange}
                value={formData.price}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price}</p>
              )}
            </div>
            <div>
              <Label htmlFor="score">Score</Label>
              <Input
                id="score"
                name="score"
                type="number"
                placeholder="Score"
                onChange={handleChange}
                value={formData.score}
              />
              {errors.score && (
                <p className="text-sm text-red-500">{errors.score}</p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="platforms">Platforms</Label>
            <Input
              id="platforms"
              name="platforms"
              placeholder="Platforms (comma-separated)"
              onChange={handleChange}
              value={formData.platforms}
            />
            {errors.platforms && (
              <p className="text-sm text-red-500">{errors.platforms}</p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="Description"
              onChange={handleChange}
              value={formData.description}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>
          <Button onClick={handleSubmit} disabled={createGame.isPending}>
            {createGame.isPending ? "Adding..." : "Add Game"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
