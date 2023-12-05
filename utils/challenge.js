const challenge = new Map();

export const getChallenge = (id) => {
  return challenge.get(id);
};

export const setChallenge = (id, secret) => {
  challenge.set(id, secret);
};

export const deleteChallenge = (id) => {
  challenge.delete(id);
};
