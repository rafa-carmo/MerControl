import { Bell, ChevronDown, Dot } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function NotificationBell() {
    return (
        <div className="hidden md:flex items-center gap-0">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-accent-foreground/25 transition-colors duration-500 rounded-r-none relative">
                        <span className="sr-only">Open sidebar</span>
                        <Bell className='size-4' />
                        <Dot className="absolute -right-3 -top-3 size-11 text-red-500 z-10 animate-pulse" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="end" asChild>
                    <div className="w-80 h-60 p-4 flex flex-col">
                        <p className="font-medium mb-2">Notifications</p>
                    </div>
                </PopoverContent>
            </Popover>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className='hover:bg-accent-foreground/25 transition-colors duration-500 rounded-l-none w-6'>
                        <span className="sr-only">Open notifications</span>
                        <ChevronDown className='size-4' />
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="end" asChild>
                    <div className="w-80 h-60 p-4 flex flex-col">
                        <p className="font-medium mb-2">
                            Other actions
                        </p>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
