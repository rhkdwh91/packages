interface ProfileImageProps {
  src?: string | null;
  width?: number;
  height?: number;
}

export default function ProfileImage({
  src,
  width = 25,
  height = 25,
}: ProfileImageProps) {
  return (
    <div className="border-2 rounded-full mr-1 inline-block overflow-hidden">
      <img src={src ?? ""} alt="profile image" width={width} height={height} />
    </div>
  );
}
