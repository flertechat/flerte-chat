import { memo } from "react";

export const DashboardSimpleFooter = memo(() => {
  return (
    <footer className="bg-card/50 border-t border-border py-4 mt-auto">
      <div className="container max-w-5xl mx-auto px-4 text-center">
        <p className="text-xs text-muted-foreground">
          © 2025 FlerteChat. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
});

DashboardSimpleFooter.displayName = "DashboardSimpleFooter";
