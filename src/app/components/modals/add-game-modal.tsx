"use client";

import { useState, useEffect } from "react";
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
import { createGameAction } from "@/app/actions/game.actions";
import { createDeveloperAction } from "@/app/actions/developer.actions";
import { Plus, X } from "lucide-react";

const gameSchema = z.object({
  title: z.string().min(1, "Title is required"),
  genre: z.nativeEnum(Genre),
  releaseYear: z.number(),
  developerId: z.string().min(1, "Developer is required"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  score: z.coerce
    .number()
    .min(0, "Score must be at least 0")
    .max(100, "Score must be 100 or less"),
  platforms: z.string().min(1, "Platforms are required"),
  description: z.string().min(1, "Description is required"),
});

export function AddGameModal() {
  const { isOpen, closeModal } = useModal();
  const [formData, setFormData] = useState({
    title: "",
    genre: Genre.ADVENTURE, // default genre is ADVENTURE in prisma schema
    releaseYear: new Date().getFullYear(),
    developerId: "",
    price: "",
    score: "",
    platforms: "",
    description: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAddingDeveloper, setIsAddingDeveloper] = useState(false);
  const [newDeveloperName, setNewDeveloperName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Validate all fields except developerId initially
    const partialSchema = gameSchema.omit({ developerId: true });
    const result = partialSchema.safeParse(formData);

    // Check developerId logic separately
    const isDeveloperValid = isAddingDeveloper
      ? !!newDeveloperName
      : !!formData.developerId;

    setIsFormValid(result.success && isDeveloperValid);
  }, [formData, isAddingDeveloper, newDeveloperName]);

  const { data: developers } = api.developers.list.useQuery();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      if (/^\d*\.?\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let developerId = formData.developerId;

    if (isAddingDeveloper && newDeveloperName) {
      const result = await createDeveloperAction(newDeveloperName);
      if (result.error || !result.data) {
        setErrors((prev) => ({ ...prev, newDeveloper: result.error }));
        setIsSubmitting(false);
        return;
      }
      developerId = result.data.id;
    }

    const result = gameSchema.safeParse({ ...formData, developerId });
    if (result.success) {
      setErrors({});
      await createGameAction(result.data);
      closeModal();
    } else {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0]] = err.message;
        }
      });
      setErrors(newErrors);
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
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
            {isAddingDeveloper ? (
              <div className="flex items-center gap-2">
                <Input
                  id="newDeveloperName"
                  name="newDeveloperName"
                  placeholder="New Developer Name"
                  value={newDeveloperName}
                  onChange={(e) => setNewDeveloperName(e.target.value)}
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsAddingDeveloper(false);
                    setNewDeveloperName("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsAddingDeveloper(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
            {errors.developerId && (
              <p className="text-sm text-red-500">{errors.developerId}</p>
            )}
            {errors.newDeveloper && (
              <p className="text-sm text-red-500">{errors.newDeveloper}</p>
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
                max={100}
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
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Add Game"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
