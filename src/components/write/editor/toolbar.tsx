import CategoryField from "./category-field";
import TagField from "./tag-field";

interface WriteToolbarProps {
  categories: string[];
  category: string;
  title: string;
  tags: string[];
  thumbnail: string;
  pending: boolean;
  onCategory: (value: string) => void;
  onTitle: (value: string) => void;
  onTags: (tags: string[]) => void;
  onThumbnail: () => void;
  onImage: () => void;
  onDraft: () => void;
}

export default function WriteToolbar({
  categories,
  category,
  title,
  tags,
  thumbnail,
  pending,
  onCategory,
  onTitle,
  onTags,
  onThumbnail,
  onImage,
  onDraft,
}: WriteToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3">
      <CategoryField
        categories={categories}
        value={category}
        onChange={onCategory}
      />
      <input
        name="title"
        value={title}
        onChange={(event) => onTitle(event.target.value)}
        placeholder="제목"
        className="min-w-60 flex-1 rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-mint"
      />
      <TagField tags={tags} onChange={onTags} />
      <button
        type="button"
        onClick={onThumbnail}
        className="rounded-md border border-line px-3 py-2 text-sm hover:border-mint"
      >
        {thumbnail ? "썸네일 변경" : "썸네일"}
      </button>
      <button
        type="button"
        onClick={onImage}
        className="rounded-md border border-line px-3 py-2 text-sm hover:border-mint"
      >
        이미지
      </button>
      <button
        type="button"
        onClick={onDraft}
        className="rounded-md border border-line px-3 py-2 text-sm hover:border-mint"
      >
        임시저장
      </button>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-charcoal px-4 py-2 text-sm text-white hover:bg-ink disabled:opacity-60"
      >
        {pending ? "저장 중..." : "발행"}
      </button>
    </div>
  );
}
