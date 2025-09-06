'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LoginForm from './LoginForm';

interface LoginDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LoginDialog({ isOpen, onClose }: LoginDialogProps) {

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Welcome Back</DialogTitle>
                    <p className="text-center text-gray-600 text-sm">Log in to your LUX account</p>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                    <LoginForm />
                </div>
            </DialogContent>
        </Dialog>
    );
}
