import { OrderReceive } from './order-receive';
import { OrderDetail } from "./order-detail";

export interface OrderReceiveDetail {
    id: number;
    order_receive: OrderReceive
    order_detail: OrderDetail;
    [key: string]: any;
}

export interface OrderReceiveDetailLink {
    url: string | null;
    label: string;
    active: boolean;
}
