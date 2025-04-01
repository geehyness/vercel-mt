'use client';

import { writeClient } from "@/lib/sanity.client";

export function TokenDebug() {
  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 text-sm">
      <p>Project ID: {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}</p>
      <p>Dataset: {process.env.NEXT_PUBLIC_SANITY_DATASET}</p>
      <p>Token: {process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN ? '*****' : 'MISSING'}</p>
      <button 
        onClick={async () => {
          try {
            const testDoc = {
              _type: 'test',
              message: 'Permission test',
              timestamp: new Date().toISOString()
            };
            const result = await writeClient.create(testDoc);
            alert(`Success! Document ID: ${result._id}`);
          } catch (error) {
            alert(`Error: ${error.message}`);
          }
        }}
        className="mt-2 px-3 py-1 bg-yellow-100 border border-yellow-300 rounded"
      >
        Test Write Permissions
      </button>
    </div>
  );
}