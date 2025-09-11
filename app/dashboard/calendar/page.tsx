import { CenteredPageLayout } from "@/components/centered-layout";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@/components/breadcrumbs";
import { Card } from "frosted-ui";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar - The Creator Cult",
  description:
    "View upcoming events and schedule your activities.",
};

export default function Page() {
  return (
    <div className="w-full h-[calc(100vh-80px)] p-4">
      <Card className="w-full h-full">
        <iframe
          src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FToronto&showPrint=0&src=YTk0M2E4NjNiMTRjMGUwMWQ1OThhMDI1ODliOGRiYjEwY2RhNjRlZWFlMjZhOWNmNDcwMGUwNzgxMWU5Y2JjMEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23f09300"
          width="100%"
          height="100%"
          scrolling="no"
          style={{
            borderRadius: "10px",
            border: "none",
          }}
          className="w-full h-full"
        />
      </Card>
    </div>
  );
}
