import { Order } from "./order";
import { OrderReceiveDetail } from "./order-receive-detail";

export interface OrderReceive {
    id: number;
    order: Order;
    order_receive_details: OrderReceiveDetail[];
    receive_code: string;
    receive_date: string;
    [key: string]: any;
}

export interface OrderReceiveLink {
    url: string | null;
    label: string;
    active: boolean;
}
