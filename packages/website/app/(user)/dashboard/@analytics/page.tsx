"use client";

import React, { useMemo } from "react";
import { useExtensionData } from "@/app/hooks/useExtensionData";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card } from "@/components/ui/card";
import {
  TrendingUp,
  Calendar,
  Clock,
  Folder,
  Tag,
  Activity,
} from "lucide-react";

// Vibrant color palette for charts
const COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#84cc16", // Lime
  "#6366f1", // Indigo
];

const CHART_COLORS = {
  primary: "#3b82f6",
  secondary: "#10b981",
  accent: "#f59e0b",
  purple: "#8b5cf6",
  pink: "#ec4899",
  cyan: "#06b6d4",
};

const AnalyticsPage = () => {
  const { memories, isLoading } = useExtensionData();

  // Calculate statistics
  const stats = useMemo(() => {
    if (!memories.length) return null;

    // Memory types distribution
    const typeDistribution = memories.reduce((acc, memory) => {
      const type = memory.type || "general";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Category distribution
    const categoryDistribution = memories.reduce((acc, memory) => {
      const category = memory.category || "uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Activity over time (last 30 days)
    const activityByDate = memories.reduce((acc, memory) => {
      const dateKey = new Date(memory.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Tags frequency
    const tagFrequency = memories.reduce((acc, memory) => {
      memory.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    // Time-based activity (hour of day)
    const activityByHour = memories.reduce((acc, memory) => {
      const hour = new Date(memory.date).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // Calculate weekly activity
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisWeek = memories.filter((m) => new Date(m.date) >= weekAgo).length;

    // Most active day
    const activityByDayOfWeek = memories.reduce((acc, memory) => {
      const day = new Date(memory.date).toLocaleDateString("en-US", {
        weekday: "long",
      });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostActiveDay = Object.entries(activityByDayOfWeek).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0];

    return {
      total: memories.length,
      thisWeek,
      mostActiveDay,
      avgPerDay: (memories.length / 30).toFixed(1),
      typeDistribution: Object.entries(typeDistribution).map(
        ([name, value]) => ({ name, value })
      ),
      categoryDistribution: Object.entries(categoryDistribution)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10),
      activityByDate: Object.entries(activityByDate)
        .map(([date, count]) => ({ date, count }))
        .slice(-30),
      topTags: Object.entries(tagFrequency)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15),
      activityByHour: Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        count: activityByHour[i] || 0,
      })),
      bookmarked: memories.filter((m) => m.bookmarked).length,
      favorited: memories.filter((m) => m.favorited).length,
    };
  }, [memories]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Activity className="size-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground">
            No Data Available
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Start capturing memories to see analytics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Insights and statistics about your memory collection
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Memories</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Folder className="size-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold mt-1">{stats.thisWeek}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="size-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Most Active</p>
              <p className="text-lg font-bold mt-1">{stats.mostActiveDay}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Calendar className="size-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg per Day</p>
              <p className="text-2xl font-bold mt-1">{stats.avgPerDay}</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Clock className="size-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Memory Types Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Memory Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.typeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={90}
                innerRadius={50}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {stats.typeDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.categoryDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="value"
                fill={CHART_COLORS.primary}
                radius={[8, 8, 0, 0]}
              >
                {stats.categoryDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Activity Over Time */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">
            Activity Over Time (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.activityByDate}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={CHART_COLORS.secondary}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={CHART_COLORS.secondary}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke={CHART_COLORS.secondary}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Activity by Hour */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Activity by Hour</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.activityByHour}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="hour" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke={CHART_COLORS.accent}
                strokeWidth={3}
                dot={{ fill: CHART_COLORS.accent, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Tags */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Tag className="size-5" />
            Top Tags
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.topTags} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" />
              <YAxis dataKey="tag" type="category" width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="count"
                fill={CHART_COLORS.purple}
                radius={[0, 8, 8, 0]}
              >
                {stats.topTags.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Additional Stats */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Collection Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats.bookmarked}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Bookmarked</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
              {stats.favorited}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Favorited</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.topTags.length}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Unique Tags</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats.categoryDistribution.length}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Categories</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
