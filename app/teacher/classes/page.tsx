"use client";

import ComingSoon from "@/components/ComingSoon";
import { BookOpen } from "lucide-react";

export default function ClassesPage() {
    return (
        <ComingSoon
            title="Manage your classes with intelligence and ease."
            description="We're refining the way you interact with your classrooms. From automated seating charts to real-time student performance tracking, the future of teaching starts here."
            icon={BookOpen}
            featureName="Class Management"
        />
    );
}
