import SHA256 from 'crypto-js/sha256';

export const hashPassword = (value: string) => SHA256(value).toString();
