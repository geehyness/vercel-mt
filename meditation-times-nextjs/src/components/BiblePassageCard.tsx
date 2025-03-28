// src/components/BiblePassageCard.tsx
interface BiblePassageCardProps {
    passage: string;
    reference: string;
  }
  
  export default function BiblePassageCard({ passage, reference }: BiblePassageCardProps) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg mb-4 border border-gray-200">
        <h3 className="font-medium text-blue-600 mb-2">{reference}</h3>
        <pre className="whitespace-pre-wrap font-sans text-gray-800">{passage}</pre>
      </div>
    );
  }