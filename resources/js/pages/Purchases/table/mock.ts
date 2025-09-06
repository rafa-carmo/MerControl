import { Payment } from "./columns";

const purchasesMock: Payment[] = Array.from({ length: 20 }, (_, i) => ({
    id: `purchase-${i + 1}`,
    amount: Number((Math.random() * 1000).toFixed(2)),
    quantity: Math.floor(Math.random() * 50) + 1,
    place: `Place ${Math.floor(Math.random() * 10) + 1}`,
    purchaseData: new Date(
        Date.now() - Math.floor(Math.random() * 10000000000)
    ),
}));

export default purchasesMock;
