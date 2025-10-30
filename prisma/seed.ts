import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const developers = [
  "Rockstar Games",
  "CD Projekt Red",
  "Valve",
  "Bethesda",
  "Ubisoft",
  "Electronic Arts",
  "Activision",
  "Nintendo",
  "Sony Interactive",
  "FromSoftware",
  "Square Enix",
  "Capcom",
  "Bungie",
  "Epic Games",
  "Blizzard",
  "Riot Games",
  "Mojang",
  "Remedy Entertainment",
  "Supergiant Games",
  "Team Cherry",
  "ConcernedApe",
  "Re-Logic",
  "Larian Studios",
  "Respawn Entertainment",
  "Naughty Dog",
  "Insomniac Games",
  "Santa Monica Studio",
  "Guerrilla Games",
  "Sucker Punch",
  "Kojima Productions",
  "Platinum Games",
  "Atlus",
  "Bandai Namco",
  "Sega",
  "Konami",
  "Arc System Works",
  "SNK",
  "Devolver Digital",
  "Annapurna Interactive",
  "Team17",
  "Paradox Interactive",
  "Creative Assembly",
  "Firaxis Games",
  "BioWare",
  "Obsidian",
  "InXile Entertainment",
  "Double Fine",
  "Klei Entertainment",
  "Subset Games",
  "Motion Twin",
];

const genres = [
  "ACTION",
  "ADVENTURE",
  "RPG",
  "STRATEGY",
  "SIMULATION",
  "SPORTS",
  "RACING",
  "PUZZLE",
  "FIGHTING",
  "PLATFORMER",
  "SHOOTER",
  "HORROR",
  "MMORPG",
  "BATTLE_ROYALE",
  "ROGUELIKE",
  "INDIE",
  "SURVIVAL",
  "OPEN_WORLD",
];

const platforms = [
  "PC",
  "PlayStation 5",
  "PlayStation 4",
  "Xbox Series X/S",
  "Xbox One",
  "Nintendo Switch",
  "Mobile",
  "VR",
];

const gameTitlePrefixes = [
  "The",
  "Legend of",
  "Tales of",
  "Chronicles of",
  "Quest for",
  "Shadow of",
  "Rise of",
  "Fall of",
  "Return to",
  "Escape from",
  "Journey to",
  "Battle for",
  "War of",
  "Age of",
  "Dawn of",
  "Dusk of",
  "Realm of",
  "Kingdom of",
];

const gameTitleWords = [
  "Dragon",
  "Phoenix",
  "Warrior",
  "Mystic",
  "Thunder",
  "Storm",
  "Crystal",
  "Shadow",
  "Light",
  "Dark",
  "Fire",
  "Ice",
  "Steel",
  "Iron",
  "Gold",
  "Silver",
  "Crimson",
  "Azure",
  "Emerald",
  "Obsidian",
  "Titan",
  "Guardian",
  "Sentinel",
  "Champion",
  "Destiny",
  "Eternity",
  "Infinity",
  "Legacy",
  "Origins",
  "Uprising",
  "Revolution",
  "Awakening",
  "Prophecy",
  "Nexus",
  "Paradox",
  "Chaos",
  "Order",
  "Haven",
  "Sanctuary",
  "Fortress",
  "Citadel",
  "Empire",
  "Dynasty",
];

const gameTitleSuffixes = [
  "Reborn",
  "Remastered",
  "HD",
  "Definitive Edition",
  "Ultimate",
  "Deluxe",
  "Gold Edition",
  "Complete",
  "Enhanced",
  "Redux",
  "Remake",
  "Returns",
];

function generateGameTitle(): string {
  const rand = Math.random();

  if (rand < 0.3) {
    // Prefix + Word
    const prefix =
      gameTitlePrefixes[Math.floor(Math.random() * gameTitlePrefixes.length)];
    const word =
      gameTitleWords[Math.floor(Math.random() * gameTitleWords.length)];
    return `${prefix} ${word}`;
  } else if (rand < 0.6) {
    // Word + Word
    const word1 =
      gameTitleWords[Math.floor(Math.random() * gameTitleWords.length)];
    const word2 =
      gameTitleWords[Math.floor(Math.random() * gameTitleWords.length)];
    return `${word1} ${word2}`;
  } else if (rand < 0.85) {
    // Word only
    return gameTitleWords[
      Math.floor(Math.random() * gameTitleWords.length)
    ] as string;
  } else {
    // Word + Suffix
    const word =
      gameTitleWords[Math.floor(Math.random() * gameTitleWords.length)];
    const suffix =
      gameTitleSuffixes[Math.floor(Math.random() * gameTitleSuffixes.length)];
    return `${word} ${suffix}`;
  }
}

function getRandomPlatforms(): string {
  const numPlatforms = Math.floor(Math.random() * 4) + 1; // 1-4 platforms
  const selectedPlatforms: string[] = [];
  const shuffled = [...platforms].sort(() => Math.random() - 0.5);

  for (let i = 0; i < numPlatforms; i++) {
    selectedPlatforms.push(shuffled[i]!);
  }

  return selectedPlatforms.join(",");
}

function generatePrice(): number {
  const pricePoints = [
    0, 4.99, 9.99, 14.99, 19.99, 29.99, 39.99, 49.99, 59.99, 69.99,
  ];
  return pricePoints[Math.floor(Math.random() * pricePoints.length)] as any;
}

function generateScore(): number {
  // Normal distribution around 70-80
  const mean = 75;
  const stdDev = 12;
  let score =
    mean + (Math.random() + Math.random() + Math.random() - 1.5) * stdDev;
  score = Math.max(30, Math.min(100, score)); // Clamp between 30 and 100
  return Math.round(score * 10) / 10; // Round to 1 decimal
}

async function main() {
  console.log("Clearing existing data...");
  await prisma.game.deleteMany();
  await prisma.developer.deleteMany();

  console.log("Creating developers...");
  for (const devName of developers) {
    await prisma.developer.create({
      data: { name: devName },
    });
  }

  const allDevelopers = await prisma.developer.findMany();
  console.log(`Created ${allDevelopers.length} developers`);

  console.log("Creating 1000+ games...");
  const gamesToCreate = 1200; // Creating 1200 games
  const games = [];

  for (let i = 0; i < gamesToCreate; i++) {
    const title = `${generateGameTitle()} ${i > 500 ? (Math.random() > 0.7 ? ` ${Math.floor(Math.random() * 5) + 1}` : "") : ""}`;
    const developer =
      allDevelopers[Math.floor(Math.random() * allDevelopers.length)];
    const genre = genres[Math.floor(Math.random() * genres.length)];
    const releaseYear = 2010 + Math.floor(Math.random() * 15); // 2010-2024
    const price = generatePrice();
    const score = generateScore();
    const platformsStr = getRandomPlatforms();

    games.push({
      title,
      developerId: developer.id,
      genre,
      releaseYear,
      price,
      score,
      platforms: platformsStr,
      description: `An exciting ${genre.toLowerCase()} game developed by ${developer.name}. Released in ${releaseYear}.`,
    });

    if (games.length >= 100) {
      await prisma.game.createMany({ data: games });
      console.log(`Created ${i + 1} games...`);
      games.length = 0;
    }
  }

  if (games.length > 0) {
    await prisma.game.createMany({ data: games });
  }

  const totalGames = await prisma.game.count();
  console.log(`✓ Seed completed! Created ${totalGames} games`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
