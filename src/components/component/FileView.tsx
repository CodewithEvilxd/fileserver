import {
    CardTitle,
    CardDescription,
    CardHeader,
    CardContent,
    Card,
} from '@/components/ui/card';

import {
    FileArchive,
    FileAudio,
    FileCode,
    FileIcon,
    FileSearch,
    FileSpreadsheet,
    FileText,
    FileVideo,
    Image,
    Sliders,
} from 'lucide-react';

import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Download, FileSearch2, UploadCloudIcon } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import PocketBase from 'pocketbase';
import toast from 'react-hot-toast';
import { Textarea } from '../ui/textarea';
import { off } from 'process';

interface FileViewProps {
    code?: string;
}

export function FileView({ code = '' }: FileViewProps) {
    const pb = new PocketBase('https://evilxd.pockethost.io/');
    const [fetchedCode, setFetchedCode] = useState<string>('');
    const [fileLinks, setFileLinks] = useState<string[]>([]);
    const [magicWord, setMagicWord] = useState<string>(
        code.length == 4 ? code : ''
    );
    const [collectionID, setCollectionId] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
    const [textFileContent, setTextFileContent] = useState<string>('');
    const [validation, setValidation] = useState(true);

    const magicWordSchema = z
        .string()
        .length(4)
        .regex(
            /^[a-zA-Z]{2}[0-9]{2}$/,
            'Code must be 2 letters followed by 2 digits'
        );

    useEffect(() => {
        if (
            code &&
            code.length === 4 &&
            magicWordSchema.safeParse(code).success &&
            !hasAttemptedFetch
        ) {
            const timer = setTimeout(() => fetchFiles(code), 200); // 200ms delay to ensure proper handling
            return () => clearTimeout(timer); // Clean up timeout on unmount
        }
    }, [code, hasAttemptedFetch]);

    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                handleFetchFiles();
            }
        },
        [magicWord]
    );

    const fetchFiles = async (uniqueId: string) => {
        if (!magicWordSchema.safeParse(uniqueId).success) {
            toast.error('Invalid code');
            return;
        }
        setHasAttemptedFetch(true);
        setLoading(true);
        toast.success('Fetching files...');
        try {
            const res = await pb
                .collection('files')
                .getFirstListItem(
                    `unique = "${uniqueId.trim().toLowerCase()}"`,
                    {}
                );
            console.log(res);
            toast.success('Files found');
            setFileLinks(res.file);
            setCollectionId(res.id);
            setFetchedCode(magicWord);
            setMagicWord('');
            const userInputFile = res.file.find((file: string) =>
                file.startsWith('user_input')
            );
            if (userInputFile) {
                const fileUrl = `https://sujal.pockethost.io/api/files/files/${res.id}/${userInputFile}`;
                const response = await fetch(fileUrl);
                const text = await response.text();
                setTextFileContent(text);
            } else {
                setTextFileContent('');
            }
        } catch (error: any) {
            if (error.toString().includes('ClientResponseError')) {
                toast.error('No files associated to this code!');
                setFileLinks([]);
                setCollectionId('');
                setMagicWord('');
            } else {
                toast.error('Error: ' + error?.toString());
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFetchFiles = () => {
        if (magicWord.length <= 0) {
            toast.error('No word entered.');
            return;
        }
        fetchFiles(magicWord);
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(textFileContent);
        toast.success('Copied to clipboard');
    };

    const getIconForFileType = (name: string) => {
        const fileExt = name.split('.').pop()?.toLowerCase();
        switch (fileExt) {
            case 'pdf':
                return <FileIcon className="h-6 w-6 mr-2" />;
            case 'doc':
            case 'docx':
                return <FileText className="h-6 w-6 mr-2" />;
            case 'xls':
            case 'xlsx':
            case 'csv':
                return <FileSpreadsheet className="h-6 w-6 mr-2" />;
            case 'ppt':
            case 'pptx':
                return <Sliders className="h-6 w-6 mr-2" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'bmp':
            case 'tiff':
                return <Image className="h-6 w-6 mr-2" />;
            case 'mp4':
            case 'mkv':
            case 'webm':
            case 'avi':
                return <FileVideo className="h-6 w-6 mr-2" />;
            case 'mp3':
            case 'wav':
            case 'flac':
                return <FileAudio className="h-6 w-6 mr-2" />;
            case 'zip':
            case 'rar':
            case '7z':
            case 'tar':
            case 'gz':
                return <FileArchive className="h-6 w-6 mr-2" />;
            case 'html':
            case 'css':
            case 'js':
            case 'jsx':
            case 'ts':
            case 'tsx':
            case 'json':
            case 'xml':
                return <FileCode className="h-6 w-6 mr-2" />;
            case 'txt':
            case 'md':
                return <FileText className="h-6 w-6 mr-2" />;
            case 'xls':
            case 'xlsx':
                return <FileSpreadsheet className="h-6 w-6 mr-2" />;
            default:
                return <FileIcon className="h-6 w-6 mr-2" />;
        }
    };

    return (
        <>
            <Card className="h-auto w-11/12 max-w-96 flex flex-col items-center justify-center">
                <CardHeader>
                    <CardTitle>Enter the Shared Code</CardTitle>
                    <CardDescription>
                        Confused? Try uploading a file before receiving the code
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex w-full p-4">
                    <div className="grid w-full rounded-sm">
                        <Input
                            value={magicWord}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setMagicWord(e.target.value);
                                setValidation(
                                    magicWordSchema.safeParse(e.target.value)
                                        .success
                                );
                            }}
                            id="word3"
                            placeholder="XX00"
                            type="text"
                            className={`border font-semibold w-full ${
                                !validation && !!magicWord.length
                                    ? 'border-red-500 text-red-500'
                                    : 'border-gray-500 text-primary/90'
                            }`}
                            maxLength={4}
                            minLength={4}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault(); // Prevent form submission if it's within a form
                                    handleFetchFiles();
                                }
                            }}
                        />
                        {!validation && !!magicWord.length && (
                            <p className="text-red-500 text-sm mt-4 text-center">
                                Code must be 2 letters followed by 2 digits
                            </p>
                        )}
                    </div>
                </CardContent>
                <CardContent className="px-4 m-auto flex flex-col items-center w-full">
                    <Button
                        className="w-full text-md my-2"
                        onClick={handleFetchFiles}
                    >
                        <FileSearch2 className="mr-2" />{' '}
                        {loading ? 'Loading...' : 'Fetch Files'}
                    </Button>
                    <Link
                        href={'/'}
                        className=" w-full my-2"
                    >
                        <Button
                            variant="outline"
                            className="w-full border border-gray-500 text-md"
                        >
                            {' '}
                            <UploadCloudIcon className="mr-2" /> Upload Files
                            Instead
                        </Button>
                    </Link>
                </CardContent>
                {!!fileLinks.length && !textFileContent && (
                    <CardContent className="w-full p-0">
                        <CardHeader className="px-6 pt-6 pb-4">
                            <CardTitle>
                                Files for code : {fetchedCode.toUpperCase()}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {fileLinks.map((link) => {
                                const fileName = link
                                    ? link.split('_')[0] +
                                      (link.includes('.')
                                          ? '.' + link.split('.')[1]
                                          : '')
                                    : '';
                                return (
                                    <div
                                        key={link}
                                        className="flex items-center justify-between mt-2 py-2 rounded-md"
                                    >
                                        <div className="flex items-center flex-grow">
                                            {getIconForFileType(fileName)}
                                            <a
                                                href={`https://sujal.pockethost.io/api/files/files/${collectionID}/${link}`}
                                                className="text-lg underline underline-offset-1 font-semibold truncate max-w-[200px]"
                                                title={fileName}
                                            >
                                                {fileName}
                                            </a>
                                        </div>
                                        <a
                                            href={`https://sujal.pockethost.io/api/files/files/${collectionID}/${link}`}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <Download className="w-6 h-6 text-white" />
                                        </a>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </CardContent>
                )}
                {textFileContent && (
                    <CardContent className="w-full px-4 pb-4">
                        <CardHeader className="px-0 pb-4 pt-0">
                            <CardTitle className="p-0">
                                Text for code : {fetchedCode}
                            </CardTitle>
                        </CardHeader>

                        <Textarea
                            value={textFileContent}
                            className="min-h-52 text-white"
                            wrap="off"
                            disabled
                        />

                        <Button
                            onClick={() => handleCopyToClipboard()}
                            className="mt-4"
                        >
                            Copy to clipboard
                        </Button>
                    </CardContent>
                )}
            </Card>
        </>
    );
}
