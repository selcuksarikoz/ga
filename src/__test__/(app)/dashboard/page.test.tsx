import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import DashboardPage from "../../../app/(app)/dashboard/page";

// Mock the tRPC caller
const mockGameList = vi.fn();
const mockDeveloperList = vi.fn();
vi.mock("@/trpc/server", () => ({
  caller: {
    game: {
      list: mockGameList,
    },
    developers: {
      list: mockDeveloperList,
    },
  },
}));

// Mock client components
vi.mock("@/app/components/filters-client", () => ({
  __esModule: true,
  default: vi.fn(() => <div>FiltersClient</div>),
}));
vi.mock("@/app/components/games-table-client", () => ({
  __esModule: true,
  default: vi.fn(() => <div>GamesTableClient</div>),
}));
vi.mock("@/app/components/action-buttons", () => ({
  __esModule: true,
  ActionButtons: vi.fn(() => <div>ActionButtons</div>),
}));

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch data with correct parameters and render child components", async () => {
    const searchParams = {
      page: "2",
      limit: "10",
      sortBy: "releaseYear",
      sortOrder: "desc",
      developerId: "dev-123",
      search: "test game",
    };

    const games = [{ id: "1", title: "Test Game" }];
    const pagination = { total: 1, page: 2, limit: 10 };
    const developers = [{ id: "dev-123", name: "Test Developer" }];

    mockGameList.mockResolvedValue({ games, pagination });
    mockDeveloperList.mockResolvedValue(developers);

    // @ts-expect-error Server Component
    render(await DashboardPage({ searchParams }));

    // Check if child components are rendered
    expect(screen.getByText("Game Dashboard")).toBeInTheDocument();
    expect(screen.getByText("FiltersClient")).toBeInTheDocument();
    expect(screen.getByText("GamesTableClient")).toBeInTheDocument();
    expect(screen.getByText("ActionButtons")).toBeInTheDocument();

    // Check if tRPC calls were made with correct parameters
    expect(mockDeveloperList).toHaveBeenCalled();
    expect(mockGameList).toHaveBeenCalledWith({
      page: 2,
      limit: 10,
      sortBy: "releaseYear",
      sortOrder: "desc",
      developerId: "dev-123",
      search: "test game",
      releaseYear: undefined,
      priceMin: undefined,
      priceMax: undefined,
      genre: undefined,
      yearMin: undefined,
      yearMax: undefined,
      scoreMin: undefined,
      scoreMax: undefined,
    });

    // Check props passed to GamesTableClient
    const gamesTableClient = vi.mocked(
      (await import("@/app/components/games-table-client")).default,
    );
    expect(gamesTableClient).toHaveBeenCalledWith(
      {
        games,
        pagination,
        sortBy: "releaseYear",
        sortOrder: "desc",
      },
      {},
    );

    // Check props passed to FiltersClient
    const filtersClient = vi.mocked(
      (await import("@/app/components/filters-client")).default,
    );
    const { Genre } = await import("@prisma/client");
    expect(filtersClient).toHaveBeenCalledWith(
      {
        genres: Object.values(Genre),
        developers,
      },
      {},
    );
  });
});
