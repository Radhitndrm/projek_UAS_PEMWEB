import { Box, ShoppingBag, ReceiptText, Coins } from "lucide-react";
import AppLayout from "@/Layouts/app-layout";
import { Head, usePage } from "@inertiajs/react";
import { Header } from "@/components/header";
import { Widget } from "@/components/widget";
import {
    CardHeader,
    Card,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import { PageProps } from "@/types";
import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    LabelList,
    Pie,
    PieChart,
} from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";

interface DashboardProps extends PageProps {
    totalPurchaseThisMonth: number;
    totalSalesThisMonth: number;
    stockMovements: {
        month: string;
        in_stock: number;
        out_stock: number;
    }[];
    totalRevenueThisMonth: number;
    bestSellingProduct: {
        product: string;
        quantity: number;
        fill: string;
    }[];
}

export default function Dashboard() {
    const {
        totalRevenueThisMonth,
        stockMovements,
        totalPurchaseThisMonth,
        totalSalesThisMonth,
        bestSellingProduct,
    } = usePage<DashboardProps>().props;

    const chartConfig = {
        in_stock: {
            label: "In",
            color: "hsl(var(--chart-1))",
        },
        out_stock: {
            label: "Out",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig;

    const chartData = stockMovements.map((item) => ({
        month: item.month,
        in_stock: item.in_stock,
        out_stock: item.out_stock,
    }));

    const bestSellingChartConfig: ChartConfig = {
        bestSellingProducts: {
            label: "Best Selling Products",
            color: "hsl(var(--chart-1))",
        },
    };

    const bestSellingProductcolors = [
        "hsl(var(--chart-1))",
        "hsl(var(--chart-2))",
        "hsl(var(--chart-3))",
        "hsl(var(--chart-4))",
        "hsl(var(--chart-5))",
    ];

    const chartDataBestSellingProduct = bestSellingProduct.map(
        (item, index) => ({
            product: item.product,
            total: item.quantity,
            fill: bestSellingProductcolors[
                index % bestSellingProductcolors.length
            ],
        })
    );

    return (
        <>
            <Head title="Dashboard" />
            <div className="w-full">
                <Header
                    title="Dashboard"
                    subtitle="Halaman ini digunakan untuk melihat statistik keseluruhan data"
                />
                <div className="p-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Widget title="Total Pendapatan" icon={<Coins />}>
                            <sup>Rp</sup> {totalRevenueThisMonth}
                        </Widget>
                        <Widget title="Total Penjualan" icon={<ReceiptText />}>
                            <sup>Rp</sup> {totalSalesThisMonth}
                        </Widget>
                        <Widget title="Total Pembelian" icon={<ShoppingBag />}>
                            <sup>Rp</sup> {totalPurchaseThisMonth}
                        </Widget>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12 py-8">
                        <div className="col-span-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Statistik Stok Produk</CardTitle>
                                    <CardDescription>
                                        Statistik ini digunakan untuk melihat
                                        pergerakan stok produk dalam 6 bulan
                                        terakhir
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer
                                        config={chartConfig}
                                        className="min-h-full lg:min-h-[200px] w-full"
                                    >
                                        <BarChart data={chartData}>
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="month"
                                                tickLine={false}
                                                tickMargin={10}
                                                axisLine={false}
                                                tickFormatter={(value) =>
                                                    value.slice(0, 3)
                                                }
                                            />
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent />
                                                }
                                            />
                                            <Bar
                                                dataKey="in_stock"
                                                fill={
                                                    chartConfig.in_stock.color
                                                }
                                                radius={4}
                                            >
                                                <LabelList
                                                    position="top"
                                                    offset={12}
                                                    className="fill-foreground"
                                                    fontSize={12}
                                                />
                                            </Bar>
                                            <Bar
                                                dataKey="out_stock"
                                                fill={
                                                    chartConfig.out_stock.color
                                                }
                                                radius={4}
                                            >
                                                <LabelList
                                                    position="top"
                                                    offset={12}
                                                    className="fill-foreground"
                                                    fontSize={12}
                                                />
                                            </Bar>
                                        </BarChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="col-span-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Statistik Produk Paling Laris
                                    </CardTitle>
                                    <CardDescription>
                                        Statistik ini digunakan untuk melihat 5
                                        data produk paling laris
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer
                                        config={bestSellingChartConfig}
                                        className="min-h-full lg:min-h-[200px] w-full"
                                    >
                                        <PieChart>
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent
                                                        hideLabel
                                                    />
                                                }
                                            />
                                            <Pie
                                                data={
                                                    chartDataBestSellingProduct
                                                }
                                                dataKey="total"
                                                labelLine={false}
                                                nameKey="product"
                                                label={({
                                                    payload,
                                                    ...props
                                                }) => {
                                                    return (
                                                        <text
                                                            cx={props.cx}
                                                            cy={props.cy}
                                                            x={props.x}
                                                            y={props.y}
                                                            textAnchor={
                                                                props.textAnchor
                                                            }
                                                            dominantBaseline={
                                                                props.dominantBaseline
                                                            }
                                                            fill="hsla(var(--foreground)"
                                                        >
                                                            {payload.total}
                                                        </text>
                                                    );
                                                }}
                                            />
                                        </PieChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AppLayout children={page} />;
