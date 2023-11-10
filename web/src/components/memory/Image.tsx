export const Image = ({ src, alt }: { src: string; alt: string }) => (
    <img
      src={src}
      alt={alt}
      className="xl:h-[397px] lg:h-[250px] h-[180px] object-cover mb-10 mt-6 rounded-2xl"
    />
  );