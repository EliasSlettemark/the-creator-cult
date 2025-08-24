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
  title: "Resources - Compass",
  description:
    "A collection of resources that can help you navigate uncertainty and make choices aligned with your values and goals.",
};

export default function Page() {
  return (
    <CenteredPageLayout
      breadcrumbs={
        <Breadcrumbs>
          <Breadcrumb>Calendar</Breadcrumb>
        </Breadcrumbs>
      }
    >
      <div className="mt-10 space-y-16">
        <Card>
          <iframe
            src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FToronto&showPrint=0&src=YTk0M2E4NjNiMTRjMGUwMWQ1OThhMDI1ODliOGRiYjEwY2RhNjRlZWFlMjZhOWNmNDcwMGUwNzgxMWU5Y2JjMEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23f09300"
            width="800"
            height="600"
            scrolling="no"
            style={{
              borderRadius: "10px",
            }}
            className="w-full"
          ></iframe>
        </Card>
      </div>
    </CenteredPageLayout>
  );
}