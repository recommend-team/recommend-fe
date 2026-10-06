import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import AssignRiderDialog from "@/components/organisms/AssignRiderDialog";
import AddRiderDialog from "@/components/organisms/AddRiderDialog";
import AdminTransactionsPage from "@/app/admin/(guarded)/transactions/page";
import type { AdminRider, AdminTransactionSummary } from "@/types";

// ─── Doubles ──────────────────────────────────────────────────────────────────

const assignMutate = jest.fn();
const createMutate = jest.fn();
const dispatchMutate = jest.fn();
let assignState: Record<string, unknown> = {};
let createState: Record<string, unknown> = {};
let riders: AdminRider[] = [];
let ridersQuery: Record<string, unknown> = {};
let transactions: AdminTransactionSummary[] = [];
let transactionFilters: Record<string, unknown> = {};

jest.mock("@/hooks", () => ({
  useRiders: (filters: Record<string, unknown>) => {
    ridersQuery = filters;
    return { data: { items: riders, total: riders.length }, isLoading: false, isError: false };
  },
  useAssignRider: () => ({ mutate: assignMutate, isPending: false, ...assignState }),
  useCreateRider: () => ({ mutate: createMutate, isPending: false, ...createState }),
  useAdminTransactions: (filters: Record<string, unknown>) => {
    transactionFilters = filters;
    return { data: { items: transactions, total: transactions.length }, isLoading: false, isError: false };
  },
  useVerifyTransaction: () => ({ mutate: jest.fn(), isPending: false }),
  useDispatchTransaction: () => ({ mutate: dispatchMutate, isPending: false, error: null }),
  useCompleteTransaction: () => ({ mutate: jest.fn(), isPending: false, error: null }),
  useOverrideTransactionStatus: () => ({ mutate: jest.fn(), isPending: false }),
  useTransactionHistory: () => ({ data: [], isLoading: false }),
}));

const rider = (over: Partial<AdminRider> = {}): AdminRider => ({
  id: "r1",
  firstName: "Musa",
  lastName: "Bello",
  email: null,
  phoneNumber: "+2348011111111",
  riderType: "INDIVIDUAL",
  riderNote: null,
  status: "APPROVED",
  createdAt: "2026-10-01T09:00:00Z",
  activeDeliveries: 0,
  completedDeliveries: 3,
  ...over,
});

const tx = (over: Partial<AdminTransactionSummary> = {}): AdminTransactionSummary => ({
  id: "ck1",
  reference: "REC-AAA",
  status: "READY",
  buyerName: "Ada Obi",
  buyerPhone: "+2348000000001",
  buyerEmail: null,
  fulfillmentType: "DELIVERY",
  deliveryAddress: "12 Admiralty Way",
  goodsTotal: 7000,
  deliveryFee: 1500,
  totalAmount: 8500,
  paidAt: "2026-10-06T09:00:00Z",
  createdAt: "2026-10-06T09:00:00Z",
  deliveryCode: null,
  rider: null,
  riderAssignedAt: null,
  vendors: [],
  ...over,
});

beforeEach(() => {
  jest.clearAllMocks();
  assignState = {};
  createState = {};
  riders = [];
  transactions = [];
});

// ─── The rider picker ─────────────────────────────────────────────────────────

describe("AssignRiderDialog", () => {
  it("offers approved riders only, with what each is already carrying", () => {
    riders = [
      rider(),
      rider({ id: "r2", firstName: "Tunde", phoneNumber: "+2348022222222", activeDeliveries: 2 }),
    ];
    render(<AssignRiderDialog transaction={tx()} onClose={jest.fn()} />);

    expect(ridersQuery.status).toBe("APPROVED");
    expect(screen.getByText("Free now")).toBeInTheDocument();
    expect(screen.getByText("2 in progress")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /\+2348011111111/ })).toHaveAttribute(
      "href",
      "tel:+2348011111111"
    );
  });

  it("assigns the rider picked, and closes", () => {
    riders = [rider()];
    const onClose = jest.fn();
    render(<AssignRiderDialog transaction={tx()} onClose={onClose} />);

    act(() => screen.getByRole("button", { name: "Assign" }).click());

    expect(assignMutate).toHaveBeenCalledWith(
      { reference: "REC-AAA", riderId: "r1" },
      expect.objectContaining({ onSuccess: onClose })
    );
  });

  it("marks the current rider when swapping, and says who it is", () => {
    riders = [rider(), rider({ id: "r2", firstName: "Tunde" })];
    render(
      <AssignRiderDialog
        transaction={tx({ rider: { id: "r1", name: "Musa Bello", phone: "+2348011111111" } })}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByRole("heading", { name: "Change rider" })).toBeInTheDocument();
    expect(screen.getByText(/Currently/)).toHaveTextContent("Musa Bello");
    expect(screen.getByText("Assigned")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Assign" })).toHaveLength(1);
  });

  it("shows why the server refused", () => {
    riders = [rider()];
    assignState = { isError: true, error: { message: "Musa Bello is not an approved rider" } };
    render(<AssignRiderDialog transaction={tx()} onClose={jest.fn()} />);

    expect(screen.getByText("Musa Bello is not an approved rider")).toBeInTheDocument();
  });

  it("points to adding a rider when there is nobody to pick", () => {
    render(<AssignRiderDialog transaction={tx()} onClose={jest.fn()} />);

    expect(screen.getByRole("link", { name: /Add a rider/ })).toHaveAttribute("href", "/admin/riders?add=1");
  });
});

// ─── Adding a rider ───────────────────────────────────────────────────────────

describe("AddRiderDialog", () => {
  const fill = (label: RegExp, value: string) =>
    fireEvent.change(screen.getByLabelText(label), { target: { value } });

  it("will not send without a name and phone", async () => {
    render(<AddRiderDialog onClose={jest.fn()} />);

    fireEvent.submit(screen.getByRole("button", { name: "Add rider" }).closest("form")!);

    expect(await screen.findAllByText("At least 2 letters")).toHaveLength(2);
    expect(createMutate).not.toHaveBeenCalled();
  });

  it("sends what was typed, leaving out an empty email and note", async () => {
    render(<AddRiderDialog onClose={jest.fn()} />);
    fill(/First name/, " Musa ");
    fill(/Last name/, "Bello");
    fill(/Phone number/, "0801 111 1111");
    act(() => screen.getByLabelText("Fleet / company").click());

    fireEvent.submit(screen.getByRole("button", { name: "Add rider" }).closest("form")!);

    await waitFor(() => expect(createMutate).toHaveBeenCalled());
    expect(createMutate.mock.calls[0][0]).toEqual({
      firstName: "Musa",
      lastName: "Bello",
      phoneNumber: "0801 111 1111",
      riderType: "COMPANY",
    });
  });

  it("shows the server's reason when it refuses", () => {
    createState = { isError: true, error: { message: "+2348011111111 already belongs to an account", fieldErrors: [] } };
    render(<AddRiderDialog onClose={jest.fn()} />);

    expect(screen.getByRole("alert")).toHaveTextContent("already belongs to an account");
  });
});

// ─── Transactions ─────────────────────────────────────────────────────────────

describe("Transactions — riders", () => {
  const row = (reference: string) => screen.getByText(reference).closest("tr")!;

  it("asks for a rider before a ready delivery can be dispatched", () => {
    transactions = [tx()];
    render(<AdminTransactionsPage />);

    const r = row("REC-AAA");
    expect(within(r).getByText("Needs a rider")).toBeInTheDocument();
    expect(within(r).getByRole("button", { name: /Assign rider/ })).toBeInTheDocument();
    expect(within(r).queryByRole("button", { name: /Dispatch/ })).not.toBeInTheDocument();
  });

  it("dispatches once there is a rider, who can still be changed", () => {
    transactions = [tx({ rider: { id: "r1", name: "Musa Bello", phone: "+2348011111111" } })];
    render(<AdminTransactionsPage />);

    const r = row("REC-AAA");
    expect(within(r).getByText("Musa Bello")).toBeInTheDocument();
    expect(within(r).getByRole("link", { name: /\+2348011111111/ })).toHaveAttribute("href", "tel:+2348011111111");
    act(() => within(r).getByRole("button", { name: /Dispatch/ }).click());
    expect(dispatchMutate).toHaveBeenCalledWith("REC-AAA");
    expect(within(r).getByRole("button", { name: "Change rider" })).toBeInTheDocument();
  });

  it("opens the picker from the row", () => {
    transactions = [tx()];
    riders = [rider()];
    render(<AdminTransactionsPage />);

    act(() => within(row("REC-AAA")).getByRole("button", { name: /Assign rider/ }).click());

    expect(screen.getByRole("dialog")).toHaveTextContent("Assign a rider");
  });

  it("never offers a rider for a pickup", () => {
    transactions = [tx({ fulfillmentType: "PICKUP" })];
    render(<AdminTransactionsPage />);

    const r = row("REC-AAA");
    expect(within(r).getByText("Pickup")).toBeInTheDocument();
    expect(within(r).queryByRole("button", { name: /rider/i })).not.toBeInTheDocument();
  });

  it("filters to deliveries that need a rider", () => {
    render(<AdminTransactionsPage />);

    act(() => screen.getByRole("button", { name: "Needs a rider" }).click());

    expect(transactionFilters).toMatchObject({ needsRider: true, status: undefined });
  });
});
