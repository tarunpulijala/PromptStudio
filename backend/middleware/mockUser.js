export default function mockUser(req, res, next) {
  // Hardcoded user and AD group for local dev
  req.user = {
    userId: 'user-123',
    adGroup: 'promptstudio-admins'
  };
  next();
}
