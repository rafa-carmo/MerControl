import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState, type ReactNode } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: dashboard().url }];
const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const currency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
type Amount = { label: string; value: number };
type Props = {
    filters: { month: number; year: number };
    years: number[];
    summary: { expenses: number; revenues: number; balance: number; dailyAverage: number };
    daily: (Amount & { date: string })[];
    weekly: Amount[];
    monthly: { month: number; expenses: number; revenues: number }[];
    byExpenseType: Amount[];
    byPaymentMethod: Amount[];
};
const tooltipStyle = { backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--card-foreground)' };

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
    return (
        <section className="min-w-0 rounded-2xl border border-border bg-card p-5 text-card-foreground">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mb-6 text-sm text-muted-foreground">{subtitle}</p>
            {children}
        </section>
    );
}

function AmountChart({ data, daily = false }: { data: Amount[]; daily?: boolean }) {
    const axes = (
        <>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'currentColor' }} tickLine={false} />
            <YAxis width={75} tick={{ fontSize: 11, fill: 'currentColor' }} tickFormatter={(value: number) => currency(value)} />
            <Tooltip formatter={(value) => currency(Number(value))} contentStyle={tooltipStyle} />
        </>
    );
    return (
        <div className="h-72 w-full" role="img" aria-label={`Despesas: ${data.map((item) => `${item.label}: ${currency(item.value)}`).join('; ')}`}>
            <ResponsiveContainer width="100%" height="100%">
                {daily ? (
                    <AreaChart data={data}>
                        {axes}
                        <Area dataKey="value" name="Despesas" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} />
                    </AreaChart>
                ) : (
                    <BarChart data={data}>
                        {axes}
                        <Bar dataKey="value" name="Despesas" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                )}
            </ResponsiveContainer>
        </div>
    );
}

function Breakdown({ data, total }: { data: Amount[]; total: number }) {
    if (!data.length) return <p className="py-10 text-center text-muted-foreground">Nenhuma despesa neste mês.</p>;
    const maximum = Math.max(...data.map((item) => Math.abs(item.value)), 1);
    return (
        <ul className="max-h-80 space-y-5 overflow-y-auto">
            {data.map((item, index) => (
                <li key={`${item.label}-${index}`}>
                    <div className="mb-2 flex items-start justify-between gap-4 text-sm">
                        <span className="break-words">{item.label}</span>
                        <span className="shrink-0 text-right font-medium">
                            {currency(item.value)}{' '}
                            <span className="text-xs text-muted-foreground">({total ? ((item.value / total) * 100).toFixed(1) : '0'}%)</span>
                        </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${(Math.abs(item.value) / maximum) * 100}%` }} />
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default function Dashboard({ filters, years, summary, daily, weekly, monthly, byExpenseType, byPaymentMethod }: Props) {
    const [loading, setLoading] = useState(false);
    const period = `${months[filters.month - 1]} de ${filters.year}`;
    const changeFilter = (key: 'month' | 'year', value: string) =>
        router.get(
            dashboard().url,
            { ...filters, [key]: Number(value) },
            {
                preserveScroll: true,
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
            },
        );
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard financeiro" />
            <div className="space-y-6 p-4 md:p-8" aria-busy={loading}>
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Dashboard financeiro</h1>
                        <p className="text-muted-foreground">Acompanhe suas receitas e despesas em {period.toLowerCase()}.</p>
                    </div>
                    <div className="flex gap-3">
                        <label className="space-y-1 text-sm">
                            <span className="block">Mês</span>
                            <select
                                className="rounded-lg border border-input bg-background px-3 py-2"
                                value={filters.month}
                                disabled={loading}
                                onChange={(event) => changeFilter('month', event.target.value)}
                            >
                                {months.map((name, index) => (
                                    <option key={name} value={index + 1}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="space-y-1 text-sm">
                            <span className="block">Ano</span>
                            <select
                                className="rounded-lg border border-input bg-background px-3 py-2"
                                value={filters.year}
                                disabled={loading}
                                onChange={(event) => changeFilter('year', event.target.value)}
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">
                    Despesas à vista pela data da compra. No cartão, cada parcela entra na data de referência da fatura cadastrada. Receitas pelo mês
                    do lançamento. Semanas de segunda a domingo, limitadas ao mês selecionado.
                </p>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                        { label: 'Despesas do mês', value: summary.expenses, color: 'text-rose-600 dark:text-rose-400' },
                        { label: 'Receitas do mês', value: summary.revenues, color: 'text-emerald-600 dark:text-emerald-400' },
                        {
                            label: 'Saldo do mês',
                            value: summary.balance,
                            color: summary.balance < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400',
                        },
                        { label: 'Média diária de despesas', value: summary.dailyAverage, color: 'text-indigo-600 dark:text-indigo-400' },
                    ].map((metric) => (
                        <div key={metric.label} className="rounded-2xl border border-border bg-card p-5">
                            <p className="text-sm text-muted-foreground">{metric.label}</p>
                            <p className={`mt-3 text-2xl font-semibold ${metric.color}`}>{currency(metric.value)}</p>
                        </div>
                    ))}
                </div>
                <div className="grid gap-6 xl:grid-cols-2">
                    <Panel title="Despesas por dia" subtitle={period}>
                        <AmountChart data={daily} daily />
                    </Panel>
                    <Panel title="Despesas semanais" subtitle={period}>
                        <AmountChart data={weekly} />
                    </Panel>
                    <Panel title="Despesas mensais" subtitle={`Janeiro a dezembro de ${filters.year}`}>
                        <AmountChart data={monthly.map((item) => ({ label: months[item.month - 1].slice(0, 3), value: item.expenses }))} />
                    </Panel>
                    <Panel title="Receita × despesa por mês" subtitle={`Janeiro a dezembro de ${filters.year}`}>
                        <div className="h-72 w-full" role="img" aria-label={`Comparação mensal de receitas e despesas de ${filters.year}`}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthly.map((item) => ({ ...item, label: months[item.month - 1].slice(0, 3) }))}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'currentColor' }} />
                                    <YAxis
                                        width={75}
                                        tick={{ fontSize: 11, fill: 'currentColor' }}
                                        tickFormatter={(value: number) => currency(value)}
                                    />
                                    <Tooltip formatter={(value) => currency(Number(value))} contentStyle={tooltipStyle} />
                                    <Legend />
                                    <Bar dataKey="revenues" name="Receitas" fill="#10b981" radius={[3, 3, 0, 0]} />
                                    <Bar dataKey="expenses" name="Despesas" fill="#f43f5e" radius={[3, 3, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Panel>
                    <Panel title="Gastos por tipo de despesa" subtitle={period}>
                        <Breakdown data={byExpenseType} total={summary.expenses} />
                    </Panel>
                    <Panel title="Gastos por tipo de pagamento" subtitle={period}>
                        <Breakdown data={byPaymentMethod} total={summary.expenses} />
                    </Panel>
                </div>
            </div>
        </AppLayout>
    );
}
