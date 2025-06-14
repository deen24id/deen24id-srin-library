import { cn } from "@/lib/utils";

export function H1({ className = "", ...props }) {
  return (
    <h1
      className={cn(
        `
		    font-semibold 
        text-2xl 
        tracking-tight
        text-foreground
				`,
        className
      )}
      {...props}
    />
  );
}

export function H2({ className = "", ...props }) {
  return (
    <h2
      className={cn(
        `
		    font-semibold 
        text-xl 
        tracking-tight
        text-foreground
				`,
        className
      )}
      {...props}
    />
  );
}

export function H3({ className = "", ...props }) {
  return (
    <h3
      className={cn(
        `
        font-medium
        tracking-tight
        text-foreground
				`,
        className
      )}
      {...props}
    />
  );
}

export function Muted({ className = "", ...props }) {
  return (
    <p
      className={cn(
        `
        text-muted-foreground
				text-sm
				`,
        className
      )}
      {...props}
    />
  );
}

export function P({ className = "", ...props }) {
  return (
    <p
      className={cn(
        `
        text-primary
        leading-7 
        text-left 
				`,
        className
      )}
      {...props}
    />
  );
}
