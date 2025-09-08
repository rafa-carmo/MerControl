import { Dialog } from '@radix-ui/react-dialog';
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { trans } from '@/composables/translate';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { fetchWithCsrf } from '@/utils/fetch';
import { Copy } from 'lucide-react';
import { ApiToken } from '@/types';

export function TokenGenerate({ updateTokens }: { updateTokens?: (token: ApiToken) => void }) {
    const [token, setToken] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [data, setData] = useState({
        name: '',
        expiration: '',
        // scopes: [] --- IGNORE ---
    });
    function handleCreateToken() {
        fetchWithCsrf().post('/tokens/create', {
            name: data.name,
            expiration: data.expiration,
            // scopes: data.scopes --- IGNORE ---
        }).then(response => {
            setToken(response.data.token)
            if (updateTokens) {
                updateTokens(response.data.tokenData);
            }
        })
    }
    function handleCopyToken() {
        if (token) {

            navigator.clipboard.writeText(token);
            setCopied(true);
            setTimeout(() => setCopied(false), 5000);
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">{trans("Create Token")}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <h3 className="text-lg font-medium leading-6">{trans("Create API Token")}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{trans("Create a new API token for your account.")}</p>
                </DialogHeader>
                {token ? (
                    <div className='space-y-3'>
                        <p className='text-sm text-muted-foreground'>
                            {trans("Your new API token has been created.")}
                        </p>
                        {copied && (
                            <p className='text-sm text-green-600'>
                                {trans("Token copied to clipboard.")}
                            </p>
                        )}
                        <button type='button'
                            title={trans('click to copy token')}
                            className='text-sm text-foreground bg-secondary p-2 rounded line-clamp-1 max-w-screen select-none cursor-pointer w-full relative hover:bg-foreground/5'
                            onClick={handleCopyToken}>
                            {token}
                            <div className='absolute top-0 bottom-0 right-0 flex items-center justify-center h-full bg-transparent rounded transition-colors pointer-events-none'>
                                <Copy className='size-4 pointer-events-auto' />
                            </div>

                            <span className='sr-only'>{trans("Copy token")}</span>
                        </button>
                    </div>
                ) : (

                    <form className='space-y-3'>
                        <Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder={trans("Token Name")} />

                        <Select defaultValue={data.expiration} onValueChange={(value) => setData({ ...data, expiration: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder={trans("Select Expiration")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1D">{trans("1 Day")}</SelectItem>
                                <SelectItem value="7D">{trans("7 Days")}</SelectItem>
                                <SelectItem value="30D">{trans("30 Days")}</SelectItem>
                                <SelectItem value="1Y">{trans("1 Year")}</SelectItem>
                                <SelectItem value='never'>{trans("Never")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </form>
                )}

                <DialogFooter>
                    {!token && (
                        <Button onClick={handleCreateToken}>{trans("Create")}</Button>
                    )}

                    <DialogClose asChild>
                        <Button variant="outline" onClick={() => {
                            setTimeout(() => {
                                setToken(null);
                                setData({ name: '', expiration: '' });
                            }, 300);
                        }}>
                            {token ? trans("Close") : trans("Cancel")}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
