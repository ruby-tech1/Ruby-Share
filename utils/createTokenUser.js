const createTokenUser = ({ user }) => {
  return {
    name: user.name,
    userId: user.id,
    email: user.email,
    role: user.role,
  };
};

export default createTokenUser;
