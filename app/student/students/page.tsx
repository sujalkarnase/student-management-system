"use client";

import React from "react";
import ComingSoon from "@/components/ComingSoon";
import { Users } from "lucide-react";

export default function StudentDirectoryPage() {
    return (
        <ComingSoon
            title="Connect with Your Peers"
            description="A central student directory is coming soon. Soon you'll be able to connect with classmates, form study groups, and collaborate on projects effortlessly."
            icon={Users}
            featureName="Student Directory"
        />
    );
}
