"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GeneralAccessSelectorProps {
    access: "no" | "viewer" | "editor"
    onChange: (access: "no" | "viewer" | "editor") => void
}

export default function GeneralAccessSelector({ access, onChange }: GeneralAccessSelectorProps) {

    const title = {
        "no": "Restricted",
        "viewer": "View",
        "editor": "Edit"
    }

    const descriptions = {
        "no": "Only users with access can open with the link",
        "viewer": "Any users with the link can view",
        "editor": "Any users with the link can view and edit"
    }

    return (
        <div className="w-full flex flex-col gap-3">
            <Select onValueChange={onChange} value={access} >
                <SelectTrigger>
                    <SelectValue placeholder="Loading..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="no">Restricted</SelectItem>
                    <SelectItem value="viewer">Allow Viewing</SelectItem>
                    <SelectItem value="editor">Allow Editing</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}