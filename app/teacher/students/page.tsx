"use client";

import ComingSoon from "@/components/ComingSoon";
import { Users } from "lucide-react";

export default function StudentsPage() {
    return (
        <ComingSoon
            title="Advanced student insights at your fingertips."
            description="Track student progress, behavior trends, and personalized learning milestones. Our upcoming student module will help you understand every learner better than ever before."
            icon={Users}
            featureName="Student Insights"
        />
    );
}
