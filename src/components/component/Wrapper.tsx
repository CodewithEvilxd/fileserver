'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import {
    DownloadIcon,
    HelpCircle,
    Share,
    ShieldQuestion,
    X,
} from 'lucide-react';

function Wrapper({ children }: { children: React.ReactNode }) {
    const [showInstructions, setShowInstructions] = useState(false);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallPrompt(true);
        });
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setShowInstallPrompt(false);
            }
            setDeferredPrompt(null);
        }
    };
    return (
        <>
            <div
                className={clsx(
                    showInstructions ? 'blur-sm' : '',
                    'flex justify-end items-center w-full fixed top-0'
                )}
            >
                {showInstallPrompt && (
                    <Button
                        onClick={handleInstall}
                        className="m-2"
                    >
                        <DownloadIcon className="mr-2" /> Install App
                    </Button>
                )}
                <Button
                    onClick={() => setShowInstructions(true)}
                    className="m-2"
                >
                    {' '}
                    <HelpCircle className="mr-2" /> Help
                </Button>
            </div>
            <div
                className={clsx(
                    showInstructions ? 'blur-sm' : '',
                    'flex min-h-screen flex-col items-center justify-center p-4'
                )}
            >
                {children}
            </div>
            {showInstructions && (
                <div className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="instructions-overlay bg-black p-4 rounded-lg border border-solid border-white/50 text-card-foreground shadow-sm m-2">
                        <div className="flex justify-between items-center w-full mb-1">
                            <h1 className="font-semibold text-gray-200 text-lg text-center">
                                {' '}
                                <Share className="inline-block mr-2 mb-1" /> How
                                to use File Share
                            </h1>
                            <Button
                                onClick={() => setShowInstructions(false)}
                                className="p-2"
                            >
                                {' '}
                                <X />{' '}
                            </Button>
                        </div>
                        <ul className="list-disc space-y-1 list-inside my-2 text-sm text-gray-500 dark:text-gray-400">
                            <li>
                                Click the "Choose File" button to select one or
                                more files for upload.
                            </li>
                            <li>
                                Click the "Upload" button to upload the selected
                                files to the temporary server.
                            </li>
                            <li>
                                After uploading, you will be provided with a
                                shareable code.
                            </li>
                            <li>
                                Use the code to retrieve your documents later.{' '}
                            </li>
                        </ul>

                        <p className=" text-center text-gray-500 text-sm mt-4">
                            Files will be deleted 24 hrs after upload.
                            <br />
                            <a
                                href="www.instagram.com/game_changer.09"
                                target="_blank"
                                className=" underline underline-offset-1 text-gray-400 hover:text-white"
                            >
                                Sujal Choudhari
                            </a>
                            {' | '}
                            <a
                                href="https://github.com/codewithEvilxd"
                                target="_blank"
                                className=" underline underline-offset-1 text-gray-400 hover:text-white"
                            >
                                Taarak Gada
                            </a>
                            .
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

export default Wrapper;
