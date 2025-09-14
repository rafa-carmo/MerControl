import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { router } from "@inertiajs/react"


export function DataTablePagination(
    { current_page, total, per_page, first_page_url, from, last_page_url, next_page_url, path, prev_page_url, to }:
        // eslint-disable-next-line
        Paginated<any>) {
    return (
        <div className="flex items-center justify-between px-2">
            <div className="text-muted-foreground flex-1 text-sm">
                Showing {from} to {to} of {total} results
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={`${per_page}`}
                        onValueChange={(value) => {
                            router.visit(path, { data: { perPage: value }, preserveState: true })
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={per_page} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {current_page} of {Math.ceil(total / per_page)}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden size-8 lg:flex"
                        onClick={() => router.visit(first_page_url!)}
                        disabled={!prev_page_url}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => router.visit(prev_page_url!)}
                        disabled={!prev_page_url}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => router.visit(next_page_url!)}
                        disabled={!next_page_url}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden size-8 lg:flex"
                        onClick={() => router.visit(last_page_url!)}
                        disabled={!next_page_url}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    )
}
