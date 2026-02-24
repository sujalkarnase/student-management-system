"use client";

import ComingSoon from "@/components/ComingSoon";
import { Settings } from "lucide-react";

export default function SettingsPage() {
    return (
        <ComingSoon
            title="Personalize your teaching workspace."
            description="Configure your dashboard, notification preferences, and teaching schedule. Tailor the platform to match your specific pedagogical style and administrative needs."
            icon={Settings}
            featureName="Teacher Settings"
        />
    );
}
