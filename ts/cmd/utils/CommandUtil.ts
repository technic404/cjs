

export const CommandUtil = {
    getFlags(args: string[], mapping: { [key: string]: string }): { [key: string]: string | boolean} {
        const flags: { [key: string]: string | boolean } = {};
      
        for (let i = 2; i < args.length; i++) {
            const arg = args[i];
      
            if (arg.startsWith('--')) {
                // Long flag
                const [key, value] = arg.slice(2).split('=');
                flags[key] = value || true;
            } else if (arg.startsWith('-')) {
                // Short flag(s)
                const shortFlags = arg.slice(1).split('');
                shortFlags.forEach((shortFlag, index) => {
                    const nextArg = args[i + 1];
                    const key = shortFlag in mapping ? mapping[shortFlag] : shortFlag;
        
                    if (nextArg && !nextArg.startsWith('-') && index === shortFlags.length - 1) {
                        flags[key] = nextArg;
                    } else {
                        flags[key] = true;
                    }
                });
            }
        }
      
        return flags;
    },
    
    getArgumentsWithoutFlags(args: string[]): string[] {
        const filteredArgs: string[] = [];
      
        for (let i = 2; i < args.length; i++) {
            const arg = args[i];
      
            if (!arg.startsWith('-')) {
                // Exclude arguments starting with '-'
                filteredArgs.push(arg);
            } else {
                // Check if it's a short flag (-abc)
                if (arg.startsWith('-') && arg.length > 1) {
                    const shortFlags = arg.slice(1).split('');
                    shortFlags.forEach((shortFlag, index) => {
                        const nextArg = args[i + 1];
        
                        // Skip the next argument if it's a value for the short flag
                        if (nextArg && !nextArg.startsWith('-') && index === shortFlags.length - 1) {
                            i++;
                        }
                    });
                }
            }
        }
      
        return filteredArgs;
    }
};