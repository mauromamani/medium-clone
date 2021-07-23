import { genSalt, hash, compare } from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt();

  return await hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await compare(password, hashedPassword);
};
