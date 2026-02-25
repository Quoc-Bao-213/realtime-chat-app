import type { FeatureItem } from "@/modules/home/ui/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
  feature: FeatureItem;
}

export const FeatureCard = ({ feature }: FeatureCardProps) => {
  const Icon = feature.icon;

  return (
    <Card className="h-full border-border/70 bg-card/70 shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-card hover:shadow-sm">
      <CardHeader className="space-y-4">
        <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <CardTitle className="text-lg">{feature.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {feature.description}
        </p>
      </CardContent>
    </Card>
  );
};
