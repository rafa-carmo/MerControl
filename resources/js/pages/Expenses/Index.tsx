import { trans } from "@/composables/translate";
import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { DataTable } from "../../components/Table/data-table";
import { columns } from "./table/columns";
import financialFlows from "@/routes/financial-flows";
import { Button } from "@/components/ui/button";
import expensesRoutes from "@/routes/expenses";


import financialLaunchesRoutes from '@/routes/financial-launches';
import { dashboard } from "@/routes";



const breadcrumbs = (financial_launch_id: number, financial_flow_id: number) => [
    { title: "Dashboard", href: dashboard.url() },
    { title: "Financial Flows", href: financialFlows.index().url },
    { title: "Financial Launches", href: financialLaunchesRoutes.index({ financial_flow: financial_flow_id }).url },
    { title: "Expenses", href: expensesRoutes.index({ financial_flow: financial_flow_id, financial_launch: financial_launch_id }).url },
];

const filters = [
    {
        name: 'description',
        label: 'Descrição',
        placeholder: 'Filtrar por descrição',
        className: 'w-full',
    },
];


export default function ExpensesIndex({ expenses, financial_launch_id, financial_flow_id, paymentMethods, expenseTypes }: { expenses?: Paginated<Expense>, financial_launch_id: number, financial_flow_id: number, paymentMethods: PaymentMethod[], expenseTypes: ExpenseType[] }) {

    const createHref = expensesRoutes.create({ financial_flow: financial_flow_id, financial_launch: financial_launch_id }).url;
    console.log(expenses);
    return (
        <AppLayout breadcrumbs={breadcrumbs(financial_launch_id!, financial_flow_id!)}>
            <Head title={trans("expenses")} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl px-1 md:p-4">
                <aside className="flex items-center justify-end">
                    <Link href={createHref} className="flex justify-center">
                        <Button className="justify-center">
                            Criar Saída
                        </Button>
                    </Link>
                </aside>
                <h1>{trans("Expenses")}</h1>

                <DataTable columns={columns}
                    data={expenses?.data.map((ex) => ({
                        ...ex,
                        paymentMethod: ex.payment_method.name,
                        expenseType: ex.expense_type.name,
                        financial_flow_id: financial_flow_id
                    })) ?? []}
                    paginated={expenses}
                    filters={[
                        ...filters,
                        {
                            name: 'payment_method_id',
                            label: 'Método de Pagamento',
                            placeholder: 'Filtrar por método de pagamento',
                            type: 'select',
                            options: paymentMethods.map((method) => ({
                                label: method.name,
                                value: method.id.toString(),
                            })),
                        },
                        {
                            name: 'expense_type_id',
                            label: 'Tipo de Saída',
                            placeholder: 'Filtrar por tipo de saída',
                            type: 'select',
                            options: expenseTypes.map((type) => ({
                                label: type.name,
                                value: type.id.toString(),
                            })),
                        },
                     
                    ]}
                />
            </div>


        </AppLayout>
    );
}
