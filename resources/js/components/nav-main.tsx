import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useTrans } from '@/composables/translate';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{useTrans('Platform')}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    if (item.href) return (

                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={page.url.startsWith(typeof item.href === 'string' ? item.href : item.href.url)}
                                tooltip={{ children: useTrans(item.title) }}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{useTrans(item.title)}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                    if (item.subitems && item.subitems.length > 0) return (
                        <div className='bg-primary/5 rounded-lg'>
                            <SidebarMenuButton
                                asChild
                                tooltip={{ children: useTrans(item.title) }}
                            >
                                <span >{item.icon && <item.icon />} {useTrans(item.title)}</span>
                            </SidebarMenuButton>
                            <SidebarMenuItems items={item.subitems} />
                        </div>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

function SidebarMenuItems({ items }: { items: NavItem[] }) {
    const page = usePage();

    return (
        <>
            {items.map((subitem) => (
                <SidebarMenuItem className='pl-4' key={subitem.title}>
                    <SidebarMenuButton
                        asChild
                        tooltip={{ children: subitem.title }}
                        isActive={subitem.href ? page.url.startsWith(typeof subitem.href === 'string' ? subitem.href : subitem.href.url) : false}
                    >
                        {subitem.subitems && subitem.subitems.length > 0 ? (
                            <>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={{ children: useTrans(subitem.title) }}
                                    className=''
                                >
                                    <span>{useTrans(subitem.title)}</span>
                                </SidebarMenuButton>
                                <SidebarMenuItems items={subitem.subitems} />
                            </>
                        ) : (
                            <Link href={subitem.href} prefetch>
                                {subitem.icon && <subitem.icon />}
                                <span>{useTrans(subitem.title)}</span>
                            </Link>
                        )}
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </>
    );
}

