'use client';

import { useState } from 'react';
import Switch from '@/app/ui/dashboard/switch';

export default function Page() {
  const [enabled, setEnabled] = useState(false);
  return (
    <div className="p-8">
      <Switch
        label="Dark mode"
        checked={enabled}
        onChange={setEnabled}
      />
    </div>
  );
}
