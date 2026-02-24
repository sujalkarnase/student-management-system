"use client";

import ComingSoon from "@/components/ComingSoon";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <ComingSoon
            title="System Settings"
            icon={Settings}
            description="Configure your portal's appearance, user roles, and global preferences. Centralized control for every aspect of your student management system."
        />
    );
}
