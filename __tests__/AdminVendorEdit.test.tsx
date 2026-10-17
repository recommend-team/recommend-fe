import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import EditStoreDialog, { toInternational } from "@/components/organisms/vendor-admin/EditStoreDialog";
import EditOwnerDialog from "@/components/organisms/vendor-admin/EditOwnerDialog";
import EditAreasDialog from "@/components/organisms/vendor-admin/EditAreasDialog";
import EditHoursDialog from "@/components/organisms/vendor-admin/EditHoursDialog";
import ProductDialog from "@/components/organisms/vendor-admin/ProductDialog";
import VendorProductsTab from "@/components/organisms/vendor-admin/VendorProductsTab";
import CreateVendorDialog from "@/components/organisms/vendor-admin/CreateVendorDialog";
import KycUploadButton from "@/components/organisms/vendor-admin/KycUploadButton";
import VendorHistoryTab from "@/components/organisms/vendor-admin/VendorHistoryTab";
import type { AdminVendorDetail, Product } from "@/types";

// ─── Doubles ──────────────────────────────────────────────────────────────────

const updateVendor = jest.fn();
const addProduct = jest.fn();
const editProduct = jest.fn();
const removeProduct = jest.fn();
const createVendor = jest.fn();
const attachKyc = jest.fn();
let history: unknown[] = [];
let products: Product[] = [];

const mutation = (fn: jest.Mock) => ({
  mutate: fn,
  mutateAsync: (...args: unknown[]) => Promise.resolve(fn(...args)),
  isPending: false,
  isError: false,
  error: null,
});

jest.mock("@/hooks", () => ({
  useUpdateVendor: () => mutation(updateVendor),
  useAddVendorProduct: () => mutation(addProduct),
  useUpdateVendorProduct: () => mutation(editProduct),
  useRemoveVendorProduct: () => mutation(removeProduct),
  useCreateVendor: () => mutation(createVendor),
  useUpdateVendorKyc: () => mutation(attachKyc),
  useVendorHistory: () => ({ data: history, isLoading: false, isError: false }),
  useVendorProducts: () => ({
    data: { items: products, total: products.length, page: 1, limit: 100 },
    isLoading: false,
    isError: false,
  }),
  useAllAreas: () => ({
    data: [
      {
        state: { id: "s1", name: "Lagos" },
        areas: [
          { id: "a1", name: "Egbeda", stateId: "s1" },
          { id: "a2", name: "Yaba", stateId: "s1" },
          { id: "a3", name: "Ikeja", stateId: "s1" },
        ],
      },
    ],
    isLoading: false,
    isError: false,
  }),
}));

const confirmAnswer = { value: true };
jest.mock("@/components/organisms/DialogProvider", () => ({
  useConfirm: () => () => Promise.resolve(confirmAnswer.value),
}));

jest.mock("@/services", () => ({
  uploadFile: jest.fn(() =>
    Promise.resolve({ url: "x", secureUrl: "https://res.cloudinary.com/demo/new.jpg" })
  ),
}));

const vendor = (
  over: Partial<AdminVendorDetail["vendor"]> = {}
): AdminVendorDetail["vendor"] =>
  ({
    id: "v1",
    firstName: "Ada",
    lastName: "Obi",
    email: "ada@kitchen.ng",
    phoneNumber: "+2348011111111",
    businessName: "Ada's Kitchen",
    businessCategory: "Food",
    businessAddress: "12 Herbert Macaulay Way",
    businessDescription: "Home cooking",
    whatsappNumber: null,
    businessLogoUrl: null,
    businessBannerUrl: null,
    vendorType: "NON_REGISTERED",
    orderQuota: 20,
    operatingHours: null,
    isOpen: true,
    status: "APPROVED",
    ...over,
  }) as unknown as AdminVendorDetail["vendor"];

const product = (over: Partial<Product> = {}): Product => ({
  id: "p1",
  name: "Jollof Rice",
  description: null,
  price: 3000,
  imageUrl: null,
  isAvailable: true,
  isAddOn: false,
  ...over,
});

beforeEach(() => {
  jest.clearAllMocks();
  products = [];
  history = [];
  confirmAnswer.value = true;
});

const submit = (name: RegExp | string) =>
  act(async () => {
    fireEvent.click(screen.getByRole("button", { name }));
  });

// ─── Store ────────────────────────────────────────────────────────────────────

describe("Edit store", () => {
  it("sends only what changed — the vendor is told about each field", async () => {
    render(<EditStoreDialog vendor={vendor()} onClose={jest.fn()} />);

    fireEvent.change(screen.getByLabelText("Description Optional"), {
      target: { value: "Amala every day" },
    });
    fireEvent.change(screen.getByLabelText("WhatsApp Optional"), {
      target: { value: "0803 555 1234" },
    });
    await submit("Save");

    expect(updateVendor).toHaveBeenCalledWith(
      { businessDescription: "Amala every day", whatsappNumber: "+2348035551234" },
      expect.anything()
    );
  });

  it("says so when nothing changed, instead of saving", async () => {
    render(<EditStoreDialog vendor={vendor()} onClose={jest.fn()} />);
    await submit("Save");

    expect(updateVendor).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("Nothing has changed.");
  });

  it("uploads a new logo and saves its address", async () => {
    const { container } = render(<EditStoreDialog vendor={vendor()} onClose={jest.fn()} />);
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    await act(async () => {
      fireEvent.change(fileInput, {
        target: { files: [new File(["x"], "logo.png", { type: "image/png" })] },
      });
    });
    await submit("Save");

    expect(updateVendor).toHaveBeenCalledWith(
      { businessLogoUrl: "https://res.cloudinary.com/demo/new.jpg" },
      expect.anything()
    );
  });

  it("writes Nigerian numbers the way the server wants them", () => {
    expect(toInternational("0801 234 5678")).toBe("+2348012345678");
    expect(toInternational("2348012345678")).toBe("+2348012345678");
    expect(toInternational("+234 801-234-5678")).toBe("+2348012345678");
  });
});

// ─── Owner ────────────────────────────────────────────────────────────────────

describe("Edit owner", () => {
  it("changes the name and lifts the order limit", async () => {
    render(<EditOwnerDialog vendor={vendor()} onClose={jest.fn()} />);

    fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Adaeze" } });
    fireEvent.change(screen.getByLabelText(/Monthly order limit/), { target: { value: "" } });
    await submit("Save");

    expect(updateVendor).toHaveBeenCalledWith(
      { firstName: "Adaeze", orderQuota: null },
      expect.anything()
    );
  });

  it("can mark the business registered", async () => {
    render(<EditOwnerDialog vendor={vendor()} onClose={jest.fn()} />);
    fireEvent.click(screen.getByLabelText("Registered (CAC)"));
    await submit("Save");

    expect(updateVendor).toHaveBeenCalledWith(
      { vendorType: "REGISTERED" },
      expect.anything()
    );
  });
});

// ─── Areas and hours ──────────────────────────────────────────────────────────

describe("Edit areas", () => {
  it("adds and removes areas, sending the whole new list", async () => {
    render(
      <EditAreasDialog
        vendor={vendor()}
        current={[{ id: "a1", name: "Egbeda", stateName: "Lagos" }]}
        onClose={jest.fn()}
      />
    );
    fireEvent.click(screen.getByLabelText("Egbeda"));
    fireEvent.click(screen.getByLabelText("Yaba"));
    await submit("Save");

    expect(updateVendor).toHaveBeenCalledWith({ areaIds: ["a2"] }, expect.anything());
  });

  it("filters by name", () => {
    render(<EditAreasDialog vendor={vendor()} current={[]} onClose={jest.fn()} />);
    fireEvent.change(screen.getByLabelText("Search areas"), { target: { value: "yab" } });

    expect(screen.getByLabelText("Yaba")).toBeInTheDocument();
    expect(screen.queryByLabelText("Ikeja")).not.toBeInTheDocument();
  });
});

describe("Opening hours", () => {
  it("saves the week, and refuses a day that closes before it opens", async () => {
    render(<EditHoursDialog vendor={vendor()} onClose={jest.fn()} />);

    fireEvent.click(screen.getByLabelText("Sunday"));
    fireEvent.change(screen.getByLabelText("Monday closes"), { target: { value: "07:00" } });
    await submit("Save");
    expect(updateVendor).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(/Monday: closing must be after opening/);

    fireEvent.change(screen.getByLabelText("Monday closes"), { target: { value: "21:00" } });
    await submit("Save");
    const [[{ operatingHours }]] = updateVendor.mock.calls as [
      { operatingHours: Record<string, { isOpen: boolean; close: string }> },
    ][];
    expect(operatingHours.monday).toMatchObject({ isOpen: true, close: "21:00" });
    expect(operatingHours.sunday.isOpen).toBe(false);
  });
});

// ─── Products ─────────────────────────────────────────────────────────────────

describe("Products", () => {
  it("adds a product with the vendor's own fields", async () => {
    render(<ProductDialog vendorId="v1" onClose={jest.fn()} />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Amala and Ewedu" } });
    fireEvent.change(screen.getByLabelText("Price (₦)"), { target: { value: "2500" } });
    fireEvent.click(screen.getByLabelText(/Extra/));
    await submit("Add product");

    expect(addProduct).toHaveBeenCalledWith(
      { name: "Amala and Ewedu", price: 2500, isAvailable: true, isAddOn: true },
      expect.anything()
    );
  });

  it("refuses a price that isn't one", async () => {
    render(<ProductDialog vendorId="v1" onClose={jest.fn()} />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Amala" } });
    fireEvent.change(screen.getByLabelText("Price (₦)"), { target: { value: "abc" } });
    await submit("Add product");

    expect(addProduct).not.toHaveBeenCalled();
    expect(await screen.findByText(/A price above zero/)).toBeInTheDocument();
  });

  it("edits only what changed", async () => {
    render(<ProductDialog vendorId="v1" product={product()} onClose={jest.fn()} />);
    fireEvent.change(screen.getByLabelText("Price (₦)"), { target: { value: "3200" } });
    await submit("Save");

    expect(editProduct).toHaveBeenCalledWith(
      { productId: "p1", payload: { price: 3200 } },
      expect.anything()
    );
  });

  it("lists them, switches availability, and removes after asking", async () => {
    products = [product(), product({ id: "p2", name: "Gbegiri", isAvailable: false })];
    render(<VendorProductsTab vendorId="v1" />);

    expect(screen.getByText("Products (2 of 20)")).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByLabelText("Gbegiri available"));
    });
    expect(editProduct).toHaveBeenCalledWith({
      productId: "p2",
      payload: { isAvailable: true },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Remove Jollof Rice" }));
    });
    await waitFor(() => expect(removeProduct).toHaveBeenCalledWith("p1"));
  });

  it("keeps a product when the admin changes their mind", async () => {
    products = [product()];
    confirmAnswer.value = false;
    render(<VendorProductsTab vendorId="v1" />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Remove Jollof Rice" }));
    });
    expect(removeProduct).not.toHaveBeenCalled();
  });

  it("stops adding at the vendor's limit of 20", () => {
    products = Array.from({ length: 20 }, (_, i) => product({ id: `p${i}`, name: `Dish ${i}` }));
    render(<VendorProductsTab vendorId="v1" />);

    const add = within(screen.getByRole("banner")).getByRole("button", { name: /Add product/ });
    expect(add).toBeDisabled();
  });
});

// ─── Stage 3: set up, documents, history ─────────────────────────────────────

describe("Set up a vendor", () => {
  it("sends the owner, the business and the chosen areas", async () => {
    render(<CreateVendorDialog onClose={jest.fn()} onCreated={jest.fn()} />);

    fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Musa" } });
    fireEvent.change(screen.getByLabelText("Last name"), { target: { value: "Bello" } });
    fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: "Musa@Suya.ng " } });
    fireEvent.change(screen.getByLabelText(/^Phone number/), { target: { value: "0802 222 2222" } });
    fireEvent.change(screen.getByLabelText("Business name"), { target: { value: "Musa Suya" } });
    fireEvent.change(screen.getByLabelText("What they sell"), { target: { value: "Food" } });
    fireEvent.change(screen.getByLabelText("Address"), { target: { value: "3 Allen Avenue, Ikeja" } });
    fireEvent.click(screen.getByLabelText("Yaba"));
    await submit("Set up vendor");

    expect(createVendor).toHaveBeenCalledWith(
      {
        firstName: "Musa",
        lastName: "Bello",
        email: "musa@suya.ng",
        phoneNumber: "0802 222 2222",
        vendorType: "NON_REGISTERED",
        businessName: "Musa Suya",
        businessCategory: "Food",
        businessAddress: "3 Allen Avenue, Ikeja",
        areaIds: ["a2"],
      },
      expect.anything()
    );
  });

  it("asks for what is missing before sending", async () => {
    render(<CreateVendorDialog onClose={jest.fn()} onCreated={jest.fn()} />);
    await submit("Set up vendor");

    expect(createVendor).not.toHaveBeenCalled();
    expect(await screen.findByText("Enter a valid email")).toBeInTheDocument();
    expect(screen.getByText("Enter the full address")).toBeInTheDocument();
  });
});

describe("KYC upload", () => {
  it("uploads the file and attaches it as that document", async () => {
    const { container } = render(
      <KycUploadButton vendorId="v1" documentKey="ninDocumentUrl" label="NIN document" replacing={false} />
    );
    expect(screen.getByRole("button", { name: "Upload NIN document" })).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(container.querySelector('input[type="file"]')!, {
        target: { files: [new File(["%PDF"], "nin.pdf", { type: "application/pdf" })] },
      });
    });

    expect(attachKyc).toHaveBeenCalledWith({
      ninDocumentUrl: "https://res.cloudinary.com/demo/new.jpg",
    });
  });

  it("refuses something that isn't a photo or PDF", async () => {
    const { container } = render(
      <KycUploadButton vendorId="v1" documentKey="ninDocumentUrl" label="NIN document" replacing />
    );
    await act(async () => {
      fireEvent.change(container.querySelector('input[type="file"]')!, {
        target: { files: [new File(["x"], "nin.docx", { type: "application/msword" })] },
      });
    });
    expect(attachKyc).not.toHaveBeenCalled();
    expect(screen.getByText("A photo or a PDF.")).toBeInTheDocument();
  });
});

describe("History", () => {
  it("lists what admins changed, and who", () => {
    history = [
      {
        id: "h1",
        action: "PRODUCT_UPDATED",
        summary: "Changed price on Jollof",
        createdAt: "2026-10-17T10:00:00Z",
        admin: { id: "a1", name: "Recommend Admin" },
      },
    ];
    render(<VendorHistoryTab vendorId="v1" />);

    expect(screen.getByText("Changed price on Jollof")).toBeInTheDocument();
    expect(screen.getByText("by Recommend Admin")).toBeInTheDocument();
  });

  it("says when there is nothing yet", () => {
    render(<VendorHistoryTab vendorId="v1" />);
    expect(screen.getByText(/No admin has changed anything/)).toBeInTheDocument();
  });
});
