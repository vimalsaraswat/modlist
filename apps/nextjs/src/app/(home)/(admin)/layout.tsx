import React from "react";
import { notFound } from "next/navigation";

import { getSession } from "~/auth/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-screen-2xl px-4 py-6">
        {/*<div className="grid grid-cols-12 gap-6">*/}
        {/*<aside className="col-span-12 md:col-span-3">
            <AdminSidebar user={session.user} />
          </aside>*/}
        <main className="col-span-12 md:col-span-9">{children}</main>
      </div>
      {/*</div>*/}
    </div>
  );
}
