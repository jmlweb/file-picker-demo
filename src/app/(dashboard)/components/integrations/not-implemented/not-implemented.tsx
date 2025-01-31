import IntegrationsContentLayout from '../integrations-content-layout/integrations-content-layout';

export default function NotImplemented() {
  return (
    <IntegrationsContentLayout title="Not implemented">
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <h2 className="text-xl font-semibold">Coming Soon!</h2>
        <p className="text-muted-foreground">
          We&apos;re working hard to bring you this integration. Please check
          back later!
        </p>
      </div>
    </IntegrationsContentLayout>
  );
}
