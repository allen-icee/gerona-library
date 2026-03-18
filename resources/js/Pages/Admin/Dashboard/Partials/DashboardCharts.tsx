// resources/js/Pages/Admin/Dashboard/Partials/DashboardCharts.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Icon } from "@iconify/react";

interface ChartProps {
    charts: {
        visitors: { name: string; visitors: number }[];
        circulation: { name: string; borrowed: number; returned: number }[];
    };
}

export default function DashboardCharts({ charts }: ChartProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

            {/* Visitors Area Chart */}
            <Card className="shadow-sm border-rose-100 rounded-2xl">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
                        <Icon icon="solar:graph-up-bold-duotone" className="w-5 h-5 text-emerald-500" />
                        Weekly Visitor Traffic
                    </CardTitle>
                    <CardDescription>Walk-in patron logs over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent className="h-75 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={charts.visitors} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Area type="monotone" dataKey="visitors" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Circulation Bar Chart */}
            <Card className="shadow-sm border-rose-100 rounded-2xl">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
                        <Icon icon="solar:book-bookmark-bold-duotone" className="w-5 h-5 text-blue-500" />
                        Circulation Activity
                    </CardTitle>
                    <CardDescription>Books borrowed vs returned (Last 7 Days)</CardDescription>
                </CardHeader>
                <CardContent className="h-75 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={charts.circulation} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{ fill: '#f8fafc' }}
                            />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                            <Bar dataKey="borrowed" name="Borrowed" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            <Bar dataKey="returned" name="Returned" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

        </div>
    );
}