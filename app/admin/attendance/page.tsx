"use client";

import ComingSoon from "@/components/ComingSoon";
import { CalendarCheck } from "lucide-react";

export default function AdminAttendancePage() {
    return (
        <ComingSoon
            title="Attendance Tracking"
            icon={CalendarCheck}
            description="Keep track of institutional attendance across all departments. We are implementing automated reporting and real-time absence notifications."
        />
    );
}
