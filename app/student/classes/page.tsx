"use client";

import React from "react";
import ComingSoon from "@/components/ComingSoon";
import { BookOpen } from "lucide-react";

export default function StudentClassesPage() {
    return (
        <ComingSoon
            title="Your Interactive Classroom is Being Built"
            description="We're creating a seamless way for you to join live sessions, view recorded lectures, and track your attendance. Stay tuned for a reimagined learning experience."
            icon={BookOpen}
            featureName="My Classes"
        />
    );
}
