"use client";

import React from "react";
import ComingSoon from "@/components/ComingSoon";
import { Settings } from "lucide-react";

export default function StudentSettingsPage() {
    return (
        <ComingSoon
            title="Personalize Your Experience"
            description="Customize your profile, notification preferences, and security settings. We're working on giving you full control over how you interact with the portal."
            icon={Settings}
            featureName="Portal Settings"
        />
    );
}
