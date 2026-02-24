"use client";

import ComingSoon from "@/components/ComingSoon";
import { BookOpen } from "lucide-react";

export default function AdminClassesPage() {
    return (
        <ComingSoon
            title="Curriculum & Classes"
            icon={BookOpen}
            description="Manage your institution's courses and active classes. This module will allow you to assign teachers, set schedules, and monitor classroom engagement."
        />
    );
}
