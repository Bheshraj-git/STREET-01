import { AddressList } from "@/components/account/address-list";
import { requireUser } from "@/lib/auth/session";
import { getUserAddresses } from "@/lib/queries/account";

export const metadata = { title: "Addresses" };

export default async function AddressesPage() {
    const user = await requireUser();
    const addresses = await getUserAddresses(user.id);

    return (
        <div>
            <div className="mb-8">
                <p className="text-eyebrow text-muted-foreground">Saved</p>
                <h2 className="text-display mt-2 text-3xl">Your addresses</h2>
            </div>

            <AddressList addresses={addresses} />
        </div>
    );
}