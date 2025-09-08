import { Button } from '@/components/ui/button';
import { ScanQrCode } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';
import { fetchWithCsrf } from '@/utils/fetch';
import { scheduleScraping } from '@/routes';
import { toast } from 'sonner';
import { DialogClose } from '@radix-ui/react-dialog';


export function ReadQrCode() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [data, setData] = useState<{
        url: string
        key: string
    } | null>(null);
    function formatData(rawValue: string) {
        const regex = /\b\d{44}\b/;
        const resultado = rawValue.match(regex);
        if (!resultado) return;
        setData({
            url: rawValue,
            key: resultado[0]
        })
    }

    function schedule(data: { url: string, key: string }) {
        fetchWithCsrf().post(scheduleScraping().url, data).then(() => {
            setData(null);
            setDialogOpen(false);
            toast.success('Scraping agendado com sucesso!');
        }).catch(() => {
            toast.error('Erro ao agendar scraping.');
        })
        return
    }
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <ScanQrCode className='size-5' /> Scanear QRCode
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Scan QR Code</DialogTitle>
                    <DialogDescription>
                        Scan the QR code using your device's camera.
                    </DialogDescription>
                </DialogHeader>
                {data ? (
                    <div className='flex flex-col gap-4 overflow-hidden'>
                        <div>
                            <strong>URL:</strong>
                            <div className='bg-muted-foreground/10 px-2 py-4 rounded-md flex flex-col gap-2'>
                                <a href={data.url} target='_blank' className='line-clamp-1'>{data.url}</a>
                            </div>
                        </div>
                        <div>
                            <strong>Chave de Acesso:</strong>
                            <p className='break-all'>{data.key}</p>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant='outline' onClick={() => setData(null)}>Cancelar</Button>
                            </DialogClose>
                            <Button variant='outline' onClick={() => schedule(data)}>
                                Agendar
                            </Button>
                        </DialogFooter>
                    </div>
                ) : (
                    <Scanner onScan={(result) => formatData(result[0].rawValue)} />
                )}

            </DialogContent>
        </Dialog>
    )
}
