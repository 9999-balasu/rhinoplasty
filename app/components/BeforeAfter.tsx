import Image from "next/image";

export default function BeforeAfter({ before, after }: { before: string; after: string }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-center">Before</h3>
        <Image src={before} alt="Before" width={500} height={500} className="w-full rounded-lg shadow-lg" />
      </div>
      <div>
        <h3 className="text-center">After</h3>
        <Image src={after} alt="After" width={500} height={500} className="w-full rounded-lg shadow-lg" />
      </div>
    </div>
  );
}
