"use client";

import React, {
    useEffect,
    useState,
    useCallback,
    useMemo,
    memo,
} from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    Button,
    Card,
    Heading,
    Text,
    TextField,
    Spinner,
    IconButton,
} from "frosted-ui";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
} from "@headlessui/react";
import { ArrowLeftIcon, PlusIcon, TrashIcon, CopyIcon } from "@radix-ui/react-icons";
import { Download } from "lucide-react";
import { Inset, Separator } from "frosted-ui";

function LoadingSpinner({
    size = "1",
}: {
    size?: "1" | "2" | "3";
}): React.ReactElement {
    return React.createElement(Spinner as React.ComponentType<{ size?: "1" | "2" | "3" }>, { size });
}

type Video = {
    id: string;
    folder_id: string;
    original_url: string;
    video_id: string;
    transcript: string | null;
    created_at: string;
};

type Folder = {
    id: string;
    name: string;
    created_at: string;
    user_id: string;
};

type VideoModuleProps = {
    video: Video;
    deletingId: string | null;
    onRemove: (id: string) => void;
    onTranscriptGenerated: (id: string, transcript: string) => void;
};

const VideoModule = memo(function VideoModule({
    video,
    deletingId,
    onRemove,
    onTranscriptGenerated,
}: VideoModuleProps) {
    const [transcript, setTranscript] = useState<string | null>(video.transcript);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transcriptDialogOpen, setTranscriptDialogOpen] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        setTranscript(video.transcript);
    }, [video.transcript]);

    const hasTranscript = transcript !== null && transcript.length > 0;

    const handleGenerateTranscript = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/transcribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    videoId: video.video_id,
                    originalUrl: video.original_url,
                }),
            });
            const data = await response.json().catch((error) => {
                console.log(error)
            });

            if (!response.ok) {
                throw new Error();
            }
            const text = typeof data.transcript === "string" ? data.transcript : "";
            setTranscript(text);
            onTranscriptGenerated(video.id, text);
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Failed to generate transcript"
            );
        } finally {
            setLoading(false);
        }
    }, [video.id, video.video_id, video.original_url, loading, onTranscriptGenerated]);

    const handleCopyTranscript = useCallback(() => {
        if (!transcript) return;
        navigator.clipboard.writeText(transcript).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    }, [transcript]);

    const handleDownloadTranscript = useCallback(() => {
        if (!transcript) return;
        const blob = new Blob([transcript], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `tiktok-transcript-${video.video_id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [transcript, video.video_id]);

    const isDeleting = deletingId === video.id;

    const onTranscriptButtonClick = () => {
        if (hasTranscript) setTranscriptDialogOpen(true);
        else handleGenerateTranscript();
    };

    return (
        <div className="video-module flex flex-col gap-2 w-full min-w-0">
            <div className="relative w-full bg-gray-a2 rounded-xl overflow-hidden" style={{ aspectRatio: "325 / 575" }}>
                <iframe
                    src={`https://www.tiktok.com/embed/${video.video_id}`}
                    allowFullScreen
                    scrolling="no"
                    frameBorder="0"
                    className="w-full h-full rounded-xl"
                    loading="lazy"
                    title={`TikTok ${video.video_id}`}
                />
                <div className="absolute top-2 right-2">
                    <IconButton
                        size="1"
                        color="red"
                        variant="soft"
                        onClick={() => onRemove(video.id)}
                        disabled={isDeleting}
                        title="Remove from folder"
                    >
                        {isDeleting ? (
                            <span className="inline-flex"><LoadingSpinner size="1" /></span>
                        ) : (
                            <TrashIcon width="16" height="16" />
                        )}
                    </IconButton>
                </div>
            </div>

            <div className="controls-row flex flex-wrap items-center gap-2">
                <a
                    href={video.original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-a11 hover:text-accent-11"
                >
                    Open on TikTok
                </a>
                <Button
                    size="2"
                    variant={hasTranscript ? "soft" : "solid"}
                    onClick={onTranscriptButtonClick}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="inline-flex"><LoadingSpinner size="1" /></span>
                            Processing transcript
                        </>
                    ) : hasTranscript ? (
                        "View transcript"
                    ) : (
                        "Generate Transcript"
                    )}
                </Button>
            </div>

            {error && (
                <Text size="1" className="text-red-400">
                    {error}
                </Text>
            )}

            <Dialog
                open={transcriptDialogOpen}
                onClose={() => setTranscriptDialogOpen(false)}
                className="relative z-50"
            >
                <DialogBackdrop className="fixed inset-0 bg-gray-950/50 transition-opacity data-closed:opacity-0" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-full max-w-2xl max-h-[85vh] overflow-hidden">
                        <Card className="w-full max-h-[85vh] flex flex-col">
                            <Inset side="all" pb="current" className="p-6 flex flex-col flex-1 min-h-0">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                    <Heading size="6">Transcript</Heading>
                                    <div className="flex gap-2 flex-wrap">
                                        <Button
                                            variant="ghost"
                                            size="2"
                                            onClick={handleCopyTranscript}
                                            title="Copy transcript"
                                        >
                                            <CopyIcon width="16" height="16" className="mr-2" />
                                            <Text size="2">{copySuccess ? "Copied" : "Copy"}</Text>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="2"
                                            onClick={handleDownloadTranscript}
                                            title="Download transcript"
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            <Text size="2">Download</Text>
                                        </Button>
                                    </div>
                                </div>
                                <Separator className="mb-4" />
                                <div className="flex-1 overflow-y-auto min-h-0">
                                    <Text size="2" className="whitespace-pre-wrap break-words">
                                        {transcript}
                                    </Text>
                                </div>
                            </Inset>
                        </Card>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    );
});

export default function FolderPage() {
    const params = useParams();
    const folderId = params?.folderId as string;

    const [folder, setFolder] = useState<Folder | null>(null);
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [pasteUrl, setPasteUrl] = useState("");
    const [error, setError] = useState<string | null>(null);

    const fetchFolder = useCallback(async () => {
        try {
            const res = await fetch(`/api/collections/folders/${folderId}`);
            if (!res.ok) {
                if (res.status === 404) return;
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Failed to load folder");
            }
            const data = await res.json();
            setFolder(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load folder");
        }
    }, [folderId]);

    const fetchVideos = useCallback(async () => {
        try {
            const res = await fetch(`/api/collections/folders/${folderId}/videos`);
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Failed to load videos");
            }
            const data = await res.json();
            setVideos(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load videos");
            setVideos([]);
        }
    }, [folderId]);

    useEffect(() => {
        if (!folderId) return;
        setLoading(true);
        setError(null);
        Promise.all([fetchFolder(), fetchVideos()]).finally(() =>
            setLoading(false)
        );
    }, [folderId, fetchFolder, fetchVideos]);

    const addVideo = async () => {
        const url = pasteUrl.trim();
        if (!url) return;
        setAdding(true);
        setError(null);
        try {
            const res = await fetch(`/api/collections/folders/${folderId}/videos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Failed to add video");
            }
            const video = await res.json();
            setVideos((prev) => [video, ...prev]);
            setPasteUrl("");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to add video");
        } finally {
            setAdding(false);
        }
    };

    const removeVideo = useCallback(async (id: string) => {
        setDeletingId(id);
        setError(null);
        try {
            const res = await fetch(`/api/collections/videos/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Failed to remove video");
            }
            setVideos((prev) => prev.filter((v) => v.id !== id));
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to remove video");
        } finally {
            setDeletingId(null);
        }
    }, []);

    const handleTranscriptGenerated = useCallback((id: string, transcript: string) => {
        setVideos((prev) =>
            prev.map((v) => (v.id === id ? { ...v, transcript } : v))
        );
    }, []);

    const videoModules = useMemo(
        () =>
            videos.map((video) => (
                <VideoModule
                    key={video.id}
                    video={video}
                    deletingId={deletingId}
                    onRemove={removeVideo}
                    onTranscriptGenerated={handleTranscriptGenerated}
                />
            )),
        [videos, deletingId, removeVideo, handleTranscriptGenerated]
    );

    if (loading) {
        return (
            <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center py-8">
                <span className="inline-flex"><LoadingSpinner size="3" /></span>
            </div>
        );
    }

    if (!folder) {
        return (
            <div className="w-full min-h-[calc(100vh-80px)] py-8">
                <Card className="p-8 text-center">
                    <Text>Folder not found.</Text>
                    <Link href="/dashboard/collections">
                        <Button className="mt-4">Back to collections</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full min-h-[calc(100vh-80px)] py-6 px-4 flex flex-col gap-6">
            <Link
                href="/dashboard/collections"
                className="inline-flex items-center gap-2 text-gray-a11 hover:text-gray-a12 w-fit"
            >
                <ArrowLeftIcon width="18" height="18" />
                <Text size="2">Back to Saved Collections</Text>
            </Link>

            <div className="flex flex-col gap-2">
                <Heading size="8">{folder.name}</Heading>
                <Text color="gray">
                    Paste TikTok links below to add inspiration videos. Generate transcripts with the button under each video.
                </Text>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <TextField.Root className="flex-1 min-w-0">
                    <TextField.Input
                        placeholder="Paste TikTok link (e.g. https://www.tiktok.com/@user/video/123...)"
                        value={pasteUrl}
                        onChange={(e) => setPasteUrl(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addVideo()}
                    />
                </TextField.Root>
                <Button
                    onClick={addVideo}
                    disabled={adding || !pasteUrl.trim()}
                >
                    {adding ? (
                        <span className="inline-flex"><LoadingSpinner size="1" /></span>
                    ) : (
                        <>
                            <PlusIcon width="18" height="18" />
                            Add video
                        </>
                    )}
                </Button>
            </div>

            {error && (
                <Text size="2" className="text-red-400">
                    {error}
                </Text>
            )}

            {videos.length === 0 ? (
                <Card className="p-12 text-center">
                    <Text color="gray">
                        No videos in this folder yet. Paste a TikTok link above to add one.
                    </Text>
                </Card>
            ) : (
                <div
                    className="grid gap-3 w-full"
                    style={{
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    }}
                >
                    {videoModules}
                </div>
            )}
        </div>
    );
}
