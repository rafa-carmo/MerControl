import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "./ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { fetchWithCsrf } from "@/utils/fetch";
import { toast } from "sonner";
import { trans } from "@/composables/translate";

export function DeleteDialog({ text, trigger, url, successMessage }: {
    trigger?: React.ReactNode
    text?: string
    url: string
    successMessage?: string
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger ? trigger : (

                    <Button variant="ghost" type="button" className="p-0 m-0">
                        <span className="hidden md:inline">
                            <Trash className="size-4" />
                        </span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <p>{text ?? "Are you sure you want to delete this item?"}</p>
                <DialogFooter>
                    <div className="flex justify-end gap-2">
                        <DialogClose asChild>
                            <Button variant="outline" onClick={() => { }}>{trans("Cancel")}</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={() => {
                            fetchWithCsrf().delete(url).then(() => {
                                toast(successMessage ?? "Deleted successfully")
                                new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
                                    window.location.reload()
                                })
                            })
                        }}>{trans("Delete")}</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
