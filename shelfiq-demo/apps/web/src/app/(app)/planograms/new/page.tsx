import { redirect } from "next/navigation";

// /planograms/new is a redirect-only route that opens the modal on the list page.
export default function NewPlanogramRedirect() {
  redirect("/planograms?new=true");
}
