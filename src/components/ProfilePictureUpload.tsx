import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, User, Camera } from 'lucide-react';
import { dataService } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';

interface ProfilePictureUploadProps {
  memberId: string;
  currentAvatarUrl?: string;
  memberName: string;
  onClose: () => void;
  onUploadSuccess: (newAvatarUrl: string) => void;
}

const ProfilePictureUpload = ({
  memberId,
  currentAvatarUrl,
  memberName,
  onClose,
  onUploadSuccess,
}: ProfilePictureUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      // Upload file to Supabase storage
      const fileName = `profile_${memberId}_${Date.now()}.${selectedFile.name.split('.').pop()}`;
      const avatarUrl = await dataService.uploadPhotoToStorage(
        selectedFile,
        `avatars/${fileName}`
      );

      if (!avatarUrl) {
        throw new Error('Failed to upload image');
      }

      // Update family member with new avatar URL
      const updatedMember = await dataService.updateFamilyMember(memberId, {
        avatar_url: avatarUrl,
      });

      if (updatedMember) {
        onUploadSuccess(avatarUrl);
        toast({
          title: 'Success!',
          description: 'Profile picture updated successfully.',
        });
        onClose();
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to update profile picture. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            Update {memberName}'s Profile Picture
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Picture */}
          <div className="text-center">
            <Label>Current Picture</Label>
            <div className="mt-2 w-24 h-24 mx-auto">
              {currentAvatarUrl ? (
                <img
                  src={currentAvatarUrl}
                  alt={memberName}
                  className="w-full h-full object-cover rounded-full border-2 border-gray-200"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-full border-2 border-gray-200 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <Label htmlFor="profile-upload">New Picture</Label>
            <div
              className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <div className="space-y-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-24 h-24 mx-auto rounded-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setPreview(null);
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-8 h-8 mx-auto text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Drop your photo here or click to browse
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports JPG, PNG up to 5MB
                    </p>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                id="profile-upload"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Update Picture
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;