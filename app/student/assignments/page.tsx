"use client";

import React from "react";
import ComingSoon from "@/components/ComingSoon";
import { BookOpen } from "lucide-react";

export default function StudentAssignmentsPage() {
    return (
        <ComingSoon
            title="Streamlined Assignment Tracking"
            description="Never miss a deadline again. We're building a centralized dashboard for you to track, submit, and receive feedback on all your academic tasks."
            icon={BookOpen}
            featureName="Assignments"
        />
    );
}
