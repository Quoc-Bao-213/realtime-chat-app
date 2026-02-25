import { FEATURE_ITEMS } from "@/modules/home/ui/home-content";
import { FeatureCard } from "@/modules/home/ui/components/feature-card";

export const FeaturesSection = () => {
  return (
    <section id="features" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 space-y-3">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Features built for everyday chat
        </h2>
        <p className="max-w-2xl text-muted-foreground">
          Everything you need to chat quickly, stay focused, and keep your team aligned.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURE_ITEMS.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
    </section>
  );
};

