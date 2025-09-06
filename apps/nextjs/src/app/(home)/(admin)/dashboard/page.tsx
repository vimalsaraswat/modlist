import KPICard from "~/components/admin/kpi-card";
import { ListingsTable } from "~/components/admin/listings-table";
import { api } from "~/trpc/server";

// export default async function ProductsPage(

//   const { products, newOffset, totalProducts } = await getProducts(
//     search,
//     Number(offset)
//   );

//   return (
//     <Tabs defaultValue="all">
//       <div className="flex items-center">
//         <TabsList>
//           <TabsTrigger value="all">All</TabsTrigger>
//           <TabsTrigger value="active">Active</TabsTrigger>
//           <TabsTrigger value="draft">Draft</TabsTrigger>
//           <TabsTrigger value="archived" className="hidden sm:flex">
//             Archived
//           </TabsTrigger>
//         </TabsList>
//         <div className="ml-auto flex items-center gap-2">
//           <Button size="sm" variant="outline" className="h-8 gap-1">
//             <File className="h-3.5 w-3.5" />
//             <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
//               Export
//             </span>
//           </Button>
//           <Button size="sm" className="h-8 gap-1">
//             <PlusCircle className="h-3.5 w-3.5" />
//             <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
//               Add Product
//             </span>
//           </Button>
//         </div>
//       </div>
//       <TabsContent value="all">
//         <ProductsTable
//           products={products}
//           offset={newOffset ?? 0}
//           totalProducts={totalProducts}
//         />
//       </TabsContent>
//     </Tabs>
//   );
// }

export default async function AdminDashboardPage(props: {
  searchParams: Promise<{ q?: string; offset: string }>;
}) {
  const searchParams = await props.searchParams;
  // const search = searchParams.q ?? "";
  const offset = Number(searchParams.offset) || 0;
  const trpc = await api();

  const [stats, trends, pending] = await Promise.all([
    trpc.admin.stats(),
    trpc.admin.dailyStats({ days: 90 }),
    trpc.admin.pendingListings({ limit: 6, offset }),
  ]);

  const statsData = [
    {
      label: "Users",
      value: stats.totalUsers,
      hint: "Total registered users",
    },
    {
      label: "Listings",
      value: stats.totalListings,
      hint: "All listings",
    },
    {
      label: "Pending",
      value: stats.pendingListings,
      hint: "Awaiting review",
    },
    {
      label: "Reviews",
      value: stats.totalReviews,
      hint: "Total reviews",
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview & moderation queue for Modlist
          </p>
        </div>
        {/*<div className="flex gap-3">
          <Link href="/admin/listings" className="inline-flex">
            <Button variant="ghost">Manage Listings</Button>
          </Link>
          <Link href="/admin/users" className="inline-flex">
            <Button variant="outline">Manage Users</Button>
          </Link>
          <Link href="/admin/settings" className="inline-flex">
            <Button>Settings</Button>
          </Link>
        </div>*/}
      </header>

      {/* KPI Row */}
      <section
        aria-labelledby="kpis"
        className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {statsData.map((kpi, i) => (
          <KPICard
            key={i}
            label={kpi.label}
            value={kpi.value}
            hint={kpi.hint}
          />
        ))}
      </section>

      {/* Trend Chart */}
      {/*<section aria-labelledby="activity-trend" className="mb-6">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle id="activity-trend">Activity (last 90 days)</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {trends.length === 0 ? (
              <Skeleton className="h-full w-full rounded-lg" />
            ) : (
              <TrendChart data={trends} />
            )}
          </CardContent>
        </Card>
      </section>*/}

      {/* Moderation queue + activity */}
      <section
        aria-labelledby="moderation-activity"
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <div className="col-span-full">
          <ListingsTable
            offset={offset + pending.items.length}
            totalItems={stats.pendingListings}
            listings={pending.items}
          />
          {/* Pending Listings */}
          {/*<Card>
            <CardHeader>
              <CardTitle>Pending Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-40 w-full" />}>
                <PendingListingsPanel initialPending={pending.items} />
              </Suspense>
            </CardContent>
          </Card>*/}
        </div>

        {/* Recent Activity */}
        {/*<div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-40 w-full" />}>
                <RecentActivity limit={8} />
              </Suspense>
            </CardContent>
          </Card>
        </div>*/}
      </section>
    </main>
  );
}
