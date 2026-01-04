import React, { useRef, useState } from 'react';
import './AvatarUpload.css';

interface AvatarUploadProps {
  currentAvatar?: string;
  userName: string;
  onUpload: (file: File) => Promise<void>;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  currentAvatar, 
  userName,
  onUpload 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(currentAvatar);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validações
    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito grande! Máximo 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Formato não permitido! Use: JPG, PNG ou WebP');
      return;
    }

    // Preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setIsUploading(true);
    try {
      await onUpload(file);
    } catch (error) {
      console.error('Erro no upload:', error);
      setPreview(currentAvatar); // Reverter preview
    } finally {
      setIsUploading(false);
    }
  };

  const getInitials = () => {
    return userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="avatar-upload">
      <div className="avatar-container" onClick={handleClick}>
        {preview ? (
          <img src={preview} alt={userName} className="avatar-image" />
        ) : (
          <div className="avatar-initials">{getInitials()}</div>
        )}
        
        <div className="avatar-overlay">
          {isUploading ? (
            <div className="avatar-loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="avatar-icon">📷</div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <p className="avatar-hint">
        Clique para alterar foto
        <br />
        <small>JPG, PNG ou WebP (máx. 5MB)</small>
      </p>
    </div>
  );
};
