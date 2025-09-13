import { fetchWithCsrf } from "@/utils/fetch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { pendingScraping } from "@/routes";
import { useEffect, useState } from "react";
import { trans } from '../composables/translate';

export function DialogPendingScraping() {
    const [pendingScrapings, setPendingScrapings] = useState<PendingScraping[]>([]);
    useEffect(() => {
        fetchWithCsrf().get(pendingScraping().url).then(async (response) => {
            setPendingScrapings(response.data);
        });
    }, []);
    if (typeof window === 'undefined') return null;

    return (
        <Dialog>
            <DialogTrigger asChild className="w-full hover:bg-accent-foreground/25 transition-colors px-2 py-1 cursor-pointer">
                <button className="w-full text-left text-sm  cursor-pointer">{trans("Pending Scrapings")}</button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{trans("Pending Scraping List")}</DialogTitle>
                    <DialogDescription asChild>
                        {pendingScrapings.length === 0 ? (
                            <p className="text-sm">{trans("No pending scrapings found.")}</p>

                        ) : (
                            <ul className="list-disc list-inside space-y-2 border-foreground bg-muted p-2">
                                {pendingScrapings.map((scraping) => (
                                    <li key={scraping.id} className="text-sm text-foreground flex flex-col gap-1 p-2 border border-border rounded relative">
                                        <span className="text-xs text-foreground">
                                            {trans("Created at")}: {new Date(scraping.created_at).toLocaleDateString()}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            <a href={scraping.url} target="_blank" className="underline hover:text-primary">{scraping.key}</a>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}

                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
