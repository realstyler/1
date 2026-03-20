"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "@/components/layout/Footer";
import { useAuthStore } from "@/auth/auth.store";
import { useLogout } from "@/auth/auth.hooks";
import { useErrorToastStore } from "@/stores/useErrorToastStore";
import { useUploadAvatarImage } from "@/images/images.hooks";
import { useUpdateAvatar } from "@/users/users.hooks";

export default function DashboardPage() {
  const { user, setUser } = useAuthStore();
  const logout = useLogout();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { show } = useErrorToastStore();

  const { mutateAsync: uploadAvatar } = useUploadAvatarImage();
  const { mutateAsync: updateAvatar } = useUpdateAvatar();

  if (!user) return null;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { path } = await uploadAvatar(formData);
      
      if (path) {
        const updatedUser = await updateAvatar(path);
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Avatar upload failed:", error);
      show("Failed to upload avatar");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-8 md:p-12">
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-6">
                <div 
                  onClick={handleAvatarClick}
                  className="relative w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-3xl font-serif cursor-pointer overflow-hidden group hover:opacity-90 transition-opacity shrink-0"
                >
                  {user.avatarUrl ? (
                    <Image 
                      src={user.avatarUrl} 
                      alt="User avatar" 
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-sans font-medium">Upload</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                
                <div>
                  <h1 className="text-3xl font-serif text-neutral-900 mb-1 flex items-center gap-3">
                    Welcome, {user.name}
                    {isUploading && <span className="text-sm text-neutral-400 font-sans animate-pulse">Uploading...</span>}
                  </h1>
                  <p className="text-neutral-500">{user.email}</p>
                </div>
              </div>

              {/* Logout Button */}
              <div>
                <button
                  onClick={() => logout()}
                  className="bg-white border border-neutral-200 text-neutral-700 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-neutral-100 hover:text-neutral-900 transition shadow-sm whitespace-nowrap"
                >
                  Log out
                </button>
              </div>
            </div>

            {/* Cards Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <div 
                onClick={() => router.push('/projects')}
                className="p-6 bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              >
                <h3 className="text-lg font-medium text-neutral-900 mb-2 group-hover:text-black transition-colors">
                  My Projects
                </h3>
                <p className="text-neutral-500 text-sm">
                  View and manage your generated transformations.
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  Credits
                </h3>
                <p className="text-neutral-500 text-sm">
                  You have {user.creditsRemaining} generations remaining.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
