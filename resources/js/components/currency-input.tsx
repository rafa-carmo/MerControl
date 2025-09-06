import { trans } from '@/composables/translate';
import { cn } from '@/lib/utils';
import CurrencyInput, { CurrencyInputProps } from 'react-currency-input-field'

function InputCurrency({ ...props }: CurrencyInputProps) {


    return (<CurrencyInput
        id="input-example"
        name="input-name"
        placeholder="Please enter a number"
        prefix={trans("$ ")}
        decimalsLimit={2}
        onValueChange={(value, name, values) => console.log(value, name, values)}
        {...props}
        className={
            cn(
                "border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                props.className
            )
        }
    />)
}

export default InputCurrency;
