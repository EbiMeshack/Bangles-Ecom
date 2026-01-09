"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Doc } from "@/convex/_generated/dataModel";

interface EditUserSheetProps {
    user: Doc<"userProfiles"> | null;
    isOpen: boolean;
    onClose: () => void;
}

export function EditUserSheet({ user, isOpen, onClose }: EditUserSheetProps) {
    const updateUser = useMutation(api.userProfiles.updateUserProfile);
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("user");

    useEffect(() => {
        if (user) {
            setName(user.name ?? "");
            setEmail(user.email ?? "");
            setPhone(user.phoneNumber ?? "");
            setRole(user.role ?? "user");
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);
        try {
            await updateUser({
                userId: user.userId,
                name,
                email,
                phoneNumber: phone,
                role,
            });
            toast.success("User updated successfully");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update user");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="flex w-full flex-col sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Edit User</SheetTitle>
                    <SheetDescription>
                        Make changes to the user profile here. Click save when you're done.
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 p-6">
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? "Saving..." : "Save changes"}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
