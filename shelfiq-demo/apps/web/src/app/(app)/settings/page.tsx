import { Settings as SettingsIcon } from "lucide-react";
import { ComingSoon } from "@/components/shell/ComingSoon";

export default function SettingsPage() {
  return (
    <ComingSoon
      icon={SettingsIcon}
      title="Settings"
      description="Tenant, integrations, user management."
    />
  );
}
