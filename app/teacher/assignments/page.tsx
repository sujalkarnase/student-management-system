"use client";

import ComingSoon from "@/components/ComingSoon";
import { BookOpen } from "lucide-react";

export default function AssignmentsPage() {
    return (
        <ComingSoon
            title="Streamlined assignments and digital grading."
            description="Create, distribute, and grade assignments in a unified digital workspace. Experience a frictionless workflow with real-time feedback loops and automated plagiarism checks."
            icon={BookOpen}
            featureName="Assignment Workflow"
        />
    );
}
