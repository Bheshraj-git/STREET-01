import { ProfileForm } from "@/components/account/profile-form";
import { PasswordForm } from "@/components/account/password-form";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
    const user = await requireUser();

    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { name: true, email: true, phone: true },
    });

    if (!dbUser) return null;

    return (
        <div className="flex flex-col gap-10">
            <div>
                <p className="text-eyebrow text-muted-foreground">Profile</p>
                <h2 className="text-display mt-2 text-3xl">Your details</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Signed in as <span className="text-foreground">{dbUser.email}</span>
                </p>
            </div>

            <section>
                <h3 className="text-eyebrow mb-4">Basic information</h3>
                <ProfileForm
                    defaultValues={{
                        name: dbUser.name ?? "",
                        phone: dbUser.phone ?? "",
                    }}
                />
            </section>

            <section>
                <h3 className="text-eyebrow mb-4">Security</h3>
                <PasswordForm />
            </section>
        </div>
    );
}