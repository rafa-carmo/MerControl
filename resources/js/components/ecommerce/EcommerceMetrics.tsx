import { ArrowDownIcon, ArrowUpIcon, BoxIcon, GroupIcon } from "lucide-react";
import { Badge } from "../ui/badge";



export default function EcommerceMetrics() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            {/* <!-- Metric Item Start --> */}
            <div className="rounded-2xl border p-5 bg-secondary border-secondary-foreground/25 md:p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary-foreground/10">
                    <GroupIcon className="text-foreground/75" />
                </div>

                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-muted-foreground">
                            Gasto Semanal
                        </span>
                        <h4 className="mt-2 font-bold text-title-sm text-foreground">
                            3,782
                        </h4>
                    </div>
                    <Badge variant="default">
                        <ArrowUpIcon />
                        11.01%
                    </Badge>
                </div>
            </div>
            {/* <!-- Metric Item End --> */}

            {/* <!-- Metric Item Start --> */}
            <div className="rounded-2xl border  p-5 md:p-6  bg-secondary border-secondary-foreground/25 ">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary-foreground/10">
                    <BoxIcon className="text-foreground/75" />
                </div>
                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-muted-foreground">
                            Gasto Mensais
                        </span>
                        <h4 className="mt-2 font-bold text-title-sm text-foreground">
                            5,359
                        </h4>
                    </div>

                    <Badge variant="destructive">
                        <ArrowDownIcon />
                        9.05%
                    </Badge>
                </div>
            </div>
            {/* <!-- Metric Item End --> */}
        </div>
    );
}
