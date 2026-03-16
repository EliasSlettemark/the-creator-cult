"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  Heading,
  Text,
  TextField,
  Spinner,
} from "frosted-ui";
import { PlusIcon } from "@radix-ui/react-icons";

function LoadingSpinner({ size }: { size?: "1" | "2" | "3" }): React.ReactElement {
  return React.createElement(Spinner as React.ComponentType<{ size?: "1" | "2" | "3" }>, { size: size ?? "1" });
}

type Folder = {
  id: string;
  name: string;
  created_at: string;
  video_count: number;
};

export default function CollectionsPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchFolders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/collections/folders");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to load folders");
      }
      const data = await res.json();
      setFolders(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load folders");
      setFolders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const createFolder = async () => {
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/collections/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create folder");
      }
      const folder = await res.json();
      setFolders((prev) => [folder, ...prev]);
      setNewName("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create folder");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] py-6 px-4 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Heading size="8">Saved Collections</Heading>
        <Text color="gray">
          Create folders and save TikTok links for inspiration. Paste a link to add videos to a folder.
        </Text>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <TextField.Root className="flex-1 min-w-0">
          <TextField.Input
            placeholder="Folder name (e.g. STRONG HOOKS)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createFolder()}
          />
        </TextField.Root>
        <Button
          onClick={createFolder}
          disabled={creating || !newName.trim()}
        >
          {creating ? (
            <LoadingSpinner size="1" />
          ) : (
            <>
              <PlusIcon width="18" height="18" />
              New folder
            </>
          )}
        </Button>
      </div>

      {error && (
        <Text size="2" className="text-red-400">
          {error}
        </Text>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner size="3" />
        </div>
      ) : folders.length === 0 ? (
        <Card className="p-12 text-center">
          <Text color="gray">
            No folders yet. Create one above to start saving inspiration videos.
          </Text>
        </Card>
      ) : (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {folders.map((folder) => (
            <Link key={folder.id} href={`/dashboard/collections/${folder.id}`}>
              <Card
                className="p-6 cursor-pointer hover:bg-gray-a3 transition-colors border border-gray-a4"
                asChild
              >
                <div>
                  <Heading size="4" className="mb-1">
                    {folder.name}
                  </Heading>
                  <Text size="2" color="gray">
                    {folder.video_count} video{folder.video_count !== 1 ? "s" : ""}
                  </Text>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
