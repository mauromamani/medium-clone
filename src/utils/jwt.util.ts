import { sign } from 'jsonwebtoken';

export const generateJwt = (uid: number): any => {
  return new Promise((resolve, reject) => {
    const payload = { uid };
    sign(
      payload,
      'SUPER-SECRET',
      {
        expiresIn: '1h',
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject(err.message);
        }
        resolve(token);
      },
    );
  });
};
