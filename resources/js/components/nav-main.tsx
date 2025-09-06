import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { trans } from '@/composables/translate';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { CommandDemo } from './global/search';
import { Command, CommandGroup, CommandInput, CommandItem } from './ui/command';

function HasSubitems({ has, href, children }: { has: boolean, href?: string, children: React.ReactNode }) {
    console.log(href)
    if (has) {
        return <Link href={href} prefetch>{children}</Link>
    }
    return <div>{children}</div>
}

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{trans('Platform')}</SidebarGroupLabel>
            <SidebarMenu>

                {/* <CommandDemo /> */}
                <Command className=" w-full bg-transparent">
                    <CommandInput placeholder="Buscar" />
                    {items.map((item) => (
                        <CommandGroup className='[&_[cmdk-group-heading]]:px-0 ' key={item.title}
                            heading={
                                <HasSubitems has={item.subitems && item.subitems.length > 0 || true} href={item.href?.url}>
                                    <SidebarMenuButton className='px-2' tooltip={{ children: trans(item.title) }}>
                                        {item.icon && <item.icon />}
                                        {trans(item.title)}
                                    </SidebarMenuButton>
                                </HasSubitems>
                            }>
                            {item.subitems && item.subitems.length > 0 && (
                                item.subitems.map((subitem) => (
                                    <CommandItem key={subitem.title}>
                                        <SidebarMenuButton
                                            asChild
                                            // isActive={page.url.startsWith(typeof subitem.href === 'string' ? subitem.href : subitem.href.url)}
                                            tooltip={{ children: trans(subitem.title) }}
                                        >
                                            <Link href={subitem.href} prefetch>
                                                {subitem.icon && <subitem.icon />}
                                                <span>{trans(subitem.title)}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </CommandItem>
                                ))
                            )}
                        </CommandGroup>
                    )
                    )}
                </Command>


            </SidebarMenu>
        </SidebarGroup>
    );
}
