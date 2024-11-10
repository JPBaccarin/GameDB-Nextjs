"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StarIcon } from "lucide-react";
import Metacritic from "./../../public/metacritic.svg";
import {
  ERSB_everyone,
  ERSB_everyone_10,
  ERSB_mature,
  ERSB_pending,
  ERSB_teen,
  ERSB_adults_only,
} from "@/components/esrb/images_esrb";
import Image from "next/image";
import GamePlatforms from "@/components/platforms/plataforms";

// Define types for the game data
interface Game {
  id: number;
  name: string;
  background_image: string;
  released: string;
  rating: number;
  genres: { name: string }[];
  platforms: { platform: { name: string } }[];
  playtime: number;
  stores: { store: { name: string } }[];
  metacritic: number;
  esrb_rating: { name: string };
  tags: {
    language: string;
    name: string;
  }[];
  short_screenshots: { image: string }[];
  description_raw?: string;
}

const getESRBImage = (rating: string) => {
  switch (rating) {
    case "Everyone":
      return ERSB_everyone.src;
    case "Everyone 10+":
      return ERSB_everyone_10.src;
    case "Mature":
      return ERSB_mature.src;
    case "Rating Pending":
      return ERSB_pending.src;
    case "Teen":
      return ERSB_teen.src;
    case "Adults Only 18+":
      return ERSB_adults_only.src;
    default:
      return null;
  }
};

export default function GameSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const searchGame = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setGame(null);

    try {
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}&search=${encodeURIComponent(
          searchQuery
        )}&page_size=1`
      );
      const data = await response.json();
      console.log(data);
      if (data.results && data.results.length > 0) {
        setGame(data.results[0]);
      } else {
        setError("Nenhum jogo encontrado com esse nome.");
      }
    } catch (err) {
      setError("Ocorreu um erro ao buscar os dados do jogo.");
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {game && game.short_screenshots && (
        <div className="absolute inset-0 z-0">
          <Image src={game.background_image || ""} alt="" layout="fill" priority objectFit="cover" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 h-full bg-transparent bg-gradient-to-t from-background to-background/40 via-background backdrop-blur-md"></div>
        </div>
      )}
      <div className="relative z-10 container mx-auto p-4 ">
        <h1 className="text-4xl font-bold mb-8  pt-8">Pesquisar Jogo:</h1>
        <div className="flex gap-2 mb-8">
          <Input
            type="text"
            placeholder="Digite o nome do jogo"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow bg-card/75 focus:bg-card/80 focus:outline-none  backdrop-blur-xl border-border  focus:border-emerald-500 focus:ring-emerald-500 block w-full rounded-md sm:text-sm focus:ring-1"
          />
          <Button onClick={searchGame} className="bg-primary hover:bg-primary/80">
            Pesquisar
          </Button>
        </div>

        {loading && (
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-[250px] bg-foreground/20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full mb-2 bg-foreground/20" />
              <Skeleton className="h-4 w-[200px] mb-2 bg-foreground/20" />
              <Skeleton className="h-4 w-[150px] bg-foreground/20" />
            </CardContent>
          </Card>
        )}

        {error && <p className="text-red-500 text-center">{error}</p>}

        {game && (
          <Card className=" bg-card/70 border-border/50 bg-gradient-to-b from-transparent to-card">
            <CardHeader>
              <CardTitle className="text-4xl mb-2">{game.name || "Nome não disponível"}</CardTitle>
              <CardDescription className="">Lançamento: {game.released || "Data não disponível"}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Image
                  priority
                  width={1280}
                  height={720}
                  src={game.background_image || game.short_screenshots[0]?.image || ""}
                  alt={game.name || "Imagem não disponível"}
                  className="w-full h-64 object-cover rounded-md shadow-lg mb-4"
                />
                <div className="flex flex-row justify-between pr-8">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {game.genres.map((genre) => (
                        <Badge key={genre.name} variant="secondary" className=" h-fit  ">
                          {genre.name}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-row gap-2">
                      <p
                        className={`mb-2 flex items-center px-3 h-fit w-fit rounded-full ${
                          game.rating <= 2 ? "bg-red-500" : game.rating <= 4 ? "bg-yellow-500" : "bg-green-500"
                        }`}
                      >
                        <StarIcon height={16} className="mr-2" /> {game.rating}
                      </p>
                      <p
                        className={`mb-2 flex items-center px-4 h-fit w-fit rounded-full ${
                          game.metacritic <= 33
                            ? "bg-red-500"
                            : game.metacritic <= 66
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      >
                        <Image src={Metacritic} height={16} alt="Metacritic" className="mr-2" />{" "}
                        <span className="text-foreground">{game.metacritic}</span>
                      </p>
                    </div>
                  </div>
                  <p className="mb-2">
                    {game.esrb_rating ? (
                      <Image
                        height={42}
                        width={42}
                        src={getESRBImage(game.esrb_rating?.name || "")}
                        alt={game.esrb_rating?.name || "Sem classificação ESRB"}
                      />
                    ) : (
                      "Sem classificação ESRB"
                    )}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Plataformas</h3>
                <GamePlatforms platforms={game.platforms} />
                <h3 className="text-xl font-semibold mb-2">Disponível Em</h3>
                <ul className="list-disc list-inside mb-4">
                  {game.stores.map((s) => (
                    <li key={s.store.name}>{s.store.name}</li>
                  ))}
                </ul>
                <h3 className="text-xl font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {game.tags
                    .filter((tag) => tag.language !== "rus")
                    .slice(0, 10) 
                    .map((tag) => (
                      <Badge key={tag.name} variant="outline" className="hover:bg-accent/50 border-white/50">
                        {tag.name}
                      </Badge>
                    ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="grid grid-cols-4 gap-2 w-full">
                {game.short_screenshots.map((screenshot) => (
                  <Image
                    width={720}
                    height={480}
                    key={screenshot.image}
                    src={screenshot.image}
                    alt="Screenshot"
                    className="w-full h-32 object-cover rounded-md"
                    priority
                  />
                ))}
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
