import slugify from 'slugify';

export const generateSlug = (text: string): string => {
  return (
    slugify(text, {
      lower: true,
    }) +
    '-' +
    ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
  );
};
