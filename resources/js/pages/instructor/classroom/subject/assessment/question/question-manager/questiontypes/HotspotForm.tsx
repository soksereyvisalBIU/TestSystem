import { useState } from 'react';
import { Label } from '@/components/ui/label';

export default function HotspotForm({ data, onChange }: any) {
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onChange({ ...data, x, y, radius: data.radius || 5 });
  };

  return (
    <div className="space-y-4">
      <Label>Click image to set target hotspot</Label>
      <div className="relative inline-block overflow-hidden rounded-lg border">
        <img 
          src={data.imageUrl || 'https://placehold.co/600x400?text=Upload+Image'} 
          className="max-w-full cursor-crosshair"
          onClick={handleImageClick}
        />
        {data.x && (
          <div 
            className="absolute border-2 border-red-500 rounded-full bg-red-500/20"
            style={{ 
              left: `${data.x}%`, top: `${data.y}%`, 
              width: '30px', height: '30px', transform: 'translate(-50%, -50%)' 
            }}
          />
        )}
      </div>
    </div>
  );
}