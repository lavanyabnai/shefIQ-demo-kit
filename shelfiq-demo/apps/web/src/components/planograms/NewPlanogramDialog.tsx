"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FixtureCard } from "./FixtureCard";
import { fixtures, plans, users } from "@/lib/seed";
import { useCanvasStore } from "@/lib/stores/canvasStore";
import { toast } from "@/components/ui/toast";
import type { Plan } from "@/lib/types";

const CATEGORIES = [
  "Beer",
  "Energy",
  "Cold Beverages",
  "Salty Snacks",
  "Candy",
  "Sports Drinks",
  "Foodservice",
  "Tobacco",
];
const BANNERS = ["Quikstop Core", "Quikstop Express", "Quikstop Fuel"];
const CLUSTERS = ["Urban Premium", "Suburban Family", "Highway Travel"];

const schema = z.object({
  name: z.string().min(2, "Name is required").max(80),
  category: z.string().min(1, "Pick a category"),
  banner: z.string().min(1, "Pick a banner"),
  cluster: z.string().min(1, "Pick a cluster"),
});
type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaults?: Partial<FormValues> & { fixtureId?: string };
}

export function NewPlanogramDialog({ open, onOpenChange, defaults }: Props) {
  const router = useRouter();
  const createPlan = useCanvasStore((s) => s.createPlan);
  const [step, setStep] = React.useState<1 | 2>(defaults?.fixtureId ? 2 : 1);
  const [fixtureId, setFixtureId] = React.useState<string | undefined>(defaults?.fixtureId);
  const [submitting, setSubmitting] = React.useState(false);

  const usageByFixture = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const p of Object.values(plans)) m.set(p.fixtureId, (m.get(p.fixtureId) ?? 0) + 1);
    return m;
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaults?.name ?? "",
      category: defaults?.category ?? "",
      banner: defaults?.banner ?? "",
      cluster: defaults?.cluster ?? "",
    },
  });

  React.useEffect(() => {
    if (open) {
      setStep(defaults?.fixtureId ? 2 : 1);
      setFixtureId(defaults?.fixtureId);
      form.reset({
        name: defaults?.name ?? "",
        category: defaults?.category ?? "",
        banner: defaults?.banner ?? "",
        cluster: defaults?.cluster ?? "",
      });
    }
  }, [open, defaults, form]);

  const onSubmit = form.handleSubmit((values) => {
    if (!fixtureId) return;
    setSubmitting(true);
    const id = `plan-${Math.random().toString(36).slice(2, 9)}`;
    const now = new Date().toISOString();
    const maria = users.find((u) => u.id === "user-maria-chen")!;
    const plan: Plan = {
      id,
      name: values.name,
      version: "v0.1",
      category: values.category,
      banner: values.banner,
      cluster: values.cluster,
      status: "draft",
      effectiveDate: now,
      owner: { id: maria.id, name: maria.name, avatar: maria.avatar },
      fixtureId,
      positions: [],
      createdAt: now,
      updatedAt: now,
    };
    createPlan(plan);
    toast.success(`${values.name} saved as v0.1`, {
      description: `Draft created · ${values.cluster}`,
    });
    onOpenChange(false);
    router.push(`/planograms/${id}`);
    setTimeout(() => setSubmitting(false), 0);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 p-0">
        <DialogHeader className="space-y-1.5 border-b border-border p-5 text-left">
          <div className="flex items-center justify-between">
            <DialogTitle>New planogram</DialogTitle>
            <span className="text-[11.5px] font-medium text-muted-foreground">
              Step {step} of 2
            </span>
          </div>
          <DialogDescription>
            {step === 1
              ? "Pick the fixture this planogram will live on."
              : "Give your planogram a name and pick where it applies."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <ScrollArea className="max-h-[60vh]">
            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
              {fixtures.map((f) => (
                <FixtureCard
                  key={f.id}
                  fixture={f}
                  selected={fixtureId === f.id}
                  usage={usageByFixture.get(f.id) ?? 0}
                  onClick={() => setFixtureId(f.id)}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="np-name">Name</Label>
              <Input
                id="np-name"
                className="mt-1.5"
                placeholder="Energy Reset Q2 — Urban Premium"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="mt-1 text-[11.5px] text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <FormSelect
              id="np-category"
              label="Category"
              options={CATEGORIES}
              value={form.watch("category")}
              onChange={(v) => form.setValue("category", v, { shouldValidate: true })}
              error={form.formState.errors.category?.message}
            />
            <FormSelect
              id="np-banner"
              label="Banner"
              options={BANNERS}
              value={form.watch("banner")}
              onChange={(v) => form.setValue("banner", v, { shouldValidate: true })}
              error={form.formState.errors.banner?.message}
            />
            <FormSelect
              id="np-cluster"
              label="Cluster"
              options={CLUSTERS}
              value={form.watch("cluster")}
              onChange={(v) => form.setValue("cluster", v, { shouldValidate: true })}
              error={form.formState.errors.cluster?.message}
            />
            <div className="rounded-md border border-border bg-muted/40 p-3 text-[11.5px] text-muted-foreground sm:col-span-2">
              <div className="mb-0.5 font-medium text-foreground">Fixture</div>
              <span>{fixtures.find((f) => f.id === fixtureId)?.name ?? "—"}</span>
            </div>
          </form>
        )}

        <DialogFooter className="flex items-center justify-between gap-3 border-t border-border bg-muted/30 px-5 py-3 sm:flex-row">
          {step === 2 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5"
              onClick={() => setStep(1)}
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            {step === 1 ? (
              <Button
                type="button"
                size="sm"
                className="h-8"
                disabled={!fixtureId}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                className="h-8 gap-1.5"
                disabled={submitting}
                onClick={onSubmit}
              >
                {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
                Create draft
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FormSelect({
  id,
  label,
  options,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  options: string[];
  value?: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger id={id} className="mt-1.5">
          <SelectValue placeholder={`Pick a ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="mt-1 text-[11.5px] text-destructive">{error}</p>}
    </div>
  );
}
